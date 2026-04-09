// Data store for the provider marketplace.
//
// MVP: localStorage-backed. Every function here has the same signature it
// would have with a Supabase/Postgres backend — when you're ready to
// migrate, replace the internals of each function and leave the callers
// untouched.
//
// LIMITATION: localStorage is per-browser. A provider who signs up in
// Chrome won't appear in Safari's admin panel. For production, swap to
// Supabase (see README or search "TODO:SUPABASE" in this file).

const PROVIDERS_KEY = 'payapi_providers';
const LISTINGS_KEY  = 'payapi_listings';
const SESSION_KEY   = 'payapi_session';

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function readAll(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
}

function writeAll(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------
export function createProvider({ email, name, company_name, wallet_address }) {
  const providers = readAll(PROVIDERS_KEY);
  const existing = providers.find(p => p.email === email);
  if (existing) return existing; // idempotent

  const provider = {
    id: uid(),
    email,
    name,
    company_name: company_name || null,
    wallet_address,
    stripe_customer_id: null,
    tier: 'free',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  providers.push(provider);
  writeAll(PROVIDERS_KEY, providers);
  return provider;
}

export function getProviderByEmail(email) {
  return readAll(PROVIDERS_KEY).find(p => p.email === email) || null;
}

export function getProviderById(id) {
  return readAll(PROVIDERS_KEY).find(p => p.id === id) || null;
}

export function updateProvider(id, data) {
  const providers = readAll(PROVIDERS_KEY);
  const idx = providers.findIndex(p => p.id === id);
  if (idx === -1) return null;
  providers[idx] = { ...providers[idx], ...data, updated_at: new Date().toISOString() };
  writeAll(PROVIDERS_KEY, providers);
  return providers[idx];
}

export function getAllProviders() {
  return readAll(PROVIDERS_KEY);
}

// ---------------------------------------------------------------------------
// Listings (API entries submitted by providers)
// ---------------------------------------------------------------------------
export function createListing({
  provider_id, name, description, category,
  base_url, mcp_endpoint, endpoints_count, tools_count,
  price_min, price_max,
}) {
  const listings = readAll(LISTINGS_KEY);
  const listing = {
    id: uid(),
    provider_id,
    name,
    description,
    category: category || 'Data',
    base_url,
    mcp_endpoint: mcp_endpoint || null,
    endpoints_count: parseInt(endpoints_count) || 0,
    tools_count: parseInt(tools_count) || 0,
    price_min: parseFloat(price_min) || 0.001,
    price_max: parseFloat(price_max) || 0.001,
    network: 'base',
    status: 'pending_review',
    health_status: null,
    uptime_percentage: null,
    avg_latency_ms: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  listings.push(listing);
  writeAll(LISTINGS_KEY, listings);
  return listing;
}

export function getListingById(id) {
  return readAll(LISTINGS_KEY).find(l => l.id === id) || null;
}

export function getListingsByProvider(providerId) {
  return readAll(LISTINGS_KEY).filter(l => l.provider_id === providerId);
}

export function getListingsByStatus(status) {
  return readAll(LISTINGS_KEY).filter(l => l.status === status);
}

export function getLiveListings() {
  return readAll(LISTINGS_KEY).filter(l => l.status === 'live');
}

export function updateListing(id, data) {
  const listings = readAll(LISTINGS_KEY);
  const idx = listings.findIndex(l => l.id === id);
  if (idx === -1) return null;
  listings[idx] = { ...listings[idx], ...data, updated_at: new Date().toISOString() };
  writeAll(LISTINGS_KEY, listings);
  return listings[idx];
}

export function getAllListings() {
  return readAll(LISTINGS_KEY);
}

// ---------------------------------------------------------------------------
// Session (simple email-based "auth" — MVP only)
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
