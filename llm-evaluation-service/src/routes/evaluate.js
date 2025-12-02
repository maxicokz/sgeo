import {
  getAiResponses,
  getAiResponseById,
  saveEvaluations,
  getEvaluationResults,
  getLastEvaluationStatus,
  getModelStats,
} from '../db/repository.js';
import { evaluateMultipleResponses, evaluateSingleResponse } from '../services/geval.js';
import { createChildLogger } from '../utils/logger.js';

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
          });
        }

        // Оцениваем
        const { successful, failed, duration } = await evaluateMultipleResponses(aiResponses);

        // Сохраняем успешные оценки
        if (successful.length > 0) {
          await saveEvaluations(successful);
        }

        return reply.send({
          success: true,
          message: `Evaluated ${successful.length} responses`,
          evaluated: successful.length,
          failed: failed.length,
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

        const evaluation = await evaluateSingleResponse(aiResponse);
        await saveEvaluations([evaluation]);

        return reply.send({
          success: true,
          message: 'AI response evaluated successfully',
          evaluation,
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
}
