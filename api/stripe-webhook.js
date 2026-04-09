// Stripe webhook handler for Featured tier lifecycle.
// POST /api/stripe-webhook
//
// TODO:STRIPE — set STRIPE_WEBHOOK_SECRET in Vercel env vars.
// In Stripe Dashboard → Webhooks → Add endpoint:
//   URL: https://payapi.market/api/stripe-webhook
//   Events: checkout.session.completed, invoice.payment_failed,
//           customer.subscription.deleted
//
// Until a real database is connected, this just logs events.
// When Supabase is wired up, add UPDATE providers SET tier='featured'
// or tier='free' based on the event type.

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.log('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set — logging raw event');
    // Drain the body so Vercel doesn't hang
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
        console.log(`[stripe-webhook] checkout.session.completed — provider=${providerId} customer=${session.customer}`);
        // TODO:SUPABASE — UPDATE providers SET tier='featured', stripe_customer_id=session.customer WHERE id=providerId
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log(`[stripe-webhook] invoice.payment_failed — customer=${invoice.customer}`);
        // TODO:SUPABASE — UPDATE providers SET tier='free' WHERE stripe_customer_id=invoice.customer
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        console.log(`[stripe-webhook] subscription.deleted — customer=${sub.customer}`);
        // TODO:SUPABASE — UPDATE providers SET tier='free' WHERE stripe_customer_id=sub.customer
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
