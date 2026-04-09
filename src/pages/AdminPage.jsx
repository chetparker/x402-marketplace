import { useState } from 'react';
import PageShell from '../components/PageShell';
import SEOHead from '../components/SEOHead';
import { C, F, M } from '../theme';
import {
  getAllProviders, getAllListings, getListingsByStatus,
  getProviderById, updateListing, updateProvider,
} from '../lib/store';
import { notifyProviderApproved, notifyProviderRejected } from '../lib/notify';

// MVP: simple password gate. Set VITE_ADMIN_PASSWORD in .env or Vercel env vars.
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'payapi2026';

const STATUS_COLORS = {
  pending_review: '#F59E0B',
  live: '#10B981',
  rejected: '#EF4444',
  paused: C.tD,
  pending: '#F59E0B',
  approved: '#10B981',
  suspended: '#EF4444',
};

function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('payapi_admin', '1');
      onAuth();
    } else {
      setErr(true);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '0 auto', padding: '100px 32px', textAlign: 'center' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: C.t, fontFamily: F }}>Admin</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(false); }}
          placeholder="Password"
          style={{
            width: '100%', background: C.sf, border: `1px solid ${err ? '#EF4444' : C.bd}`,
            borderRadius: 8, padding: '10px 14px', color: C.t, fontSize: 14, outline: 'none',
            fontFamily: F, boxSizing: 'border-box', marginBottom: 12,
          }}
        />
        <button type="submit" style={{
          width: '100%', padding: '10px 0', borderRadius: 8, border: 'none',
          background: '#1D4ED8', color: '#FFFFFF', fontSize: 14, fontWeight: 500,
          cursor: 'pointer', fontFamily: F,
        }}>Sign in</button>
      </form>
      {err && <p style={{ margin: '10px 0 0', fontSize: 13, color: '#EF4444' }}>Wrong password.</p>}
    </div>
  );
}

function AdminPanel() {
  const [tab, setTab] = useState('pending');
  const [listings, setListings] = useState(() => getAllListings());
  const [providers, setProviders] = useState(() => getAllProviders());
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  function refresh() {
    setListings(getAllListings());
    setProviders(getAllProviders());
  }

  function approveListing(id) {
    const listing = updateListing(id, { status: 'live' });
    if (listing) {
      const prov = getProviderById(listing.provider_id);
      if (prov) {
        updateProvider(prov.id, { status: 'approved' });
        notifyProviderApproved(prov, listing);
      }
    }
    refresh();
  }

  function rejectListing(id) {
    const listing = updateListing(id, { status: 'rejected' });
    if (listing) {
      const prov = getProviderById(listing.provider_id);
      if (prov) notifyProviderRejected(prov, listing, rejectReason);
    }
    setRejectId(null);
    setRejectReason('');
    refresh();
  }

  function toggleSuspendProvider(provId) {
    const prov = providers.find(p => p.id === provId);
    if (!prov) return;
    updateProvider(provId, { status: prov.status === 'suspended' ? 'approved' : 'suspended' });
    refresh();
  }

  const tabStyle = (active) => ({
    padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active ? 'rgba(59,130,246,0.10)' : 'transparent',
    color: active ? '#3B82F6' : C.tD, fontSize: 13, fontWeight: 500, fontFamily: F,
  });

  const pending = listings.filter(l => l.status === 'pending_review');

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 32px' }}>
      <h1 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 700, color: C.t, fontFamily: F }}>
        Admin Panel
        <span style={{ fontSize: 13, color: C.tD, fontWeight: 400, marginLeft: 12 }}>
          {providers.length} providers · {listings.length} listings · {pending.length} pending
        </span>
      </h1>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        <button onClick={() => setTab('pending')} style={tabStyle(tab === 'pending')}>
          Pending Review {pending.length > 0 && `(${pending.length})`}
        </button>
        <button onClick={() => setTab('listings')} style={tabStyle(tab === 'listings')}>All Listings</button>
        <button onClick={() => setTab('providers')} style={tabStyle(tab === 'providers')}>All Providers</button>
      </div>

      {/* Pending reviews */}
      {tab === 'pending' && (
        pending.length === 0 ? (
          <div style={{ background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 10, padding: 32, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 14, color: C.tD }}>No pending reviews.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pending.map(l => {
              const prov = getProviderById(l.provider_id);
              return (
                <div key={l.id} style={{ background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 10, padding: '18px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: C.t }}>{l.name}</div>
                      <div style={{ fontSize: 12, color: C.tD, marginTop: 2 }}>
                        by {prov ? prov.name : '?'} ({prov ? prov.email : '?'}) · {l.category} · {l.endpoints_count} endpoints
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: C.tD }}>{new Date(l.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: 13, color: C.tM, marginBottom: 10, lineHeight: 1.5 }}>{l.description}</div>
                  <div style={{ fontSize: 12, color: C.tD, marginBottom: 14 }}>
                    URL: <a href={l.base_url} target="_blank" rel="noopener" style={{ color: '#3B82F6' }}>{l.base_url}</a>
                    {l.mcp_endpoint && <> · MCP: <a href={l.mcp_endpoint} target="_blank" rel="noopener" style={{ color: '#3B82F6' }}>{l.mcp_endpoint}</a></>}
                    {prov && <> · Wallet: <span style={{ fontFamily: M }}>{prov.wallet_address.slice(0, 10)}…</span></>}
                  </div>

                  {rejectId === l.id ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                        placeholder="Rejection reason"
                        style={{ flex: 1, background: C.bg, border: `1px solid ${C.bd}`, borderRadius: 6, padding: '6px 10px', color: C.t, fontSize: 13, outline: 'none', fontFamily: F }}
                      />
                      <button onClick={() => rejectListing(l.id)} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#EF4444', color: '#FFF', fontSize: 12, cursor: 'pointer', fontFamily: F }}>Reject</button>
                      <button onClick={() => setRejectId(null)} style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.bd}`, background: 'transparent', color: C.tD, fontSize: 12, cursor: 'pointer', fontFamily: F }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => approveListing(l.id)} style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: '#10B981', color: '#FFF', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: F }}>Approve</button>
                      <button onClick={() => setRejectId(l.id)} style={{ padding: '6px 16px', borderRadius: 6, border: `1px solid ${C.bd}`, background: 'transparent', color: '#EF4444', fontSize: 12, cursor: 'pointer', fontFamily: F }}>Reject</button>
                      <a href={`${l.base_url}/health`} target="_blank" rel="noopener" style={{ padding: '6px 16px', borderRadius: 6, border: `1px solid ${C.bd}`, background: 'transparent', color: C.tD, fontSize: 12, textDecoration: 'none', fontFamily: F, display: 'inline-flex', alignItems: 'center' }}>Test /health</a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* All listings */}
      {tab === 'listings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {listings.length === 0 && <p style={{ color: C.tD }}>No listings yet.</p>}
          {listings.map(l => {
            const prov = getProviderById(l.provider_id);
            return (
              <div key={l.id} style={{ background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 8, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 14, color: C.t, fontWeight: 500 }}>{l.name}</span>
                  <span style={{ fontSize: 12, color: C.tD, marginLeft: 10 }}>{prov ? prov.email : '?'} · {l.category}</span>
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                  color: STATUS_COLORS[l.status] || C.tD, background: `${STATUS_COLORS[l.status] || C.tD}15`,
                }}>{l.status.replace('_', ' ')}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* All providers */}
      {tab === 'providers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {providers.length === 0 && <p style={{ color: C.tD }}>No providers yet.</p>}
          {providers.map(p => (
            <div key={p.id} style={{ background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 8, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 14, color: C.t, fontWeight: 500 }}>{p.name}</span>
                <span style={{ fontSize: 12, color: C.tD, marginLeft: 10 }}>{p.email} · {p.tier} · {getListingsByStatus('live').filter(l => l.provider_id === p.id).length} live</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                  color: STATUS_COLORS[p.status] || C.tD, background: `${STATUS_COLORS[p.status] || C.tD}15`,
                }}>{p.status}</span>
                <button onClick={() => toggleSuspendProvider(p.id)} style={{
                  padding: '4px 12px', borderRadius: 6, border: `1px solid ${C.bd}`,
                  background: 'transparent', color: p.status === 'suspended' ? '#10B981' : '#EF4444',
                  fontSize: 11, cursor: 'pointer', fontFamily: F,
                }}>{p.status === 'suspended' ? 'Unsuspend' : 'Suspend'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('payapi_admin') === '1');

  return (
    <PageShell>
      <SEOHead title="Admin — PayAPI Market" path="/admin" noindex />
      {authed ? <AdminPanel /> : <PasswordGate onAuth={() => setAuthed(true)} />}
    </PageShell>
  );
}
