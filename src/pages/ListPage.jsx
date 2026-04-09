import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import SEOHead from '../components/SEOHead';
import { C, F, M } from '../theme';
import { createProvider, createListing, setSession } from '../lib/store';
import { notifyAdminNewListing, notifyProviderWelcome } from '../lib/notify';

const STEPS = ['Your Details', 'Your API', 'Choose Tier', 'Review'];
const CATEGORIES = ['Data', 'Verification', 'Intelligence', 'Tools', 'Finance'];

const inputStyle = {
  width: '100%', background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 8,
  padding: '10px 14px', color: C.t, fontSize: 14, outline: 'none', fontFamily: F,
  boxSizing: 'border-box',
};
const labelStyle = {
  display: 'block', fontSize: 11, color: C.tD, textTransform: 'uppercase',
  letterSpacing: '0.08em', fontWeight: 600, marginBottom: 6,
};
const btnPrimary = {
  padding: '10px 24px', borderRadius: 8, border: 'none', background: '#1D4ED8',
  color: '#FFFFFF', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: F,
};
const btnSecondary = {
  padding: '10px 20px', borderRadius: 8, border: `1px solid ${C.bd}`,
  background: 'transparent', color: C.tM, fontSize: 14, cursor: 'pointer', fontFamily: F,
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function ListPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [provider, setProvider] = useState({ name: '', email: '', company_name: '', wallet_address: '' });
  const [api, setApi] = useState({ name: '', description: '', category: 'Data', base_url: '', mcp_endpoint: '', endpoints_count: '', tools_count: '', price_min: '0.001', price_max: '0.001' });
  const [tier, setTier] = useState('free');

  const up = (obj, setObj) => (key, val) => setObj(prev => ({ ...prev, [key]: val }));
  const uP = up(provider, setProvider);
  const uA = up(api, setApi);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const prov = await createProvider(provider);
      if (!prov) throw new Error('Failed to create provider account — check your details and try again.');
      const listing = await createListing({ ...api, provider_id: prov.id });
      if (!listing) throw new Error('Failed to create listing — the API details may be invalid.');
      setSession(prov.email);
      notifyProviderWelcome(prov);
      notifyAdminNewListing(listing, prov);
      setSubmitted(true);
    } catch (err) {
      console.error('[list] submit error:', err);
      setSubmitError(err.message || 'Submission failed. Please try again.');
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <PageShell>
        <SEOHead title="Listing Submitted — PayAPI Market" path="/list" />
        <div style={{ padding: '80px 32px', textAlign: 'center' }}>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16, color: '#10B981' }}>✓</div>
            <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 700, color: C.t, fontFamily: F }}>Listing submitted</h1>
            <p style={{ margin: '0 0 24px', fontSize: 15, color: C.tM, lineHeight: 1.55 }}>
              Your API will be reviewed within 24 hours. We'll email you at <strong style={{ color: C.t }}>{provider.email}</strong> when it's live.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link to="/dashboard" style={{ ...btnPrimary, textDecoration: 'none' }}>Go to Dashboard</Link>
              <Link to="/" style={{ ...btnSecondary, textDecoration: 'none' }}>Back to Marketplace</Link>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SEOHead title="List Your API — PayAPI Market" description="List your x402-powered API on PayAPI Market. Free to list. Keep 97% of revenue." path="/list" />
      <div style={{ padding: '48px 32px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 700, color: C.t, fontFamily: F }}>List your API</h1>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: C.tD }}>Free to list. Upgrade for featured placement and lower fees.</p>

          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 2, marginBottom: 32 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: 3, background: i <= step ? '#3B82F6' : C.bd, borderRadius: 2, marginBottom: 6, transition: 'background 0.2s' }} />
                <span style={{ fontSize: 10, color: i <= step ? '#3B82F6' : C.tD, fontWeight: 600, textTransform: 'uppercase' }}>{s}</span>
              </div>
            ))}
          </div>

          {/* Step 1: Provider details */}
          {step === 0 && (
            <>
              <Field label="Your name">
                <input style={inputStyle} value={provider.name} onChange={e => uP('name', e.target.value)} placeholder="Jane Smith" />
              </Field>
              <Field label="Email">
                <input style={inputStyle} type="email" value={provider.email} onChange={e => uP('email', e.target.value)} placeholder="jane@company.com" />
              </Field>
              <Field label="Company name (optional)">
                <input style={inputStyle} value={provider.company_name} onChange={e => uP('company_name', e.target.value)} placeholder="Acme Corp" />
              </Field>
              <Field label="Base wallet address (0x… for USDC on Base)">
                <input style={inputStyle} value={provider.wallet_address} onChange={e => uP('wallet_address', e.target.value)} placeholder="0x..." />
              </Field>
              <p style={{ fontSize: 12, color: C.tD, marginTop: -8 }}>This is where you'll receive per-request payments via x402.</p>
            </>
          )}

          {/* Step 2: API details */}
          {step === 1 && (
            <>
              <Field label="API name">
                <input style={inputStyle} value={api.name} onChange={e => uA('name', e.target.value)} placeholder="e.g. UK Property Data API" />
              </Field>
              <Field label="Description (max 200 chars)">
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }} value={api.description} onChange={e => uA('description', e.target.value.slice(0, 200))} placeholder="What does your API do?" />
                <div style={{ fontSize: 11, color: C.tD, marginTop: 4, textAlign: 'right' }}>{api.description.length}/200</div>
              </Field>
              <Field label="Category">
                <select style={inputStyle} value={api.category} onChange={e => uA('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Base URL">
                <input style={inputStyle} value={api.base_url} onChange={e => uA('base_url', e.target.value)} placeholder="https://your-api.up.railway.app" />
              </Field>
              <Field label="MCP endpoint URL (optional)">
                <input style={inputStyle} value={api.mcp_endpoint} onChange={e => uA('mcp_endpoint', e.target.value)} placeholder="https://your-api.up.railway.app/mcp/sse" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Number of endpoints">
                  <input style={inputStyle} type="number" value={api.endpoints_count} onChange={e => uA('endpoints_count', e.target.value)} placeholder="5" />
                </Field>
                <Field label="Number of tools">
                  <input style={inputStyle} type="number" value={api.tools_count} onChange={e => uA('tools_count', e.target.value)} placeholder="5" />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Price min (USDC/request)">
                  <input style={inputStyle} type="number" step="0.001" value={api.price_min} onChange={e => uA('price_min', e.target.value)} />
                </Field>
                <Field label="Price max (USDC/request)">
                  <input style={inputStyle} type="number" step="0.001" value={api.price_max} onChange={e => uA('price_max', e.target.value)} />
                </Field>
              </div>
              <p style={{ fontSize: 12, color: C.tD }}>Your API must return HTTP 402 with x402 payment headers on protected routes.</p>
            </>
          )}

          {/* Step 3: Tier selection */}
          {step === 2 && (
            <>
              <p style={{ fontSize: 14, color: C.tM, margin: '0 0 18px' }}>Choose how you want to appear on the marketplace.</p>
              {[
                { key: 'free', name: 'Free', price: '$0', fee: '3%', desc: 'Listed in directory, searchable by agents. You keep 97%.' },
                { key: 'featured', name: 'Featured', price: '$49/mo', fee: '2.5%', desc: 'Priority placement, highlighted card, reduced fee. You keep 97.5%.' },
              ].map(t => (
                <div key={t.key} onClick={() => setTier(t.key)} style={{
                  background: tier === t.key ? C.sf2 : C.sf,
                  border: `1.5px solid ${tier === t.key ? '#3B82F6' : C.bd}`,
                  borderRadius: 10, padding: '18px 20px', marginBottom: 10, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${tier === t.key ? '#3B82F6' : C.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {tier === t.key && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3B82F6' }} />}
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 600, color: C.t }}>{t.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: C.t }}>{t.price}</span>
                      <span style={{ fontSize: 12, color: C.tD }}>{t.fee} fee</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: C.tM, marginLeft: 28 }}>{t.desc}</div>
                </div>
              ))}
              {tier === 'featured' && (
                <p style={{ fontSize: 12, color: C.tD, marginTop: 8 }}>
                  You'll be redirected to Stripe after submitting to set up the $49/mo subscription.
                </p>
              )}
            </>
          )}

          {/* Step 4: Review */}
          {step === 3 && (
            <div style={{ background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 10, padding: '20px 22px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600, color: C.t }}>Review your listing</h3>
              {[
                ['Provider', provider.name],
                ['Email', provider.email],
                ['Wallet', provider.wallet_address ? `${provider.wallet_address.slice(0, 8)}...${provider.wallet_address.slice(-6)}` : '—'],
                ['API Name', api.name],
                ['Category', api.category],
                ['Base URL', api.base_url],
                ['Tools', `${api.endpoints_count || 0} endpoints / ${api.tools_count || 0} tools`],
                ['Price', `$${api.price_min}–$${api.price_max} USDC/request`],
                ['Tier', tier === 'featured' ? 'Featured ($49/mo, 2.5% fee)' : 'Free (3% fee)'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${C.bd}` }}>
                  <span style={{ fontSize: 13, color: C.tD }}>{k}</span>
                  <span style={{ fontSize: 13, color: C.t, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>{v}</span>
                </div>
              ))}
              <p style={{ fontSize: 12, color: C.tD, marginTop: 14 }}>Your listing will be reviewed within 24 hours.</p>
            </div>
          )}

          {/* Error message */}
          {submitError && (
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#EF4444', lineHeight: 1.5 }}>{submitError}</p>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <button onClick={() => step > 0 ? setStep(step - 1) : null} style={{ ...btnSecondary, visibility: step === 0 ? 'hidden' : 'visible' }}>Back</button>
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} style={btnPrimary}>Continue</button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} style={{ ...btnPrimary, background: '#10B981', opacity: submitting ? 0.6 : 1 }}>{submitting ? 'Submitting...' : 'Submit Listing'}</button>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
