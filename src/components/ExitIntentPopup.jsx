import { useState, useEffect } from 'react';
import { C, F } from '../theme';

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('exit_popup_shown')) return;

    function onMouseOut(e) {
      if (e.clientY < 10 && !sessionStorage.getItem('exit_popup_shown')) {
        sessionStorage.setItem('exit_popup_shown', '1');
        setShow(true);
        document.removeEventListener('mouseout', onMouseOut);
      }
    }

    document.addEventListener('mouseout', onMouseOut);
    return () => document.removeEventListener('mouseout', onMouseOut);
  }, []);

  if (!show) return null;

  async function onSubmit(e) {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exit-intent-calculator' }),
      });
      if (r.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div
      onClick={() => setShow(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.bg2 || '#0B0F16',
          border: `1px solid ${C.bd}`,
          borderRadius: 16,
          padding: '36px 32px',
          width: 'min(440px, 100%)',
          position: 'relative',
        }}
      >
        <button
          onClick={() => setShow(false)}
          style={{
            position: 'absolute', top: 14, right: 14,
            background: C.sf, border: `1px solid ${C.bd}`,
            color: C.tD, width: 30, height: 30, borderRadius: 8,
            cursor: 'pointer', fontSize: 15, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          ×
        </button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, color: C.t, fontFamily: F }}>Report on its way</h3>
            <p style={{ margin: 0, fontSize: 14, color: C.tM }}>Check your inbox.</p>
          </div>
        ) : (
          <>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: C.t, fontFamily: F }}>
              Get the Full API Monetisation Report
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: C.tM, lineHeight: 1.55 }}>
              See projected revenue for your specific API — delivered to your inbox.
            </p>
            <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 8,
                  background: C.sf, border: `1px solid ${C.bd}`,
                  color: C.t, fontSize: 14, outline: 'none', fontFamily: F,
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  padding: '10px 18px', borderRadius: 8, border: 'none',
                  background: '#1D4ED8', color: '#FFFFFF', fontSize: 14,
                  fontWeight: 500, cursor: 'pointer', fontFamily: F,
                  whiteSpace: 'nowrap',
                  opacity: status === 'loading' ? 0.6 : 1,
                }}
              >
                {status === 'loading' ? 'Sending...' : 'Send My Report'}
              </button>
            </form>
            {status === 'error' && (
              <p style={{ margin: '10px 0 0', fontSize: 12, color: '#EF4444' }}>Something went wrong. Try again.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
