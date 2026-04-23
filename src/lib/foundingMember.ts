const KEY = "kp_lto_spots";
const DEFAULT_SPOTS = 43;
const MAX_SPOTS = 50;

export function getFoundingSpotsRemaining(): number {
  if (typeof window === "undefined") return DEFAULT_SPOTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SPOTS;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 && n <= MAX_SPOTS ? n : DEFAULT_SPOTS;
  } catch {
    return DEFAULT_SPOTS;
  }
}

export function decrementFoundingSpots(): number {
  const current = getFoundingSpotsRemaining();
  const next = Math.max(0, current - 1);
  try {
    window.localStorage.setItem(KEY, String(next));
  } catch {
    /* ignore */
  }
  return next;
}

export const FOUNDING_PRICE_USD = 349;
export const FOUNDING_TOTAL_SPOTS = MAX_SPOTS;
