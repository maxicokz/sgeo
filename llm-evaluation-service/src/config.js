import 'dotenv/config';

export const config = {
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },

  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: 'https://openrouter.ai/api/v1',
    model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
    timeout: parseInt(process.env.REQUEST_TIMEOUT_MS, 10) || 30000,
  },

  server: {
    port: parseInt(process.env.PORT, 10) || 3001,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'development',
  },

  rateLimit: {
    maxConcurrent: parseInt(process.env.MAX_CONCURRENT_REQUESTS, 10) || 3,
  },

  cron: {
    schedule: process.env.CRON_SCHEDULE || '0 0 * * 0',
    enabled: process.env.CRON_ENABLED !== 'false',
  },

  geval: {
    criteria: ['coherence', 'consistency', 'fluency', 'relevance'],
    scale: { min: 1, max: 5 },
  },
};

export function validateConfig() {
  const required = [
    ['SUPABASE_URL', config.supabase.url],
    ['SUPABASE_KEY', config.supabase.key],
    ['OPENROUTER_API_KEY', config.openRouter.apiKey],
  ];

  const missing = required.filter(([, value]) => !value).map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
