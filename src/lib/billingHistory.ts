/**
 * Billing history persisted to localStorage. Seeded once on first read.
 */

export type ReceiptType =
  | "subscription"
  | "founding_creator_receipt"
  | "refund";

export interface BillingEntry {
  id: string;
  date: string; // human-readable, e.g. "Apr 1, 2026"
  description: string;
  amount: number; // USD
  currency: string;
  status: "paid" | "refunded" | "failed";
  type: ReceiptType;
  purchasedAt?: string; // ISO, for one-time
  expiresAt?: string; // ISO, for one-time
}

const KEY = "kp_billing_history";
const SEEDED_KEY = "kp_billing_seeded";

const SEED: BillingEntry[] = [
  {
    id: "inv_001",
    date: "Apr 1, 2026",
    description: "Creator plan — monthly",
    amount: 12.0,
    currency: "USD",
    status: "paid",
    type: "subscription",
  },
  {
    id: "inv_002",
    date: "Mar 1, 2026",
    description: "Creator plan — monthly",
    amount: 12.0,
    currency: "USD",
    status: "paid",
    type: "subscription",
  },
  {
    id: "inv_003",
    date: "Feb 1, 2026",
    description: "Creator plan — monthly",
    amount: 12.0,
    currency: "USD",
    status: "paid",
    type: "subscription",
  },
];

export function getBillingHistory(): BillingEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const seeded = window.localStorage.getItem(SEEDED_KEY);
    if (!seeded) {
      window.localStorage.setItem(KEY, JSON.stringify(SEED));
      window.localStorage.setItem(SEEDED_KEY, "1");
      return SEED;
    }
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BillingEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return SEED;
  }
}

export function addBillingEntry(entry: BillingEntry): void {
  if (typeof window === "undefined") return;
  try {
    const list = getBillingHistory();
    const next = [entry, ...list];
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
