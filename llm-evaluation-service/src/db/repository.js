import { getSupabaseClient } from './supabase.js';
import { createChildLogger } from '../utils/logger.js';

const logger = createChildLogger({ module: 'repository' });

/**
 * Получить промпты с ответами для оценки
 * @param {Object} options
 * @param {number} options.limit - максимальное количество промптов
 * @param {boolean} options.unevaluatedOnly - только неоцененные
 * @returns {Promise<Array>}
 */
export async function getPromptsWithResponses({ limit = 10, unevaluatedOnly = true } = {}) {
  const client = getSupabaseClient();

  // Получаем все промпты с ответами
  const { data: promptsData, error: promptsError } = await client
    .from('prompts')
    .select(`
      id,
      text,
      reference_answer,
      created_at,
      responses (
        id,
        prompt_id,
        model_name,
        response_text,
        created_at
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (promptsError) {
    logger.error({ error: promptsError }, 'Failed to fetch prompts with responses');
    throw promptsError;
  }

  let promptsWithResponses = (promptsData || []).filter(
    (p) => p.responses && p.responses.length > 0
  );

  if (unevaluatedOnly && promptsWithResponses.length > 0) {
    // Получаем ID уже оцененных ответов
    const { data: evaluatedResponseIds } = await client
      .from('evaluations')
      .select('response_id');

    const evaluatedIds = new Set((evaluatedResponseIds || []).map((e) => e.response_id));

    // Фильтруем ответы, оставляя только неоцененные
    promptsWithResponses = promptsWithResponses
      .map((prompt) => ({
        ...prompt,
        responses: prompt.responses.filter((r) => !evaluatedIds.has(r.id)),
      }))
      .filter((p) => p.responses.length > 0);
  }

  logger.info({ count: promptsWithResponses.length }, 'Fetched prompts with responses');
  return promptsWithResponses;
}

/**
 * Получить конкретный промпт с ответами по ID
 * @param {string} promptId
 * @returns {Promise<Object|null>}
 */
export async function getPromptById(promptId) {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('prompts')
    .select(`
      id,
      text,
      reference_answer,
      created_at,
      responses (
        id,
        prompt_id,
        model_name,
        response_text,
        created_at
      )
    `)
    .eq('id', promptId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    logger.error({ error, promptId }, 'Failed to fetch prompt');
    throw error;
  }

  return data;
}

/**
 * Сохранить результаты оценки
 * @param {Array} evaluations - массив оценок
 * @returns {Promise<Array>}
 */
export async function saveEvaluations(evaluations) {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('evaluations')
    .upsert(evaluations, {
      onConflict: 'response_id',
      ignoreDuplicates: false,
    })
    .select();

  if (error) {
    logger.error({ error }, 'Failed to save evaluations');
    throw error;
  }

  logger.info({ count: data.length }, 'Saved evaluations');
  return data;
}

/**
 * Получить все результаты оценок
 * @param {Object} options
 * @param {number} options.limit
 * @param {number} options.offset
 * @returns {Promise<Object>}
 */
export async function getEvaluationResults({ limit = 50, offset = 0 } = {}) {
  const client = getSupabaseClient();

  const { data, error, count } = await client
    .from('evaluations')
    .select(`
      id,
      response_id,
      coherence,
      consistency,
      fluency,
      relevance,
      avg_score,
      evaluated_at,
      evaluator_model,
      responses!inner (
        id,
        model_name,
        response_text,
        prompt_id,
        prompts!inner (
          id,
          text
        )
      )
    `, { count: 'exact' })
    .order('evaluated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error({ error }, 'Failed to fetch evaluation results');
    throw error;
  }

  return {
    data: data || [],
    total: count || 0,
    limit,
    offset,
  };
}

/**
 * Получить статус последнего прогона оценки
 * @returns {Promise<Object>}
 */
export async function getLastEvaluationStatus() {
  const client = getSupabaseClient();

  // Получаем последнюю оценку
  const { data: lastEval } = await client
    .from('evaluations')
    .select('evaluated_at, evaluator_model')
    .order('evaluated_at', { ascending: false })
    .limit(1)
    .single();

  // Подсчитываем статистику
  const { count: totalEvaluations } = await client
    .from('evaluations')
    .select('id', { count: 'exact', head: true });

  const { count: totalResponses } = await client
    .from('responses')
    .select('id', { count: 'exact', head: true });

  const { count: totalPrompts } = await client
    .from('prompts')
    .select('id', { count: 'exact', head: true });

  // Средние оценки
  const { data: avgScores } = await client
    .from('evaluations')
    .select('coherence, consistency, fluency, relevance, avg_score');

  let averages = null;
  if (avgScores && avgScores.length > 0) {
    const sum = avgScores.reduce(
      (acc, e) => ({
        coherence: acc.coherence + (e.coherence || 0),
        consistency: acc.consistency + (e.consistency || 0),
        fluency: acc.fluency + (e.fluency || 0),
        relevance: acc.relevance + (e.relevance || 0),
        avg_score: acc.avg_score + (e.avg_score || 0),
      }),
      { coherence: 0, consistency: 0, fluency: 0, relevance: 0, avg_score: 0 }
    );

    const count = avgScores.length;
    averages = {
      coherence: +(sum.coherence / count).toFixed(2),
      consistency: +(sum.consistency / count).toFixed(2),
      fluency: +(sum.fluency / count).toFixed(2),
      relevance: +(sum.relevance / count).toFixed(2),
      avg_score: Math.round(sum.avg_score / count), // 0-100%
    };
  }

  return {
    lastEvaluationAt: lastEval?.evaluated_at || null,
    lastEvaluatorModel: lastEval?.evaluator_model || null,
    statistics: {
      totalPrompts: totalPrompts || 0,
      totalResponses: totalResponses || 0,
      totalEvaluations: totalEvaluations || 0,
      pendingEvaluations: (totalResponses || 0) - (totalEvaluations || 0),
    },
    averageScores: averages,
  };
}
