import Fastify from 'fastify';
import { config, validateConfig } from './config.js';
import { logger } from './utils/logger.js';
import { testConnection as testSupabase } from './db/supabase.js';
import { testConnection as testOpenRouter } from './services/openrouter.js';
import { evaluateRoutes } from './routes/evaluate.js';
import { startScheduler, stopScheduler, getSchedulerStatus } from './services/scheduler.js';

const fastify = Fastify({
  logger: false, // Используем свой pino logger
});

// Health check endpoint
fastify.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
});

// Scheduler status endpoint
fastify.get('/api/scheduler', async () => {
  return {
    success: true,
    data: getSchedulerStatus(),
  };
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  logger.error({ error: error.message, stack: error.stack, path: request.url }, 'Request error');

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

async function start() {
  try {
    // Валидация конфига
    logger.info('Validating configuration...');
    validateConfig();
    logger.info('Configuration validated');

    // Проверка подключений
    logger.info('Testing Supabase connection...');
    await testSupabase();

    logger.info('Testing OpenRouter connection...');
    await testOpenRouter();

    // Регистрация роутов
    await fastify.register(evaluateRoutes);
    logger.info('Routes registered');

    // Запуск планировщика
    startScheduler();

    // Запуск сервера
    await fastify.listen({
      port: config.server.port,
      host: config.server.host,
    });

    logger.info(
      {
        port: config.server.port,
        host: config.server.host,
        env: config.server.env,
      },
      'Server started'
    );

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info({ signal }, 'Received shutdown signal');

      stopScheduler();

      try {
        await fastify.close();
        logger.info('Server closed');
        process.exit(0);
      } catch (err) {
        logger.error({ error: err.message }, 'Error during shutdown');
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.fatal({ error: err.message, stack: err.stack }, 'Failed to start server');
    process.exit(1);
  }
}

start();
