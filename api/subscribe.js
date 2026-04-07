// Vercel serverless function for email capture.
// POST /api/subscribe { email, source }
//
// Forwards to Buttondown when BUTTONDOWN_API_KEY is set in the environment.
// Falls back to log-and-succeed if the key is missing so local dev / preview
// deploys without secrets still work.

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
  const { email, source = 'unknown' } = body || {};

  if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const buttondownKey = process.env.BUTTONDOWN_API_KEY;
  if (buttondownKey) {
    try {
      const bd = await fetch('https://api.buttondown.com/v1/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${buttondownKey}`,
        },
        body: JSON.stringify({
          email_address: email,
          tags: [source],
          referrer_url: req.headers.referer || undefined,
        }),
      });

      // 200/201 = created. 400 with "already subscribed" should be treated
      // as success so duplicate signups don't show an error to the user.
      if (bd.ok) {
        return res.status(200).json({ ok: true });
      }

      const errText = await bd.text().catch(() => '');
      if (bd.status === 400 && /already.*subscrib/i.test(errText)) {
        return res.status(200).json({ ok: true, duplicate: true });
      }

      console.error(`[subscribe] buttondown ${bd.status}: ${errText}`);
      return res.status(502).json({ error: 'Subscription provider error' });
    } catch (err) {
      console.error('[subscribe] buttondown fetch failed', err);
      return res.status(502).json({ error: 'Subscription provider unreachable' });
    }
  }

  // No key configured — log so local dev still works without secrets.
  console.log(`[subscribe] ${email} (source=${source}) — BUTTONDOWN_API_KEY not set, skipping`);
  return res.status(200).json({ ok: true });
}
