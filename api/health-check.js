// API health checker — pings each live listing's /health endpoint.
// GET /api/health-check
//
// In production, set up a Vercel Cron to call this every 5 minutes:
// In vercel.json, add:
//   "crons": [{ "path": "/api/health-check", "schedule": "*/5 * * * *" }]
//
// TODO:SUPABASE — read listings from the database instead of returning
// a stub. For now this just returns a 200 to confirm the endpoint exists.
//
// When the real database is connected, this function should:
// 1. SELECT * FROM api_listings WHERE status = 'live'
// 2. For each: fetch(base_url + '/health', { timeout: 10s })
// 3. Record response time + status in the database
// 4. If down for 30+ min, call notifyProviderAPIDown(provider, listing)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Stub: return success so the endpoint exists for Vercel Cron config
  console.log('[health-check] triggered at', new Date().toISOString());

  // TODO: replace with real health check loop once Supabase is connected
  return res.status(200).json({
    ok: true,
    message: 'Health checker stub — connect Supabase to activate real monitoring',
    timestamp: new Date().toISOString(),
  });
}
