import pRetry from 'p-retry';
import { config } from '../config.js';
import { createChildLogger } from '../utils/logger.js';

const logger = createChildLogger({ module: 'openrouter' });

const RETRY_OPTIONS = {
  retries: 3,
  minTimeout: 1000,
  maxTimeout: 10000,
  onFailedAttempt: (error) => {
    logger.warn(
      {
        attempt: error.attemptNumber,
        retriesLeft: error.retriesLeft,
        error: error.message,
      },
      'OpenRouter request failed, retrying...'
    );
  },
};

/**
 * Отправить запрос к OpenRouter API
 * @param {Array} messages - массив сообщений
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export async function sendChatCompletion(messages, options = {}) {
  const { model = config.openRouter.model, temperature = 0.1, maxTokens = 1024 } = options;

  const requestBody = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  const makeRequest = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.openRouter.timeout);

    try {
      const response = await fetch(`${config.openRouter.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openRouter.apiKey}`,
          'HTTP-Referer': 'https://llm-evaluation-service.local',
          'X-Title': 'LLM Evaluation Service',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`OpenRouter API error: ${response.status} - ${errorText}`);

        // Не ретраить 4xx ошибки (кроме rate limit)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new pRetry.AbortError(error);
        }

        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw error;
    }
  };

  const startTime = Date.now();

  const result = await pRetry(makeRequest, RETRY_OPTIONS);

  const duration = Date.now() - startTime;
  logger.debug({ model, duration, tokens: result.usage }, 'OpenRouter request completed');

  return result;
}

/**
 * Извлечь текст ответа из completion
 * @param {Object} completion
 * @returns {string}
 */
export function extractResponseText(completion) {
  return completion?.choices?.[0]?.message?.content || '';
}

/**
 * Проверить доступность OpenRouter API
 * @returns {Promise<boolean>}
 */
export async function testConnection() {
  try {
    const response = await fetch(`${config.openRouter.baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${config.openRouter.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    logger.info('OpenRouter connection verified');
    return true;
  } catch (error) {
    logger.error({ error: error.message }, 'OpenRouter connection failed');
    throw error;
  }
}
