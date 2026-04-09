import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Only create the client when both values are present AND the URL is a real
// HTTP(S) URL. If either is missing or malformed the app runs in "no-db"
// mode — store functions return empty arrays, the 10 hardcoded APIs still
// render, and nothing crashes.
export const supabase =
  supabaseUrl.startsWith('http') && supabaseKey.length > 0
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export const isConfigured = !!supabase;
