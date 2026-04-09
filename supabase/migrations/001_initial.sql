-- PayAPI Market — initial schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

CREATE TABLE providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company_name TEXT,
  wallet_address TEXT NOT NULL,
  stripe_customer_id TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'featured')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE api_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('Data', 'Verification', 'Intelligence', 'Tools', 'Finance')),
  base_url TEXT NOT NULL,
  mcp_endpoint TEXT,
  endpoints_count INTEGER DEFAULT 0,
  tools_count INTEGER DEFAULT 0,
  price_min DECIMAL(10,6) DEFAULT 0.001,
  price_max DECIMAL(10,6) DEFAULT 0.01,
  network TEXT DEFAULT 'base',
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'live', 'rejected', 'paused')),
  health_status TEXT DEFAULT 'unknown',
  uptime_percentage DECIMAL(5,2) DEFAULT 99.0,
  avg_latency_ms INTEGER DEFAULT 100,
  total_requests INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_listings ENABLE ROW LEVEL SECURITY;

-- Policies: public read for live listings + approved providers, open insert, open update
CREATE POLICY "Anyone can read live listings" ON api_listings FOR SELECT USING (status = 'live');
CREATE POLICY "Anyone can insert listings" ON api_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update listings" ON api_listings FOR UPDATE USING (true);
CREATE POLICY "Anyone can read approved providers" ON providers FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can insert providers" ON providers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update providers" ON providers FOR UPDATE USING (true);

-- Admin needs to read ALL providers and listings (not just approved/live).
-- The anon key can't bypass RLS, so add permissive read policies.
-- For production: use a service_role key on the server side or Supabase Auth
-- with admin role claims. For MVP this is acceptable.
CREATE POLICY "Anyone can read all listings" ON api_listings FOR SELECT USING (true);
CREATE POLICY "Anyone can read all providers" ON providers FOR SELECT USING (true);
