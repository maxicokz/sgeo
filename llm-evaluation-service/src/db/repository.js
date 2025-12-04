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

  logger.info({ limit, unevaluatedOnly }, 'Fetching ai_responses...');

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

  logger.info({ totalFetched: responses?.length || 0 }, 'Fetched ai_responses from DB');

  let result = responses || [];

  if (unevaluatedOnly && result.length > 0) {
    // Получаем ID уже оцененных ответов
    const { data: evaluatedIds, error: evalError } = await client
      .from('evaluations')
      .select('ai_response_id');

    if (evalError) {
      logger.warn({ error: evalError }, 'Failed to fetch evaluations - table may not exist');
      // Продолжаем без фильтрации если таблица не существует
    } else {
      const evaluatedSet = new Set((evaluatedIds || []).map((e) => e.ai_response_id));
      logger.info({ evaluatedCount: evaluatedSet.size }, 'Found existing evaluations');

      // Фильтруем, оставляя только неоцененные
      result = result.filter((r) => !evaluatedSet.has(r.id));
    }
  }

  logger.info({ count: result.length }, 'Returning ai_responses for evaluation');
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

/**
 * Найти эталонный ответ по prompt
 * @param {string} prompt - текст промпта
 * @param {string} [language] - язык (ru, kz, en)
 * @returns {Promise<Object|null>}
 */
export async function findReferenceAnswer(prompt, language = null) {
  const client = getSupabaseClient();

  if (!prompt) return null;

  const trimmedPrompt = prompt.trim();

  logger.debug({ prompt: trimmedPrompt.substring(0, 100), language }, 'Searching for reference answer');

  // 1. Сначала точный поиск по prompt_pattern
  const { data: exact, error: exactError } = await client
    .from('reference_answers')
    .select('id, reference_short, reference_full, topic, language')
    .eq('is_active', true)
    .ilike('prompt_pattern', trimmedPrompt)
    .limit(1)
    .maybeSingle();

  if (exactError) {
    logger.warn({ error: exactError }, 'Error in exact reference search');
  }

  if (exact) {
    logger.info({ referenceId: exact.id, topic: exact.topic }, 'Found exact reference match');
    return exact;
  }

  // 2. Частичный поиск — проверяем содержит ли prompt текст из prompt_pattern
  // Получаем все активные эталоны и ищем совпадение
  const { data: allRefs, error: allError } = await client
    .from('reference_answers')
    .select('id, reference_short, reference_full, topic, language, prompt_pattern')
    .eq('is_active', true);

  if (allError) {
    logger.warn({ error: allError }, 'Error fetching reference answers');
  }

  if (allRefs && allRefs.length > 0) {
    logger.debug({ refCount: allRefs.length }, 'Checking partial matches against reference patterns');

    // Ищем эталон, чей prompt_pattern содержится в промпте (case-insensitive)
    const lowerPrompt = trimmedPrompt.toLowerCase();
    const match = allRefs.find((ref) => {
      const pattern = ref.prompt_pattern?.toLowerCase();
      return pattern && lowerPrompt.includes(pattern);
    });

    if (match) {
      logger.info({ referenceId: match.id, topic: match.topic }, 'Found partial reference match');
      return {
        id: match.id,
        reference_short: match.reference_short,
        reference_full: match.reference_full,
        topic: match.topic,
        language: match.language,
      };
    }
  }

  // 3. Fuzzy поиск через RPC функцию (если настроена)
  try {
    const { data: fuzzy, error: fuzzyError } = await client
      .rpc('find_reference_fuzzy', {
        search_text: trimmedPrompt,
        search_lang: language,
      });

    if (fuzzyError) {
      logger.debug({ error: fuzzyError }, 'Fuzzy search RPC not available or failed');
    } else if (fuzzy && fuzzy.length > 0) {
      logger.info({ referenceId: fuzzy[0].id, topic: fuzzy[0].topic }, 'Found fuzzy reference match');
      return fuzzy[0];
    }
  } catch (err) {
    logger.debug({ error: err.message }, 'Fuzzy search RPC not available');
  }

  logger.debug('No reference answer found');
  return null;
}

/**
 * Получить все эталоны по теме
 * @param {string} topic
 * @returns {Promise<Array>}
 */
export async function getReferencesByTopic(topic) {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('reference_answers')
    .select('*')
    .eq('topic', topic)
    .eq('is_active', true);

  if (error) {
    logger.error({ error, topic }, 'Failed to fetch references by topic');
    throw error;
  }

  return data || [];
}
