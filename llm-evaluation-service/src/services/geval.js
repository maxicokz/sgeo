import pLimit from 'p-limit';
import { sendChatCompletion, extractResponseText } from './openrouter.js';
import { config } from '../config.js';
import { createChildLogger } from '../utils/logger.js';

const logger = createChildLogger({ module: 'geval' });

// Template without reference answer
const EVALUATION_PROMPT_TEMPLATE = `You are a STRICT and CRITICAL evaluator for Large Language Model responses. Your task is to evaluate a response using the G-Eval methodology.

IMPORTANT: Be very critical! Most responses have flaws. A score of 5 should be RARE and only for truly exceptional responses. Average responses should score 2-3.

## Context
**User Prompt/Question:**
{prompt}

**AI Response to Evaluate:**
{response}

## Evaluation Criteria (be strict!)

1. **Coherence** (1-5): Structure and logical organization
   - 1: Incoherent, random thoughts, no structure
   - 2: Poor structure, hard to follow
   - 3: Acceptable structure, some flow issues
   - 4: Good structure, minor issues
   - 5: EXCEPTIONAL - perfect flow (rare!)

2. **Consistency** (1-5): Internal consistency and factual accuracy
   - 1: Major contradictions or obvious errors
   - 2: Several inconsistencies or likely errors
   - 3: Minor inconsistencies present
   - 4: Mostly consistent, tiny issues
   - 5: EXCEPTIONAL - flawless (rare!)

3. **Fluency** (1-5): Language quality and readability
   - 1: Unreadable, many grammar errors
   - 2: Poor language, multiple issues
   - 3: Readable but awkward phrasing
   - 4: Good language, minor issues
   - 5: EXCEPTIONAL - perfect prose (rare!)

4. **Relevance** (1-5): How well it addresses the prompt
   - 1: Completely off-topic
   - 2: Misses main point, tangential
   - 3: Partially addresses the prompt
   - 4: Addresses prompt well, minor gaps
   - 5: EXCEPTIONAL - comprehensive (rare!)

5. **Sentiment**: Overall tone of the response
   - "positive": Helpful, encouraging, optimistic tone
   - "neutral": Factual, objective, balanced tone
   - "negative": Critical, pessimistic, discouraging tone

## Response Format
Respond with ONLY valid JSON (keep reasoning under 150 words):
{
  "coherence": <1-5>,
  "consistency": <1-5>,
  "fluency": <1-5>,
  "relevance": <1-5>,
  "sentiment": "<positive|neutral|negative>",
  "reasoning": "<brief explanation, max 2-3 sentences>"
}`;

// Template with reference answer for stricter evaluation
const EVALUATION_PROMPT_WITH_REFERENCE = `You are a STRICT and CRITICAL evaluator for Large Language Model responses. Your task is to evaluate a response against a REFERENCE ANSWER using the G-Eval methodology.

IMPORTANT: Be very critical! Compare the response to the reference. A score of 5 means the response is AS GOOD AS the reference. Most responses will score lower.

## Context
**User Prompt/Question:**
{prompt}

**Reference/Expected Answer:**
{reference}

**AI Response to Evaluate:**
{response}

## Evaluation Criteria (compare to reference!)

1. **Coherence** (1-5): Structure and organization compared to reference
   - 1: Much worse structure than reference
   - 2: Noticeably worse organization
   - 3: Similar but inferior structure
   - 4: Nearly as well organized
   - 5: As good or better than reference

2. **Consistency** (1-5): Accuracy compared to reference
   - 1: Major errors vs reference
   - 2: Several inaccuracies
   - 3: Some differences from reference
   - 4: Mostly matches reference
   - 5: Fully consistent with reference

3. **Fluency** (1-5): Language quality compared to reference
   - 1: Much worse language quality
   - 2: Noticeably worse readability
   - 3: Similar but inferior language
   - 4: Nearly as fluent
   - 5: As fluent or better

4. **Relevance** (1-5): Completeness compared to reference
   - 1: Misses most key points from reference
   - 2: Misses several important points
   - 3: Covers some but not all key points
   - 4: Covers most key points
   - 5: Covers all points as well as reference

5. **Sentiment**: Overall tone of the response
   - "positive": Helpful, encouraging, optimistic tone
   - "neutral": Factual, objective, balanced tone
   - "negative": Critical, pessimistic, discouraging tone

## Response Format
Respond with ONLY valid JSON (keep reasoning under 150 words):
{
  "coherence": <1-5>,
  "consistency": <1-5>,
  "fluency": <1-5>,
  "relevance": <1-5>,
  "sentiment": "<positive|neutral|negative>",
  "reasoning": "<brief explanation, max 2-3 sentences>"
}`;

/**
 * Создать промпт для оценки
 * @param {string} prompt - исходный промпт
 * @param {string} response - ответ для оценки
 * @param {string} [reference] - эталонный ответ (опционально)
 * @returns {string}
 */
function buildEvaluationPrompt(prompt, response, reference = null) {
  if (reference) {
    return EVALUATION_PROMPT_WITH_REFERENCE
      .replace('{prompt}', prompt || 'N/A')
      .replace('{reference}', reference)
      .replace('{response}', response || 'Empty response');
  }

  return EVALUATION_PROMPT_TEMPLATE
    .replace('{prompt}', prompt || 'N/A')
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

    // Валидация числовых оценок
    const { coherence, consistency, fluency, relevance } = parsed;
    const scores = [coherence, consistency, fluency, relevance];

    const { min, max } = config.geval.scale;

    if (scores.some((s) => typeof s !== 'number' || s < min || s > max)) {
      logger.warn({ parsed }, 'Invalid scores in evaluation response');
      return null;
    }

    // Валидация sentiment
    const validSentiments = ['positive', 'neutral', 'negative'];
    const sentiment = parsed.sentiment?.toLowerCase();
    const validatedSentiment = validSentiments.includes(sentiment) ? sentiment : 'neutral';

    return {
      coherence,
      consistency,
      fluency,
      relevance,
      sentiment: validatedSentiment,
      reasoning: parsed.reasoning || null,
    };
  } catch (error) {
    logger.error({ error: error.message, responseText }, 'Failed to parse evaluation response');
    return null;
  }
}

/**
 * Оценить один AI ответ
 * @param {Object} aiResponse - запись из ai_responses
 * @param {string} [referenceAnswer] - эталонный ответ (опционально)
 * @returns {Promise<Object>}
 */
export async function evaluateSingleResponse(aiResponse, referenceAnswer = null) {
  const { id, prompt, response } = aiResponse;

  const evaluationPrompt = buildEvaluationPrompt(prompt, response, referenceAnswer);

  const messages = [
    {
      role: 'system',
      content: 'You are a STRICT and CRITICAL LLM evaluator. Be harsh in your scoring. Score of 5 is rare. Always respond with valid JSON only.',
    },
    {
      role: 'user',
      content: evaluationPrompt,
    },
  ];

  logger.info(
    { aiResponseId: id, hasReference: !!referenceAnswer },
    'Sending evaluation request to LLM'
  );

  const completion = await sendChatCompletion(messages, {
    temperature: 0.1,
    maxTokens: 1024,
  });

  const responseContent = extractResponseText(completion);

  // Log raw LLM response for debugging
  logger.info(
    { aiResponseId: id, rawResponse: responseContent },
    'Received evaluation from LLM'
  );

  const scores = parseEvaluationResponse(responseContent);

  if (!scores) {
    throw new Error(`Failed to parse evaluation for ai_response ${id}`);
  }

  // Вычисляем средний балл по шкале 1-5, затем конвертируем в проценты
  const avg1to5 =
    (scores.coherence + scores.consistency + scores.fluency + scores.relevance) / 4;
  // Формула: ((avg - 1) / 4) * 100 преобразует 1-5 в 0-100%
  const avgScore = Math.round(((avg1to5 - 1) / 4) * 100);

  logger.info(
    {
      aiResponseId: id,
      scores: { ...scores, avg_score: avgScore },
    },
    'Evaluation completed'
  );

  return {
    ai_response_id: id,
    coherence: scores.coherence,
    consistency: scores.consistency,
    fluency: scores.fluency,
    relevance: scores.relevance,
    sentiment: scores.sentiment,
    avg_score: avgScore,
    evaluated_at: new Date().toISOString(),
    evaluator_model: config.openRouter.model,
    reasoning: scores.reasoning,
  };
}

/**
 * Оценить несколько AI ответов
 * @param {Array} aiResponses - массив записей из ai_responses
 * @returns {Promise<Object>}
 */
export async function evaluateMultipleResponses(aiResponses) {
  const startTime = Date.now();

  logger.info({ count: aiResponses.length }, 'Starting batch evaluation');

  const limit = pLimit(config.rateLimit.maxConcurrent);

  const evaluationPromises = aiResponses.map((aiResponse) =>
    limit(async () => {
      try {
        const result = await evaluateSingleResponse(aiResponse);

        logger.debug(
          { aiResponseId: aiResponse.id, avgScore: result.avg_score },
          'AI response evaluated'
        );

        return result;
      } catch (error) {
        logger.error(
          { error: error.message, aiResponseId: aiResponse.id },
          'Failed to evaluate ai_response'
        );

        return {
          ai_response_id: aiResponse.id,
          error: error.message,
        };
      }
    })
  );

  const results = await Promise.all(evaluationPromises);

  const successful = results.filter((r) => !r.error);
  const failed = results.filter((r) => r.error);

  const duration = Date.now() - startTime;

  logger.info(
    {
      duration,
      totalSuccessful: successful.length,
      totalFailed: failed.length,
    },
    'Batch evaluation completed'
  );

  return {
    successful,
    failed,
    duration,
  };
}
