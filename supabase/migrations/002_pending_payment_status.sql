-- Optional cleanup migration. Run in the Supabase SQL Editor when convenient.
--
-- Today, the Featured-tier signup flow uses `status = 'paused'` as a sentinel
-- meaning "awaiting Stripe payment", because the original schema's CHECK
-- constraint only allows ('pending_review', 'live', 'rejected', 'paused').
-- That works but is semantically off — a paid user who pauses a listing
-- becomes indistinguishable from an unpaid signup.
--
-- This migration introduces a real `pending_payment` status. After running it
-- you can also update src/lib/store.js + ListPage.jsx to use 'pending_payment'
-- instead of 'paused', and update the webhook + admin UI accordingly.
--
-- It also adds the missing DELETE RLS policies — without these, the anon key
-- silently no-ops on DELETE (200 OK, 0 rows changed) which is how a stale
-- test row ended up wedged in the table.

-- 1. Allow 'pending_payment' as a listing status.
ALTER TABLE api_listings DROP CONSTRAINT IF EXISTS api_listings_status_check;
ALTER TABLE api_listings ADD CONSTRAINT api_listings_status_check
  CHECK (status IN ('pending_payment', 'pending_review', 'live', 'rejected', 'paused'));

-- 2. Permit deletes via the anon key (matches the existing permissive policies).
--    For production you'd want a service-role-only delete policy instead.
CREATE POLICY "Anyone can delete listings" ON api_listings FOR DELETE USING (true);
CREATE POLICY "Anyone can delete providers" ON providers FOR DELETE USING (true);

-- 3. Clean up the test row left over from the ducatife@gmail.com signup.
--    Listings cascade-delete via the FK, so deleting the provider is enough.
DELETE FROM providers WHERE id = '94d5ad85-ba1b-4ec4-9f2c-ce2aeadf31b7';
