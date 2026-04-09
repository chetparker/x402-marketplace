import PageShell from '../components/PageShell';
import SEOHead from '../components/SEOHead';
import APICalculator from '../components/APICalculator';
import ExitIntentPopup from '../components/ExitIntentPopup';
import { C, F } from '../theme';

export default function CalculatorPage() {
  return (
    <PageShell>
      <SEOHead page="calculator" />
      <div style={{ padding: '60px 32px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto 32px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 10px', fontSize: 38, fontWeight: 800, color: C.t, fontFamily: F, lineHeight: 1.15 }}>
            How much can your API earn?
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: C.tM, lineHeight: 1.55 }}>
            Built for the AI agent economy. Move the sliders, see real revenue projections, get the full report.
          </p>
        </div>
        <APICalculator />
      </div>
      <ExitIntentPopup />
    </PageShell>
  );
}
