// Stripe webhook handler for Featured tier lifecycle.
// POST /api/stripe-webhook
//
// Stripe Dashboard → Webhooks → Add endpoint:
//   URL: https://payapi.market/api/stripe-webhook
//   Events: checkout.session.completed, invoice.payment_failed,
//           customer.subscription.deleted
//
// Updates Supabase providers.tier when subscription state changes.
// Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (server-side, bypasses RLS).

export const config = { api: { bodyParser: false } };

async function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, key);
}

async function setTierByProviderId(providerId, tier, customerId) {
  const supabase = await getSupabase();
  if (!supabase) {
    console.log(`[stripe-webhook] Supabase not configured — would set provider=${providerId} tier=${tier}`);
    return;
  }
  const updates = { tier, updated_at: new Date().toISOString() };
  if (customerId) updates.stripe_customer_id = customerId;
  const { error } = await supabase.from('providers').update(updates).eq('id', providerId);
  if (error) console.error(`[stripe-webhook] supabase update by id failed: ${error.message}`);
  else console.log(`[stripe-webhook] provider=${providerId} → tier=${tier}`);
}

// Move a listing from the "awaiting payment" sentinel ('paused') into the
// admin review queue ('pending_review'). Called when Stripe confirms payment.
async function activateListingAfterPayment(listingId, providerId) {
  const supabase = await getSupabase();
  if (!supabase) {
    console.log(`[stripe-webhook] Supabase not configured — would activate listing=${listingId}`);
    return;
  }
  if (listingId) {
    const { error } = await supabase
      .from('api_listings')
      .update({ status: 'pending_review', updated_at: new Date().toISOString() })
      .eq('id', listingId)
      .eq('status', 'paused');
    if (error) console.error(`[stripe-webhook] activate by listing_id failed: ${error.message}`);
    else console.log(`[stripe-webhook] listing=${listingId} → pending_review`);
    return;
  }
  // Fallback: no listing_id in metadata (e.g. retry from dashboard) —
  // unpause every listing this provider has that is currently paused.
  if (providerId) {
    const { error } = await supabase
      .from('api_listings')
      .update({ status: 'pending_review', updated_at: new Date().toISOString() })
      .eq('provider_id', providerId)
      .eq('status', 'paused');
    if (error) console.error(`[stripe-webhook] activate by provider_id failed: ${error.message}`);
    else console.log(`[stripe-webhook] all paused listings for provider=${providerId} → pending_review`);
  }
}

async function setTierByCustomerId(customerId, tier) {
  const supabase = await getSupabase();
  if (!supabase) {
    console.log(`[stripe-webhook] Supabase not configured — would set customer=${customerId} tier=${tier}`);
    return;
  }
  const { error } = await supabase
    .from('providers')
    .update({ tier, updated_at: new Date().toISOString() })
    .eq('stripe_customer_id', customerId);
  if (error) console.error(`[stripe-webhook] supabase update by customer failed: ${error.message}`);
  else console.log(`[stripe-webhook] customer=${customerId} → tier=${tier}`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.log('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set — logging raw event');
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString();
    console.log('[stripe-webhook] raw body length:', body.length);
    return res.status(200).json({ ok: true, mock: true });
  }

  try {
    const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const sig = req.headers['stripe-signature'];

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const providerId = session.metadata?.provider_id;
        const listingId = session.metadata?.listing_id;
        console.log(`[stripe-webhook] checkout.session.completed — provider=${providerId} listing=${listingId} customer=${session.customer}`);
        if (providerId) {
          await setTierByProviderId(providerId, 'featured', session.customer);
          await activateListingAfterPayment(listingId, providerId);
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log(`[stripe-webhook] invoice.payment_failed — customer=${invoice.customer}`);
        if (invoice.customer) await setTierByCustomerId(invoice.customer, 'free');
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        console.log(`[stripe-webhook] subscription.deleted — customer=${sub.customer}`);
        if (sub.customer) await setTierByCustomerId(sub.customer, 'free');
        break;
      }
      default:
        console.log(`[stripe-webhook] unhandled event: ${event.type}`);
    }

    return res.status(200).json({ ok: true, type: event.type });
  } catch (err) {
    console.error('[stripe-webhook] error:', err.message);
    return res.status(400).json({ error: err.message });
  }
}
