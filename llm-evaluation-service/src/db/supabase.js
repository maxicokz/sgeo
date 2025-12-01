import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';
import { createChildLogger } from '../utils/logger.js';

const logger = createChildLogger({ module: 'supabase' });

let supabaseClient = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(config.supabase.url, config.supabase.key, {
      auth: {
        persistSession: false,
      },
    });
    logger.info('Supabase client initialized');
  }
  return supabaseClient;
}

export async function testConnection() {
  const client = getSupabaseClient();
  const { error } = await client.from('prompts').select('id').limit(1);

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }

  logger.info('Supabase connection verified');
  return true;
}
