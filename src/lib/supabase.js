import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let _client = null;

if (supabaseUrl.startsWith('http') && supabaseKey.length > 0) {
  try {
    _client = createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.error('[supabase] createClient failed:', e.message);
  }
}

export const supabase = _client;
export const isConfigured = _client !== null;
