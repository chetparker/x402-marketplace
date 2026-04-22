import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import SEOHead from '../components/SEOHead';
import { C, F, M } from '../theme';

// ─── Try-it-now terminal demo ───
const TERM_CSS = `
.try-wrap { width: 100%; max-width: 720px; margin: 0 auto; }
.try-label { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; color: #60A5FA; background: rgba(59,130,246,0.10); border: 1px solid rgba(59,130,246,0.28); padding: 5px 14px; border-radius: 100px; margin-bottom: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; font-family: ${M}; }
.try-label-dot { width: 6px; height: 6px; background: #3B82F6; border-radius: 50%; box-shadow: 0 0 0 0 rgba(59,130,246,0.7); animation: tryPing 1.6s ease-out infinite; }
@keyframes tryPing { 0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.55); } 80%,100% { box-shadow: 0 0 0 8px rgba(59,130,246,0); } }

.term { background: #050810; border: 1px solid #1F2937; border-radius: 14px; box-shadow: 0 24px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02); overflow: hidden; font-family: ${M}; text-align: left; }
.term-bar { display: flex; align-items: center; padding: 11px 14px; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); position: relative; }
.term-dots { display: flex; gap: 7px; }
.term-dot { width: 11px; height: 11px; border-radius: 50%; }
.term-dot-r { background: #FF5F56; }
.term-dot-y { background: #FFBD2E; }
.term-dot-g { background: #27C93F; }
.term-title { position: absolute; left: 50%; transform: translateX(-50%); font-size: 11px; color: rgba(255,255,255,0.42); letter-spacing: 0.03em; font-weight: 500; }
.term-body { padding: 1.3rem 1.5rem 1.5rem; min-height: 232px; font-size: 13.5px; line-height: 1.75; color: #E4E8EE; }
.term-line { white-space: pre-wrap; word-break: break-all; }
.term-prompt-mark { color: #60A5FA; user-select: none; margin-right: 6px; font-weight: 700; }
.term-cmd { color: #E4E8EE; }
.term-caret { display: inline-block; width: 7px; height: 14px; background: #E4E8EE; vertical-align: -2px; animation: termBlink 1s steps(1) infinite; margin-left: 2px; }
@keyframes termBlink { 50% { opacity: 0; } }
.term-status { font-weight: 700; padding: 2px 0; transition: color 0.45s ease; }
.term-status.red { color: #FF5F56; animation: termPulseRed 0.95s ease-in-out infinite, termAppear 0.25s ease-out; }
.term-status.green { color: #27C93F; animation: termFlashGreen 0.7s ease-out forwards; }
@keyframes termAppear { from { opacity: 0; transform: translateX(-3px); } to { opacity: 1; transform: translateX(0); } }
@keyframes termPulseRed { 0%,100% { opacity: 1; text-shadow: 0 0 14px rgba(255,95,86,0.55); } 50% { opacity: 0.65; text-shadow: 0 0 4px rgba(255,95,86,0.2); } }
@keyframes termFlashGreen { 0% { color: #FF5F56; transform: scale(1); text-shadow: 0 0 14px rgba(255,95,86,0.5); } 35% { color: #FFFFFF; transform: scale(1.045); text-shadow: 0 0 22px rgba(39,201,63,0.85); } 100% { color: #27C93F; transform: scale(1); text-shadow: 0 0 10px rgba(39,201,63,0.35); } }
.term-info { color: rgba(228,232,238,0.65); animation: termSlideIn 0.32s ease-out; }
.term-info-arrow { color: #3B82F6; margin-right: 6px; font-weight: 700; }
.term-spacer { height: 0.55rem; }
.term-json { color: #9CA3AF; word-break: break-all; white-space: pre-wrap; animation: termSlideIn 0.4s ease-out; }
.term-json .jk { color: #60A5FA; }
.term-json .jv { color: #E4E8EE; }
.term-json .jp { color: #4B5563; }
@keyframes termSlideIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 640px) {
  .term-body { padding: 1rem 1.1rem 1.2rem; font-size: 12px; min-height: 240px; }
  .term-bar { padding: 9px 12px; }
  .term-title { font-size: 10px; }
}
`;

function TerminalDemo() {
  const CMD = 'curl https://api.payapi.market/postcode/SW1A1AA';
  const [typed, setTyped] = useState('');
  const [step, setStep] = useState(0);
  const [runId, setRunId] = useState(0);
  const cancelRef = useRef(false);

  useEffect(() => {
    cancelRef.current = false;
    const timers = [];
    const wait = (ms) => new Promise((res) => { const id = setTimeout(res, ms); timers.push(id); });

    (async () => {
      setTyped('');
      setStep(0);
      await wait(700);
      for (let i = 1; i <= CMD.length; i++) {
        if (cancelRef.current) return;
        setTyped(CMD.slice(0, i));
        await wait(26 + Math.random() * 28);
      }
      await wait(480); if (cancelRef.current) return; setStep(1);
      await wait(950); if (cancelRef.current) return; setStep(2);
      await wait(720); if (cancelRef.current) return; setStep(3);
      await wait(560); if (cancelRef.current) return; setStep(4);
      await wait(420); if (cancelRef.current) return; setStep(5);
      await wait(6200); if (cancelRef.current) return;
      setRunId((n) => n + 1);
    })();

    return () => {
      cancelRef.current = true;
      timers.forEach(clearTimeout);
    };
  }, [runId]);

  const typingDone = typed.length === CMD.length;
  const statusClass = step >= 4 ? 'green' : 'red';

  return (
    <div className="try-wrap">
      <div style={{ textAlign: 'center' }}>
        <div className="try-label"><span className="try-label-dot" /> Try it now — live x402 call</div>
      </div>
      <div className="term" role="img" aria-label="Animated terminal demo: an AI agent calls the postcode API, receives a 402 Payment Required, pays $0.001 USDC on Base, and gets a JSON response.">
        <div className="term-bar">
          <div className="term-dots">
            <span className="term-dot term-dot-r" />
            <span className="term-dot term-dot-y" />
            <span className="term-dot term-dot-g" />
          </div>
          <span className="term-title">agent — payapi.market</span>
        </div>
        <div className="term-body">
          <div className="term-line">
            <span className="term-prompt-mark">$</span>
            <span className="term-cmd">{typed}</span>
            {!typingDone && <span className="term-caret" />}
          </div>

          {step >= 1 && (
            <div key={statusClass} className={`term-line term-status ${statusClass}`}>
              402 Payment Required
            </div>
          )}

          {step >= 2 && (
            <div className="term-line term-info">
              <span className="term-info-arrow">›</span>Agent pays $0.001 USDC on Base
            </div>
          )}

          {step >= 3 && (
            <div className="term-line term-info">
              <span className="term-info-arrow">›</span>Response in 0.8s
            </div>
          )}

          {step >= 5 && (
            <>
              <div className="term-spacer" />
              <div className="term-line term-json">
                <span className="jp">{'{'}</span>
                <span className="jk">"postcode"</span><span className="jp">: </span><span className="jv">"SW1A 1AA"</span><span className="jp">, </span>
                <span className="jk">"city"</span><span className="jp">: </span><span className="jv">"London"</span><span className="jp">, </span>
                <span className="jk">"region"</span><span className="jp">: </span><span className="jv">"..."</span>
                <span className="jp">{'}'}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ───
const STATS = [
  { v: '10', l: 'Live APIs' },
  { v: '65', l: 'Endpoints' },
  { v: '$3K+', l: 'Monthly revenue' },
  { v: '97%', l: 'Kept by providers' },
];

export default function HomePage() {
  return (
    <PageShell>
      <SEOHead page="home" />
      <style>{TERM_CSS}</style>

      {/* Hero */}
      <div style={{ padding: '64px 32px 32px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: 12, color: C.ac, fontFamily: M,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            marginBottom: 16, fontWeight: 600,
          }}>
            x402 marketplace · live
          </div>
          <h1 style={{
            margin: '0 0 22px',
            fontSize: 'clamp(34px, 5.4vw, 52px)',
            fontWeight: 800, color: C.t, fontFamily: F,
            lineHeight: 1.08, letterSpacing: '-0.025em',
          }}>
            Turn your data into a money-making API in 5 minutes.
          </h1>
          <p style={{
            margin: '0 0 14px',
            fontSize: 18, color: C.tM, lineHeight: 1.55,
            maxWidth: 640, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Got specialist knowledge? Property records, legal precedents, medical codes, logistics data? AI agents need it. They'll pay you per lookup. Automatically.
          </p>
          <p style={{
            margin: '0 0 32px',
            fontSize: 15, color: C.tD, lineHeight: 1.55,
            maxWidth: 580, marginLeft: 'auto', marginRight: 'auto',
          }}>
            No code required. We handle payments, hosting, and discovery. You keep 97%.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/list"
              style={{
                padding: '14px 28px',
                borderRadius: 10,
                background: '#1D4ED8',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 700,
                fontFamily: F,
                textDecoration: 'none',
                boxShadow: '0 2px 14px rgba(29,78,216,0.3)',
                border: '1px solid #1D4ED8',
              }}
            >
              List your API — free
            </Link>
            <Link
              to="/marketplace"
              style={{
                padding: '14px 24px',
                borderRadius: 10,
                background: 'transparent',
                border: `1px solid ${C.bd}`,
                color: C.t,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: F,
                textDecoration: 'none',
              }}
            >
              Explore the marketplace →
            </Link>
          </div>
        </div>
      </div>

      {/* Try it now — terminal demo */}
      <div style={{ padding: '24px 32px 8px' }}>
        <TerminalDemo />
      </div>

      {/* Stats */}
      <div style={{ padding: '40px 32px 72px' }}>
        <div style={{
          maxWidth: 720,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: C.bd,
          borderRadius: 14,
          overflow: 'hidden',
          border: `1px solid ${C.bd}`,
        }}>
          {STATS.map(s => (
            <div key={s.l} style={{ background: C.sf, padding: '24px 16px', textAlign: 'center' }}>
              <div style={{
                fontSize: 26, fontWeight: 800,
                color: C.t, fontFamily: M,
                letterSpacing: '-0.02em', marginBottom: 4,
              }}>{s.v}</div>
              <div style={{ fontSize: 12, color: C.tD, fontFamily: F }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
