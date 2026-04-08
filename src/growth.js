// Deterministic per-day growth helpers for the marketplace stats.
//
// Goals:
//   - Same numbers on every page load on the same UTC day
//   - Different numbers each day, growing from a launch baseline
//   - "Just launched" pill for new APIs for the first PILL_DAYS days, then
//     they start showing small synthetic-but-believable stats and grow
//   - UK Data (the only API with real traffic) grows from its real launch
//     baseline (12,800 calls / $284) at ~225 calls/day and ~$7/day with
//     daily noise in [~150, ~300] / [~$4, ~$10]
//   - Marketplace totals are computed independently of card sums per the
//     spec — totals start at 13,000 / $300 and grow at ~300 calls/day /
//     ~$10/day with daily noise in [~200, ~400] / [~$5, ~$15]
//
// Math per the spec:
//   value = baseValue + days * avgDailyGrowth + sin(seed) * variance
//
//   - avgDailyGrowth and variance are picked so day-to-day diffs are
//     always non-negative (no apparent backsliding day-over-day)
//   - The sin() seed mixes day-of-year and per-API index for natural
//     variance that's different for each card on each day

const LAUNCH_DATE_UTC = '2026-04-08';
export const PILL_DAYS = 14;

function utcMillis(iso) {
  return new Date(iso + 'T00:00:00Z').getTime();
}

export function getDaysSinceLaunch(now = Date.now()) {
  const days = Math.floor((now - utcMillis(LAUNCH_DATE_UTC)) / 86400000);
  return Math.max(0, days);
}

export function getDayOfYear(now = new Date()) {
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  return Math.floor((now.getTime() - start) / 86400000);
}

const noise = (seed) => Math.sin(seed);

// Compute display stats for one API. Returns { c, r, justLaunched }.
//   `idx` is the API's index in the canonical APIS array (stable per API)
//   `days` and `doy` are passed in so a single page render uses one
//   consistent timestamp across every card and the totals row
export function computeCardStats(api, idx, days, doy) {
  // The established UK Data API: grows from real launch numbers
  if (api.id === 'io.github.chetparker/uk-data-api') {
    return {
      c: 12800 + days * 225 + Math.floor(noise(doy * 1.7 + idx * 11) * 75),
      r: 284 + days * 7 + Math.floor(noise(doy * 2.3 + idx * 13) * 3),
      justLaunched: false,
    };
  }

  // Newer APIs: show "Just launched" pill for the first PILL_DAYS days
  if (days < PILL_DAYS) {
    return { c: 0, r: 0, justLaunched: true };
  }

  // After the pill window, synthesize a small per-API baseline and grow.
  // baseC and baseR are deterministic per API (idx-only seed) so each card
  // has a stable launch number that doesn't fluctuate day-to-day.
  const daysAfterPill = days - PILL_DAYS;
  const baseC = 50 + Math.floor(Math.abs(noise(idx * 7.31)) * 150); // 50–199
  const baseR = 1 + Math.floor(Math.abs(noise(idx * 5.13)) * 5);    // 1–5
  return {
    c: baseC + daysAfterPill * 30 + Math.floor(noise(doy * 1.3 + idx * 3.7) * 15),
    r: baseR + daysAfterPill * 2 + Math.floor(noise(doy * 2.1 + idx * 2.9) * 1),
    justLaunched: false,
  };
}

// Marketplace totals — computed independently from card sums per spec.
//   apiCount and toolCount stay static (10 / 65)
//   calls baseline 13,000, ~300/day average, ± ~100 daily noise
//   rev baseline $300, ~$10/day average, ± ~$5 daily noise
export function computeTotalStats(apiCount, toolCount, days, doy) {
  return {
    apis: apiCount,
    tools: toolCount,
    calls: 13000 + days * 300 + Math.floor(noise(doy * 1.9) * 100),
    rev: 300 + days * 10 + Math.floor(noise(doy * 2.1) * 5),
  };
}
