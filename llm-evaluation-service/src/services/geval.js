import pLimit from 'p-limit';
import { sendChatCompletion, extractResponseText } from './openrouter.js';
import { config } from '../config.js';
import { createChildLogger } from '../utils/logger.js';

const logger = createChildLogger({ module: 'geval' });

const EVALUATION_PROMPT_TEMPLATE = `You are an expert evaluator for Large Language Model responses. Your task is to evaluate a response based on the G-Eval methodology.

## Context
**Prompt/Question:**
{prompt}

**Reference Answer (if available):**
{reference}

**Response to Evaluate:**
{response}

## Evaluation Criteria
Evaluate the response on a scale of 1-5 for each criterion:

1. **Coherence** (1-5): How well-structured and logically organized is the response? Does it flow naturally and maintain a clear thread of thought?
   - 1: Completely incoherent, disjointed thoughts
   - 3: Mostly coherent with some organizational issues
   - 5: Perfectly structured and logically flowing

2. **Consistency** (1-5): Is the response internally consistent? Does it avoid contradictions and maintain factual accuracy throughout?
   - 1: Major contradictions or factual errors
   - 3: Minor inconsistencies present
   - 5: Fully consistent with no contradictions

3. **Fluency** (1-5): How natural and readable is the response? Is the language grammatically correct and easy to understand?
   - 1: Very difficult to read, many errors
   - 3: Readable with some awkward phrasing
   - 5: Perfectly fluent and natural

4. **Relevance** (1-5): How well does the response address the original prompt? Does it stay on topic and provide useful information?
   - 1: Completely off-topic or irrelevant
   - 3: Partially relevant, addresses some aspects
   - 5: Fully relevant and comprehensive

## Response Format
You MUST respond with ONLY a valid JSON object in this exact format, with no additional text:
{
  "coherence": <number 1-5>,
  "consistency": <number 1-5>,
  "fluency": <number 1-5>,
  "relevance": <number 1-5>,
  "reasoning": "<brief explanation of scores>"
}`;

/**
 * Создать промпт для оценки
 * @param {string} prompt - исходный промпт
 * @param {string} reference - эталонный ответ
 * @param {string} response - ответ для оценки
 * @returns {string}
 */
function buildEvaluationPrompt(prompt, reference, response) {
  return EVALUATION_PROMPT_TEMPLATE
    .replace('{prompt}', prompt || 'N/A')
    .replace('{reference}', reference || 'Not provided')
    .replace('{response}', response || 'Empty response');
}

/**
 * Парсить результат оценки из ответа LLM
 * @param {string} responseText
 * @returns {Object|null}
 */
function parseEvaluationResponse(responseText) {
  try {
    // Пытаемся найти JSON в ответе
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.warn('No JSON found in evaluation response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Валидация
    const { coherence, consistency, fluency, relevance } = parsed;
    const scores = [coherence, consistency, fluency, relevance];

    const { min, max } = config.geval.scale;

    if (scores.some((s) => typeof s !== 'number' || s < min || s > max)) {
      logger.warn({ parsed }, 'Invalid scores in evaluation response');
      return null;
    }

    return {
      coherence,
      consistency,
      fluency,
      relevance,
      reasoning: parsed.reasoning || null,
    };
  } catch (error) {
    logger.error({ error: error.message, responseText }, 'Failed to parse evaluation response');
    return null;
  }
}

/**
 * Оценить один ответ
 * @param {Object} params
 * @param {string} params.promptText - текст промпта
 * @param {string} params.referenceAnswer - эталонный ответ
 * @param {string} params.responseText - ответ для оценки
 * @param {string} params.responseId - ID ответа
 * @returns {Promise<Object>}
 */
export async function evaluateSingleResponse({
  promptText,
  referenceAnswer,
  responseText,
  responseId,
}) {
  const evaluationPrompt = buildEvaluationPrompt(promptText, referenceAnswer, responseText);

  const messages = [
    {
      role: 'system',
      content: 'You are an expert LLM evaluator. Always respond with valid JSON only.',
    },
    {
      role: 'user',
      content: evaluationPrompt,
    },
  ];

  const completion = await sendChatCompletion(messages, {
    temperature: 0.1,
    maxTokens: 512,
  });

  const responseContent = extractResponseText(completion);
  const scores = parseEvaluationResponse(responseContent);

  if (!scores) {
    throw new Error(`Failed to parse evaluation for response ${responseId}`);
  }

  // Вычисляем средний балл по шкале 1-5, затем конвертируем в проценты
  const avg1to5 =
    (scores.coherence + scores.consistency + scores.fluency + scores.relevance) / 4;
  // Формула: ((avg - 1) / 4) * 100 преобразует 1-5 в 0-100%
  const avgScore = Math.round(((avg1to5 - 1) / 4) * 100);

  return {
    response_id: responseId,
    coherence: scores.coherence,
    consistency: scores.consistency,
    fluency: scores.fluency,
    relevance: scores.relevance,
    avg_score: avgScore,
    evaluated_at: new Date().toISOString(),
    evaluator_model: config.openRouter.model,
    reasoning: scores.reasoning,
  };
}

/**
 * Оценить набор ответов для одного промпта
 * @param {Object} promptData - данные промпта с ответами
 * @returns {Promise<Array>}
 */
export async function evaluatePromptResponses(promptData) {
  const { id: promptId, text: promptText, reference_answer, responses } = promptData;

  logger.info({ promptId, responsesCount: responses.length }, 'Evaluating prompt responses');

  const limit = pLimit(config.rateLimit.maxConcurrent);

  const evaluationPromises = responses.map((response) =>
    limit(async () => {
      try {
        const result = await evaluateSingleResponse({
          promptText,
          referenceAnswer: reference_answer,
          responseText: response.response_text,
          responseId: response.id,
        });

        logger.debug(
          { responseId: response.id, avgScore: result.avg_score },
          'Response evaluated'
        );

        return result;
      } catch (error) {
        logger.error(
          { error: error.message, responseId: response.id },
          'Failed to evaluate response'
        );

        return {
          response_id: response.id,
          error: error.message,
        };
      }
    })
  );

  const results = await Promise.all(evaluationPromises);

  const successful = results.filter((r) => !r.error);
  const failed = results.filter((r) => r.error);

  logger.info(
    { promptId, successful: successful.length, failed: failed.length },
    'Prompt evaluation completed'
  );

  return { successful, failed };
}

/**
 * Оценить несколько промптов с их ответами
 * @param {Array} prompts - массив промптов с ответами
 * @returns {Promise<Object>}
 */
export async function evaluateMultiplePrompts(prompts) {
  const startTime = Date.now();

  logger.info({ promptsCount: prompts.length }, 'Starting batch evaluation');

  const allSuccessful = [];
  const allFailed = [];

  for (const prompt of prompts) {
    const { successful, failed } = await evaluatePromptResponses(prompt);
    allSuccessful.push(...successful);
    allFailed.push(...failed);
  }

  const duration = Date.now() - startTime;

  logger.info(
    {
      duration,
      totalSuccessful: allSuccessful.length,
      totalFailed: allFailed.length,
    },
    'Batch evaluation completed'
  );

  return {
    successful: allSuccessful,
    failed: allFailed,
    duration,
  };
}
