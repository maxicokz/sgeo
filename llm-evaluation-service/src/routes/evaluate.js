import {
  getAiResponses,
  getAiResponseById,
  saveEvaluations,
  getEvaluationResults,
  getLastEvaluationStatus,
  getModelStats,
  findReferenceAnswer,
} from '../db/repository.js';
import { evaluateSingleResponse } from '../services/geval.js';
import { createChildLogger } from '../utils/logger.js';
import pLimit from 'p-limit';
import { config } from '../config.js';

const logger = createChildLogger({ module: 'routes' });

/**
 * Регистрация роутов для оценки
 * @param {import('fastify').FastifyInstance} fastify
 */
export async function evaluateRoutes(fastify) {
  // POST /api/evaluate - оценить новые ответы
  fastify.post('/api/evaluate', {
    schema: {
      description: 'Evaluate new unevaluated AI responses',
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            evaluated: { type: 'integer' },
            failed: { type: 'integer' },
            duration: { type: 'integer' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { limit = 10 } = request.query;

      logger.info({ limit }, 'Starting evaluation of new responses');

      try {
        // Получаем неоцененные AI ответы
        const aiResponses = await getAiResponses({ limit, unevaluatedOnly: true });

        if (aiResponses.length === 0) {
          return reply.send({
            success: true,
            message: 'No unevaluated responses found',
            evaluated: 0,
            failed: 0,
            duration: 0,
            withReference: 0,
          });
        }

        const startTime = Date.now();
        const concurrencyLimit = pLimit(config.rateLimit?.maxConcurrent || 3);

        // Оцениваем каждый ответ с поиском эталона
        const evaluationPromises = aiResponses.map((aiResponse) =>
          concurrencyLimit(async () => {
            try {
              // Ищем эталонный ответ по prompt
              const reference = await findReferenceAnswer(aiResponse.prompt, aiResponse.language);

              // Оцениваем с эталоном или без
              const evaluation = await evaluateSingleResponse(
                aiResponse,
                reference?.reference_full || null
              );

              return {
                ...evaluation,
                reference_id: reference?.id || null,
                has_reference: !!reference,
              };
            } catch (error) {
              logger.error(
                { error: error.message, aiResponseId: aiResponse.id },
                'Failed to evaluate AI response'
              );
              return { ai_response_id: aiResponse.id, error: error.message };
            }
          })
        );

        const results = await Promise.all(evaluationPromises);
        const successful = results.filter((r) => !r.error);
        const failed = results.filter((r) => r.error);
        const withReference = successful.filter((r) => r.has_reference).length;

        const duration = Date.now() - startTime;

        // Сохраняем успешные оценки
        if (successful.length > 0) {
          await saveEvaluations(successful);
        }

        logger.info(
          { evaluated: successful.length, failed: failed.length, withReference, duration },
          'Batch evaluation completed'
        );

        return reply.send({
          success: true,
          message: `Evaluated ${successful.length} responses (${withReference} with reference)`,
          evaluated: successful.length,
          failed: failed.length,
          withReference,
          duration,
        });
      } catch (error) {
        logger.error({ error: error.message }, 'Evaluation failed');
        return reply.status(500).send({
          success: false,
          message: error.message,
          evaluated: 0,
          failed: 0,
          duration: 0,
        });
      }
    },
  });

  // POST /api/evaluate/:id - оценить конкретный AI ответ
  fastify.post('/api/evaluate/:id', {
    schema: {
      description: 'Evaluate a specific AI response',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            evaluation: { type: 'object' },
          },
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;

      logger.info({ id }, 'Starting evaluation for specific AI response');

      try {
        const aiResponse = await getAiResponseById(id);

        if (!aiResponse) {
          return reply.status(404).send({
            success: false,
            message: 'AI response not found',
          });
        }

        // Ищем эталонный ответ по prompt
        const reference = await findReferenceAnswer(aiResponse.prompt, aiResponse.language);

        if (reference) {
          logger.info(
            { referenceId: reference.id, topic: reference.topic },
            'Found reference answer for evaluation'
          );
        }

        // Оцениваем с эталоном или без
        const evaluation = await evaluateSingleResponse(
          aiResponse,
          reference?.reference_full || null
        );

        const evaluationWithRef = {
          ...evaluation,
          reference_id: reference?.id || null,
          has_reference: !!reference,
        };

        await saveEvaluations([evaluationWithRef]);

        return reply.send({
          success: true,
          message: reference
            ? 'AI response evaluated with reference answer'
            : 'AI response evaluated without reference',
          hasReference: !!reference,
          referenceTopic: reference?.topic || null,
          evaluation: evaluationWithRef,
        });
      } catch (error) {
        logger.error({ error: error.message, id }, 'AI response evaluation failed');
        return reply.status(500).send({
          success: false,
          message: error.message,
        });
      }
    },
  });

  // GET /api/status - статус последнего прогона
  fastify.get('/api/status', {
    schema: {
      description: 'Get evaluation status and statistics',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                lastEvaluationAt: { type: ['string', 'null'] },
                lastEvaluatorModel: { type: ['string', 'null'] },
                statistics: {
                  type: 'object',
                  properties: {
                    totalResponses: { type: 'integer' },
                    totalEvaluations: { type: 'integer' },
                    pendingEvaluations: { type: 'integer' },
                  },
                },
                averageScores: {
                  type: ['object', 'null'],
                  properties: {
                    coherence: { type: 'number' },
                    consistency: { type: 'number' },
                    fluency: { type: 'number' },
                    relevance: { type: 'number' },
                    avg_score: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        const status = await getLastEvaluationStatus();

        return reply.send({
          success: true,
          data: status,
        });
      } catch (error) {
        logger.error({ error: error.message }, 'Failed to get status');
        return reply.status(500).send({
          success: false,
          message: error.message,
        });
      }
    },
  });

  // GET /api/results - все результаты
  fastify.get('/api/results', {
    schema: {
      description: 'Get all evaluation results',
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 200, default: 50 },
          offset: { type: 'integer', minimum: 0, default: 0 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                limit: { type: 'integer' },
                offset: { type: 'integer' },
              },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { limit = 50, offset = 0 } = request.query;

      try {
        const results = await getEvaluationResults({ limit, offset });

        return reply.send({
          success: true,
          data: results.data,
          pagination: {
            total: results.total,
            limit: results.limit,
            offset: results.offset,
          },
        });
      } catch (error) {
        logger.error({ error: error.message }, 'Failed to get results');
        return reply.status(500).send({
          success: false,
          message: error.message,
        });
      }
    },
  });

  // GET /api/models - статистика по моделям
  fastify.get('/api/models', {
    schema: {
      description: 'Get model performance statistics',
    },
    handler: async (request, reply) => {
      try {
        const stats = await getModelStats();

        return reply.send({
          success: true,
          data: stats,
        });
      } catch (error) {
        logger.error({ error: error.message }, 'Failed to get model stats');
        return reply.status(500).send({
          success: false,
          message: error.message,
        });
      }
    },
  });

  // GET /api/references - просмотр эталонных ответов (для отладки)
  fastify.get('/api/references', {
    schema: {
      description: 'Get all reference answers for debugging',
    },
    handler: async (request, reply) => {
      try {
        const { getSupabaseClient } = await import('../db/supabase.js');
        const client = getSupabaseClient();

        const { data, error } = await client
          .from('reference_answers')
          .select('id, prompt_pattern, topic, language, is_active')
          .order('topic', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        return reply.send({
          success: true,
          count: data?.length || 0,
          data: data || [],
        });
      } catch (error) {
        logger.error({ error: error.message }, 'Failed to get references');
        return reply.status(500).send({
          success: false,
          message: error.message,
        });
      }
    },
  });
}
