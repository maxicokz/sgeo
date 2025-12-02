import { getSupabaseClient } from './supabase.js';
import { createChildLogger } from '../utils/logger.js';

const logger = createChildLogger({ module: 'repository' });

/**
 * Получить AI ответы для оценки
 * @param {Object} options
 * @param {number} options.limit - максимальное количество ответов
 * @param {boolean} options.unevaluatedOnly - только неоцененные
 * @returns {Promise<Array>}
 */
export async function getAiResponses({ limit = 10, unevaluatedOnly = true } = {}) {
  const client = getSupabaseClient();

  // Получаем все AI ответы
  const { data: responses, error: responsesError } = await client
    .from('ai_responses')
    .select('id, prompt, model_name, response, language, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (responsesError) {
    logger.error({ error: responsesError }, 'Failed to fetch ai_responses');
    throw responsesError;
  }

  let result = responses || [];

  if (unevaluatedOnly && result.length > 0) {
    // Получаем ID уже оцененных ответов
    const { data: evaluatedIds } = await client
      .from('evaluations')
      .select('ai_response_id');

    const evaluatedSet = new Set((evaluatedIds || []).map((e) => e.ai_response_id));

    // Фильтруем, оставляя только неоцененные
    result = result.filter((r) => !evaluatedSet.has(r.id));
  }

  logger.info({ count: result.length }, 'Fetched ai_responses for evaluation');
  return result;
}

/**
 * Получить конкретный AI ответ по ID
 * @param {string} responseId
 * @returns {Promise<Object|null>}
 */
export async function getAiResponseById(responseId) {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('ai_responses')
    .select('id, prompt, model_name, response, language, created_at')
    .eq('id', responseId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    logger.error({ error, responseId }, 'Failed to fetch ai_response');
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
      onConflict: 'ai_response_id',
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
      ai_response_id,
      coherence,
      consistency,
      fluency,
      relevance,
      avg_score,
      evaluated_at,
      evaluator_model,
      reasoning,
      ai_responses!inner (
        id,
        model_name,
        prompt,
        response,
        language
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
    .from('ai_responses')
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
      totalResponses: totalResponses || 0,
      totalEvaluations: totalEvaluations || 0,
      pendingEvaluations: (totalResponses || 0) - (totalEvaluations || 0),
    },
    averageScores: averages,
  };
}

/**
 * Получить статистику по моделям
 * @returns {Promise<Array>}
 */
export async function getModelStats() {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('model_performance_summary')
    .select('*');

  if (error) {
    // View может не существовать, возвращаем пустой массив
    logger.warn({ error }, 'model_performance_summary view not available');
    return [];
  }

  return data || [];
}
