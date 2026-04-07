import { useState, useMemo } from 'react';
import { C, F, M } from '../theme';
import EmailCapture from './EmailCapture';

const fmt = n => n >= 1000
  ? '$' + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K'
  : '$' + n.toFixed(2);
const fmtInt = n => n.toLocaleString('en-US');

function Slider({ label, value, min, max, step, onChange, format, color = C.ac }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <label style={{ fontSize: 12, color: C.tD, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</label>
        <span style={{ fontSize: 18, fontWeight: 700, color, fontFamily: M }}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: color,
          height: 4,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: C.tD, fontFamily: M }}>
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function APICalculator() {
  const [endpoints, setEndpoints] = useState(10);
  const [callsPerDay, setCallsPerDay] = useState(500);
  const [price, setPrice] = useState(0.005);

  const totals = useMemo(() => {
    const dailyGross = endpoints * callsPerDay * price;
    const monthlyGross = dailyGross * 30;
    const annualGross = dailyGross * 365;
    const fee = 0.03;
    return {
      dailyGross,
      monthlyGross,
      annualGross,
      dailyNet: dailyGross * (1 - fee),
      monthlyNet: monthlyGross * (1 - fee),
      annualNet: annualGross * (1 - fee),
      platformFee: monthlyGross * fee,
    };
  }, [endpoints, callsPerDay, price]);

  const trad = 49 * 12; // $49/mo traditional subscription annual
  const yearsToMatch = trad / Math.max(totals.annualNet, 1);

  return (
    <div style={{
      background: C.bg2,
      border: `1px solid ${C.bd}`,
      borderRadius: 16,
      padding: '32px 36px',
      maxWidth: 820,
      margin: '0 auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: C.t, fontFamily: F }}>
          API Revenue Calculator
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: C.tM }}>
          How much can your API earn on the agent economy? Move the sliders.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
        <div>
          <Slider
            label="Endpoints"
            value={endpoints}
            min={1}
            max={50}
            step={1}
            onChange={setEndpoints}
            format={v => `${v}`}
            color={C.ac}
          />
          <Slider
            label="Daily calls per endpoint"
            value={callsPerDay}
            min={10}
            max={10000}
            step={10}
            onChange={setCallsPerDay}
            format={v => fmtInt(v)}
            color={C.pu}
          />
          <Slider
            label="Price per request"
            value={price}
            min={0.001}
            max={0.05}
            step={0.001}
            onChange={setPrice}
            format={v => '$' + v.toFixed(3)}
            color={C.gn}
          />
        </div>

        <div style={{
          background: C.sf,
          borderRadius: 12,
          padding: '22px 24px',
          border: `1px solid ${C.bd}`,
        }}>
          <div style={{ fontSize: 11, color: C.tD, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, fontWeight: 600 }}>
            Your revenue
          </div>
          {[
            { label: 'Daily', gross: totals.dailyGross, net: totals.dailyNet },
            { label: 'Monthly', gross: totals.monthlyGross, net: totals.monthlyNet },
            { label: 'Annual', gross: totals.annualGross, net: totals.annualNet },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '10px 0', borderBottom: `1px solid ${C.bd}`,
            }}>
              <span style={{ fontSize: 13, color: C.tM }}>{row.label}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.gn, fontFamily: M }}>{fmt(row.net)}</div>
                <div style={{ fontSize: 10, color: C.tD, fontFamily: M }}>gross {fmt(row.gross)}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 14, fontSize: 11, color: C.tD, lineHeight: 1.5 }}>
            <span style={{ color: C.gn, fontFamily: M }}>97%</span> you keep &nbsp;·&nbsp;
            <span style={{ color: C.am, fontFamily: M }}>3%</span> platform fee
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div style={{
        marginTop: 28,
        background: C.sf,
        border: `1px solid ${C.bd}`,
        borderRadius: 12,
        padding: '20px 24px',
      }}>
        <div style={{ fontSize: 11, color: C.tD, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 600 }}>
          vs. traditional API subscription ($49/mo)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: C.tD, marginBottom: 4 }}>Subscription model</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.tM, fontFamily: M }}>${trad}/yr</div>
            <div style={{ fontSize: 11, color: C.tD, marginTop: 4 }}>Fixed revenue per customer</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.tD, marginBottom: 4 }}>x402 per-request</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.gn, fontFamily: M }}>{fmt(totals.annualNet)}/yr</div>
            <div style={{ fontSize: 11, color: C.tD, marginTop: 4 }}>
              {totals.annualNet > trad
                ? `${(totals.annualNet / trad).toFixed(1)}x more than one subscription`
                : `Break-even at ${yearsToMatch.toFixed(1)} sub(s)`}
            </div>
          </div>
        </div>
      </div>

      <EmailCapture
        source="calculator"
        headline="Get the Full Revenue Report"
        subhead="We'll email a PDF with your projections, pricing strategy and the 10-minute listing checklist."
      />
    </div>
  );
}
