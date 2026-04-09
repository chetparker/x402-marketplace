// Data store for the provider marketplace — Supabase backend.
//
// Every function is async and returns the data directly (or null on error).
// Callers must await. Session helpers remain synchronous (sessionStorage).
//
// IMPORTANT: we check `supabase` (the client object) directly in every
// function — never a cached boolean. This avoids stale-module-binding bugs.

import { supabase } from './supabase';

const SESSION_KEY = 'payapi_session';

// Wrap read-only Supabase calls so a network error or missing table never
// crashes the React tree. Callers just get null / [].
async function safe(fn, fallback = null) {
  if (!supabase) return fallback;
  try { return await fn(); } catch (e) { console.error('[store]', e.message); return fallback; }
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------
export async function createProvider({ email, name, company_name, wallet_address }) {
  if (!supabase) throw new Error('Database not configured — check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');

  const { data, error } = await supabase
    .from('providers')
    .insert({ email, name, company_name: company_name || null, wallet_address })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      const { data: existing, error: fetchErr } = await supabase
        .from('providers').select('*').eq('email', email).maybeSingle();
      if (fetchErr) throw new Error(`Provider lookup failed: ${fetchErr.message}`);
      if (existing) return existing;
    }
    throw new Error(`Provider insert failed: ${error.message}`);
  }
  return data;
}

export async function getProviderByEmail(email) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('providers').select('*').eq('email', email).maybeSingle();
  return data || null;
}

export async function getProviderById(id) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('providers').select('*').eq('id', id).maybeSingle();
  return data || null;
}

export async function updateProvider(id, updates) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('providers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('[store] updateProvider error:', error.message); return null; }
  return data;
}

export async function getAllProviders() {
  return safe(async () => {
    const { data } = await supabase.from('providers').select('*').order('created_at', { ascending: false });
    return data || [];
  }, []);
}

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------
export async function createListing({
  provider_id, name, description, category,
  base_url, mcp_endpoint, endpoints_count, tools_count,
  price_min, price_max,
}) {
  if (!supabase) throw new Error('Database not configured — check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  const { data, error } = await supabase
    .from('api_listings')
    .insert({
      provider_id, name, description,
      category: category || 'Data',
      base_url,
      mcp_endpoint: mcp_endpoint || null,
      endpoints_count: parseInt(endpoints_count) || 0,
      tools_count: parseInt(tools_count) || 0,
      price_min: parseFloat(price_min) || 0.001,
      price_max: parseFloat(price_max) || 0.001,
    })
    .select()
    .single();
  if (error) throw new Error(`Listing insert failed: ${error.message}`);
  return data;
}

export async function getListingById(id) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('api_listings').select('*, providers(*)').eq('id', id).maybeSingle();
  return data || null;
}

export async function getListingsByProvider(providerId) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('api_listings').select('*').eq('provider_id', providerId).order('created_at', { ascending: false });
  return data || [];
}

export async function getListingsByStatus(status) {
  if (!supabase) return [];
  const { data } = await supabase
    .from('api_listings').select('*, providers(*)').eq('status', status).order('created_at', { ascending: false });
  return data || [];
}

export async function getLiveListings() {
  return safe(async () => {
    const { data } = await supabase
      .from('api_listings').select('*, providers(*)').eq('status', 'live').order('created_at', { ascending: false });
    return data || [];
  }, []);
}

export async function updateListing(id, updates) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('api_listings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('[store] updateListing error:', error.message); return null; }
  return data;
}

export async function getAllListings() {
  return safe(async () => {
    const { data } = await supabase
      .from('api_listings').select('*, providers(*)').order('created_at', { ascending: false });
    return data || [];
  }, []);
}

// ---------------------------------------------------------------------------
// Session (synchronous — sessionStorage, not Supabase)
// ---------------------------------------------------------------------------
export function setSession(email) {
  sessionStorage.setItem(SESSION_KEY, email);
}

export function getSession() {
  return sessionStorage.getItem(SESSION_KEY) || null;
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
