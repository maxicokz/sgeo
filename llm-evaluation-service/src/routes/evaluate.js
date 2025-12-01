import {
  getPromptsWithResponses,
  getPromptById,
  saveEvaluations,
  getEvaluationResults,
  getLastEvaluationStatus,
} from '../db/repository.js';
import { evaluateMultiplePrompts, evaluatePromptResponses } from '../services/geval.js';
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
      description: 'Evaluate new unevaluated responses',
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
        // Получаем промпты с неоцененными ответами
        const prompts = await getPromptsWithResponses({ limit, unevaluatedOnly: true });

        if (prompts.length === 0) {
          return reply.send({
            success: true,
            message: 'No unevaluated responses found',
            evaluated: 0,
            failed: 0,
            duration: 0,
          });
        }

        // Оцениваем
        const { successful, failed, duration } = await evaluateMultiplePrompts(prompts);

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

  // POST /api/evaluate/:id - оценить конкретный промпт
  fastify.post('/api/evaluate/:id', {
    schema: {
      description: 'Evaluate responses for a specific prompt',
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
            evaluated: { type: 'integer' },
            failed: { type: 'integer' },
            evaluations: { type: 'array' },
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
      const { id: promptId } = request.params;

      logger.info({ promptId }, 'Starting evaluation for specific prompt');

      try {
        const prompt = await getPromptById(promptId);

        if (!prompt) {
          return reply.status(404).send({
            success: false,
            message: 'Prompt not found',
          });
        }

        if (!prompt.responses || prompt.responses.length === 0) {
          return reply.send({
            success: true,
            message: 'No responses to evaluate',
            evaluated: 0,
            failed: 0,
            evaluations: [],
          });
        }

        const { successful, failed } = await evaluatePromptResponses(prompt);

        if (successful.length > 0) {
          await saveEvaluations(successful);
        }

        return reply.send({
          success: true,
          message: `Evaluated ${successful.length} responses for prompt`,
          evaluated: successful.length,
          failed: failed.length,
          evaluations: successful,
        });
      } catch (error) {
        logger.error({ error: error.message, promptId }, 'Prompt evaluation failed');
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
                    totalPrompts: { type: 'integer' },
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
}
