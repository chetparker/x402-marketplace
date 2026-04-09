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

console.log('[supabase] URL:', supabaseUrl?.slice(0, 30) || '(empty)', 'KEY:', supabaseKey?.slice(0, 10) || '(empty)', 'client:', _client ? 'created' : 'null');

export const supabase = _client;
