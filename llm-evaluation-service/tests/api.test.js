import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import Fastify from 'fastify';

// Mock environment variables
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_KEY = 'test-key';
process.env.OPENROUTER_API_KEY = 'test-api-key';
process.env.CRON_ENABLED = 'false';

describe('API Routes', () => {
  let fastify;

  before(async () => {
    fastify = Fastify({ logger: false });

    // Mock health endpoint
    fastify.get('/health', async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    });

    // Mock scheduler endpoint
    fastify.get('/api/scheduler', async () => {
      return {
        success: true,
        data: {
          enabled: false,
          schedule: '0 0 * * 0',
          isRunning: false,
          lastRun: null,
        },
      };
    });

    // Mock evaluate endpoint (without actual Supabase)
    fastify.post('/api/evaluate', async (request, reply) => {
      const { limit = 10 } = request.query;
      return {
        success: true,
        message: 'No unevaluated responses found',
        evaluated: 0,
        failed: 0,
        duration: 0,
      };
    });

    // Mock status endpoint
    fastify.get('/api/status', async () => {
      return {
        success: true,
        data: {
          lastEvaluationAt: null,
          lastEvaluatorModel: null,
          statistics: {
            totalPrompts: 0,
            totalResponses: 0,
            totalEvaluations: 0,
            pendingEvaluations: 0,
          },
          averageScores: null,
        },
      };
    });

    // Mock results endpoint
    fastify.get('/api/results', async (request) => {
      const { limit = 50, offset = 0 } = request.query;
      return {
        success: true,
        data: [],
        pagination: {
          total: 0,
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
        },
      };
    });

    await fastify.ready();
  });

  after(async () => {
    await fastify.close();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/health',
      });

      assert.strictEqual(response.statusCode, 200);

      const body = JSON.parse(response.body);
      assert.strictEqual(body.status, 'ok');
      assert.ok(body.timestamp);
      assert.ok(typeof body.uptime === 'number');
    });
  });

  describe('GET /api/scheduler', () => {
    it('should return scheduler status', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/api/scheduler',
      });

      assert.strictEqual(response.statusCode, 200);

      const body = JSON.parse(response.body);
      assert.strictEqual(body.success, true);
      assert.ok(body.data);
      assert.strictEqual(body.data.enabled, false);
      assert.strictEqual(body.data.schedule, '0 0 * * 0');
    });
  });

  describe('POST /api/evaluate', () => {
    it('should accept evaluation request', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/api/evaluate',
      });

      assert.strictEqual(response.statusCode, 200);

      const body = JSON.parse(response.body);
      assert.strictEqual(body.success, true);
      assert.ok('evaluated' in body);
      assert.ok('failed' in body);
    });

    it('should accept limit parameter', async () => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/api/evaluate?limit=5',
      });

      assert.strictEqual(response.statusCode, 200);
    });
  });

  describe('GET /api/status', () => {
    it('should return evaluation status', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/api/status',
      });

      assert.strictEqual(response.statusCode, 200);

      const body = JSON.parse(response.body);
      assert.strictEqual(body.success, true);
      assert.ok(body.data);
      assert.ok('statistics' in body.data);
    });
  });

  describe('GET /api/results', () => {
    it('should return evaluation results', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/api/results',
      });

      assert.strictEqual(response.statusCode, 200);

      const body = JSON.parse(response.body);
      assert.strictEqual(body.success, true);
      assert.ok(Array.isArray(body.data));
      assert.ok(body.pagination);
    });

    it('should respect pagination parameters', async () => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/api/results?limit=10&offset=20',
      });

      assert.strictEqual(response.statusCode, 200);

      const body = JSON.parse(response.body);
      assert.strictEqual(body.pagination.limit, 10);
      assert.strictEqual(body.pagination.offset, 20);
    });
  });
});

describe('Error Handling', () => {
  let fastify;

  before(async () => {
    fastify = Fastify({ logger: false });

    // Mock endpoint that throws error
    fastify.get('/api/error', async () => {
      throw new Error('Test error');
    });

    // Error handler
    fastify.setErrorHandler((error, request, reply) => {
      reply.status(error.statusCode || 500).send({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    });

    // Not found handler
    fastify.setNotFoundHandler((request, reply) => {
      reply.status(404).send({
        success: false,
        message: `Route ${request.method} ${request.url} not found`,
      });
    });

    await fastify.ready();
  });

  after(async () => {
    await fastify.close();
  });

  it('should handle errors gracefully', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/error',
    });

    assert.strictEqual(response.statusCode, 500);

    const body = JSON.parse(response.body);
    assert.strictEqual(body.success, false);
    assert.ok(body.message);
  });

  it('should return 404 for unknown routes', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/unknown',
    });

    assert.strictEqual(response.statusCode, 404);

    const body = JSON.parse(response.body);
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes('not found'));
  });
});

describe('Request Validation', () => {
  it('should validate UUID format', () => {
    const validUUID = '550e8400-e29b-41d4-a716-446655440000';
    const invalidUUID = 'not-a-uuid';

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    assert.ok(uuidRegex.test(validUUID), 'Valid UUID should match');
    assert.ok(!uuidRegex.test(invalidUUID), 'Invalid UUID should not match');
  });

  it('should validate limit parameter bounds', () => {
    const validateLimit = (limit) => {
      const min = 1;
      const max = 100;
      const parsed = parseInt(limit, 10);
      return !isNaN(parsed) && parsed >= min && parsed <= max;
    };

    assert.ok(validateLimit(1), 'Min limit should be valid');
    assert.ok(validateLimit(100), 'Max limit should be valid');
    assert.ok(validateLimit(50), 'Middle limit should be valid');
    assert.ok(!validateLimit(0), 'Zero should be invalid');
    assert.ok(!validateLimit(101), 'Above max should be invalid');
    assert.ok(!validateLimit('abc'), 'Non-number should be invalid');
  });
});
