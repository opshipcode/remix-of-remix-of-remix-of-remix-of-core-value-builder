import type { PlatformId } from "@/store/kitPage";

export interface ReportContent {
  url: string;
  platform: PlatformId | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  postedAt: string;
  thumbnailUrl: string | null;
}

export interface CampaignReport {
  id: string;
  period: string; // e.g. "apr26"
  campaignLabel: string;
  contents: ReportContent[];
  passwordProtected: boolean;
  passphrase: string;
  views: number;
  createdAt: string; // ISO
  expiresAt: string | null; // ISO or null for paid
  statsUpdatedAt: string; // ISO
}

const KEY = "kp_reports";

export function detectPlatformFromUrl(url: string): PlatformId | null {
  const u = url.toLowerCase().trim();
  if (!u) return null;
  if (u.includes("tiktok.com")) return "tiktok";
  if (u.includes("instagram.com")) return "instagram";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  return null;
}

export function genReportId(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function genPeriod(d: Date = new Date()): string {
  const months = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];
  const yy = String(d.getFullYear()).slice(2);
  return `${months[d.getMonth()]}${yy}`;
}

export function loadReports(): CampaignReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed as CampaignReport[];
    return [];
  } catch {
    return [];
  }
}

export function saveReports(reports: CampaignReport[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(reports));
  } catch {
    // ignore
  }
}

export function getReport(period: string, id: string): CampaignReport | null {
  const all = loadReports();
  return all.find((r) => r.period === period && r.id === id) ?? null;
}

function seedDummyContent(platform: PlatformId): ReportContent {
  const base = {
    tiktok: { url: "https://www.tiktok.com/@alexrivera/video/dummy1", views: 482000, likes: 38400, comments: 1820, shares: 920 },
    instagram: { url: "https://www.instagram.com/p/dummy2/", views: 184000, likes: 14200, comments: 480, shares: 320 },
    youtube: { url: "https://www.youtube.com/watch?v=dummy3", views: 92000, likes: 4800, comments: 220, shares: 110 },
  }[platform];
  return {
    url: base.url,
    platform,
    views: base.views,
    likes: base.likes,
    comments: base.comments,
    shares: base.shares,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    thumbnailUrl: null,
  };
}

export function ensureSeedReports(): CampaignReport[] {
  const existing = loadReports();
  if (existing.length > 0) return existing;
  const now = Date.now();
  const seeded: CampaignReport[] = [
    {
      id: "ab12cd",
      period: genPeriod(),
      campaignLabel: "Glossier Spring 2026",
      contents: [seedDummyContent("tiktok"), seedDummyContent("instagram")],
      passwordProtected: false,
      passphrase: "",
      views: 142,
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
      expiresAt: null,
      statsUpdatedAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: "ef34gh",
      period: "jan26",
      campaignLabel: "Notion Q1 Launch",
      contents: [seedDummyContent("youtube")],
      passwordProtected: true,
      passphrase: "notion2026",
      views: 312,
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 60).toISOString(),
      expiresAt: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
      statsUpdatedAt: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
  ];
  saveReports(seeded);
  return seeded;
}

export function isExpired(report: CampaignReport): boolean {
  if (!report.expiresAt) return false;
  return new Date(report.expiresAt).getTime() < Date.now();
}

export function hoursSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60);
}

export function formatTimeAgo(iso: string): string {
  const h = hoursSince(iso);
  if (h < 1) return `${Math.round(h * 60)}m ago`;
  if (h < 24) return `${Math.round(h)}h ago`;
  return `${Math.round(h / 24)}d ago`;
}
