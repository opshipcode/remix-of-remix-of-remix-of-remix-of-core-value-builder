import { MOCK_INQUIRIES } from "./mockData";

export type InquiryStatus = "unread" | "in_progress" | "completed";

export interface Inquiry {
  id: string;
  brandName: string;
  contactName: string;
  email: string;
  phone?: string;
  budget: string;
  deliverables?: string[];
  summary: string;
  status: InquiryStatus;
  receivedAt: string;
  movedToInProgressAt?: string;
  completedAt?: string;
  amountPaidUSD?: number | null;
}

const KEY = "kp_inquiries";

const INITIAL: Inquiry[] = MOCK_INQUIRIES.map((m, i) => ({
  id: m.id,
  brandName: m.brandName,
  contactName: m.contactName,
  email: m.email,
  budget: m.budget,
  summary: m.summary,
  deliverables: ["IG Reel", "TikTok"],
  status: i === 0 ? "unread" : i === 1 ? "in_progress" : "unread",
  receivedAt: m.receivedAt,
  movedToInProgressAt:
    i === 1 ? new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() : undefined,
}));

// Add a few completed deals for the earnings preview
const COMPLETED_SEED: Inquiry[] = [
  {
    id: "i_done_1",
    brandName: "Glossier",
    contactName: "Maya Chen",
    email: "maya@glossier.com",
    budget: "$1k–$3k",
    summary: "Spring launch reel set.",
    status: "completed",
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    amountPaidUSD: 1800,
  },
  {
    id: "i_done_2",
    brandName: "Notion",
    contactName: "Priya Shah",
    email: "priya@notion.so",
    budget: "$3k–$5k",
    summary: "Productivity workflow long-form.",
    status: "completed",
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    amountPaidUSD: 1400,
  },
];

export function loadInquiries(): Inquiry[] {
  if (typeof window === "undefined") return [...INITIAL, ...COMPLETED_SEED];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const seed = [...INITIAL, ...COMPLETED_SEED];
      window.localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as Inquiry[];
  } catch {
    return [...INITIAL, ...COMPLETED_SEED];
  }
}

export function saveInquiries(items: Inquiry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function inquiriesToCSV(items: Inquiry[]): string {
  const header = ["Date", "Brand", "Email", "Budget Range", "Amount Paid", "Status"];
  const rows = items.map((i) => [
    new Date(i.receivedAt).toISOString().slice(0, 10),
    csvEscape(i.brandName),
    csvEscape(i.email),
    csvEscape(i.budget),
    i.amountPaidUSD != null ? String(i.amountPaidUSD) : "",
    i.status,
  ]);
  return [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function csvEscape(v: string): string {
  if (/[,"\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}
