// Stripe Checkout session for Featured tier ($49/mo).
// POST /api/stripe-checkout { email, provider_id }

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { email, provider_id, listing_id } = body || {};
  if (!email) return res.status(400).json({ error: 'email required' });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!stripeKey || !priceId) {
    console.log(`[stripe-checkout] MOCK — no STRIPE_SECRET_KEY set. email=${email} provider_id=${provider_id}`);
    return res.status(200).json({
      ok: true,
      mock: true,
      url: `https://payapi.market/dashboard?stripe=success`,
      message: 'Stripe not configured — mock redirect. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in Vercel env vars.',
    });
  }

  try {
    const stripe = (await import('stripe')).default(stripeKey);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://payapi.market/dashboard?stripe=success',
      cancel_url: 'https://payapi.market/dashboard?stripe=cancelled',
      metadata: { provider_id: provider_id || '', listing_id: listing_id || '' },
    });

    return res.status(200).json({ ok: true, url: session.url });
  } catch (err) {
    console.error('[stripe-checkout] error:', err.message);
    return res.status(500).json({ error: 'Stripe error', detail: err.message });
  }
}
