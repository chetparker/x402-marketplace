import { useState } from 'react';
import { C, F, M } from '../theme';

export default function EmailCapture({
  headline = 'Get the API Monetisation Playbook',
  subhead = 'How to list, price and earn from your API on the agent economy. One email a week. No spam.',
  source = 'inline',
  compact = false,
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Enter a valid email');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error('Subscribe failed');
      setStatus('success');
      setMessage('Check your inbox for the playbook.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Try again.');
    }
  }

  return (
    <div style={{
      background: C.sf,
      border: `1px solid ${C.bd}`,
      borderRadius: 14,
      padding: compact ? '20px 22px' : '28px 32px',
      margin: '32px 0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: C.ac, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free playbook</span>
      </div>
      <h3 style={{
        margin: '0 0 6px',
        fontSize: compact ? 18 : 22,
        fontWeight: 800,
        color: C.t,
        fontFamily: F,
        lineHeight: 1.2,
      }}>{headline}</h3>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: C.tM, lineHeight: 1.55 }}>{subhead}</p>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@domain.com"
          disabled={status === 'loading' || status === 'success'}
          style={{
            flex: '1 1 220px',
            background: C.bg,
            border: `1px solid ${C.bd}`,
            borderRadius: 10,
            padding: '11px 14px',
            color: C.t,
            fontSize: 14,
            outline: 'none',
            fontFamily: F,
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          style={{
            padding: '11px 22px',
            borderRadius: 10,
            border: 'none',
            background: status === 'success' ? C.gn : C.ac,
            color: C.bg,
            fontSize: 13,
            fontWeight: 700,
            cursor: status === 'loading' ? 'wait' : 'pointer',
            fontFamily: F,
            whiteSpace: 'nowrap',
          }}
        >
          {status === 'loading' ? 'Sending…' : status === 'success' ? '✓ Subscribed' : 'Get the playbook'}
        </button>
      </form>
      {message && (
        <div style={{
          marginTop: 10,
          fontSize: 12,
          color: status === 'error' ? C.rd : C.gn,
          fontFamily: M,
        }}>{message}</div>
      )}
    </div>
  );
}
