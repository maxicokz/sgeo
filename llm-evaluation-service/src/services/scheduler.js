import cron from 'node-cron';
import { config } from '../config.js';
import { getAiResponses, saveEvaluations } from '../db/repository.js';
import { evaluateMultipleResponses } from './geval.js';
import { createChildLogger } from '../utils/logger.js';

const logger = createChildLogger({ module: 'scheduler' });

let scheduledTask = null;
let isRunning = false;
let lastRunStatus = null;

/**
 * Выполнить запланированную оценку
 */
async function runScheduledEvaluation() {
  if (isRunning) {
    logger.warn('Scheduled evaluation is already running, skipping');
    return;
  }

  isRunning = true;
  const startTime = new Date();

  logger.info('Starting scheduled evaluation');

  try {
    // Получаем все неоцененные AI ответы
    const aiResponses = await getAiResponses({ limit: 100, unevaluatedOnly: true });

    if (aiResponses.length === 0) {
      logger.info('No unevaluated AI responses found');
      lastRunStatus = {
        success: true,
        startedAt: startTime.toISOString(),
        completedAt: new Date().toISOString(),
        evaluated: 0,
        failed: 0,
        message: 'No unevaluated AI responses found',
      };
      return;
    }

    logger.info({ responsesCount: aiResponses.length }, 'Found AI responses to evaluate');

    // Оцениваем
    const { successful, failed, duration } = await evaluateMultipleResponses(aiResponses);

    // Сохраняем
    if (successful.length > 0) {
      await saveEvaluations(successful);
    }

    lastRunStatus = {
      success: true,
      startedAt: startTime.toISOString(),
      completedAt: new Date().toISOString(),
      evaluated: successful.length,
      failed: failed.length,
      duration,
      message: `Successfully evaluated ${successful.length} responses`,
    };

    logger.info(lastRunStatus, 'Scheduled evaluation completed');
  } catch (error) {
    logger.error({ error: error.message }, 'Scheduled evaluation failed');

    lastRunStatus = {
      success: false,
      startedAt: startTime.toISOString(),
      completedAt: new Date().toISOString(),
      evaluated: 0,
      failed: 0,
      error: error.message,
      message: `Evaluation failed: ${error.message}`,
    };
  } finally {
    isRunning = false;
  }
}

/**
 * Запустить планировщик
 */
export function startScheduler() {
  if (!config.cron.enabled) {
    logger.info('Cron scheduler is disabled');
    return;
  }

  const schedule = config.cron.schedule;

  if (!cron.validate(schedule)) {
    logger.error({ schedule }, 'Invalid cron schedule');
    return;
  }

  scheduledTask = cron.schedule(schedule, runScheduledEvaluation, {
    scheduled: true,
    timezone: 'UTC',
  });

  logger.info({ schedule }, 'Cron scheduler started');
}

/**
 * Остановить планировщик
 */
export function stopScheduler() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    logger.info('Cron scheduler stopped');
  }
}

/**
 * Получить статус планировщика
 * @returns {Object}
 */
export function getSchedulerStatus() {
  return {
    enabled: config.cron.enabled,
    schedule: config.cron.schedule,
    isRunning,
    lastRun: lastRunStatus,
  };
}

/**
 * Запустить оценку вручную
 * @returns {Promise<Object>}
 */
export async function triggerManualRun() {
  await runScheduledEvaluation();
  return lastRunStatus;
}
