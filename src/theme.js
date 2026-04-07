// Shared dark theme palette — must match src/App.jsx
// Two-color system: white text + #3B82F6 accent. All other "color" keys
// are intentionally aliased to neutral grays so legacy call sites remain
// safe but render in a flat, restrained palette.
const NEUTRAL = "#9CA3AF";
const NEUTRAL_BG = "rgba(255,255,255,0.04)";

export const C = {
  bg: "#06080D", bg2: "#0B0F16", sf: "#0F141C", sf2: "#141A24",
  bd: "#1F2937", bdH: "#374151",
  ac: "#3B82F6", acD: "rgba(59,130,246,0.10)", acM: "rgba(59,130,246,0.30)",
  gn: NEUTRAL, gnD: NEUTRAL_BG,
  am: NEUTRAL, amD: NEUTRAL_BG,
  gold: NEUTRAL, goldD: NEUTRAL_BG, goldM: "#1F2937",
  rd: NEUTRAL, pu: NEUTRAL, puD: NEUTRAL_BG,
  t: "#FFFFFF", tM: "#9CA3AF", tD: "#6B7280",
};
export const F = "'Söhne',-apple-system,sans-serif";
export const M = "'Geist Mono','SF Mono',monospace";
