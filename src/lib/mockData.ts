/**
 * Mock data for the entire frontend build.
 * Replace with real Supabase queries in Phase 2.
 */

export const MOCK_CREATOR = {
  id: "usr_mock_001",
  slug: "alexrivera",
  displayName: "Alex Rivera",
  headline: "Lifestyle and tech creator helping brands ship better launch content",
  bio: "I make calm, polished short-form content for premium tech and lifestyle brands. 4.2M+ combined audience across TikTok, IG and YouTube. Past partners include Notion, Glossier, and Bose.",
  avatarUrl: "",
  niches: ["Tech", "Lifestyle", "Wellness"],
  location: "Brooklyn, NY",
  contactEmail: "alex@kitpager.pro",
  template: "minimal",
  themeAccent: "teal",
};

export const MOCK_PLATFORMS = [
  {
    platform: "tiktok",
    handle: "@alexrivera",
    followers: 1840000,
    verified: true,
    avgViews: 412000,
    engagementRate: 0.064,
  },
  {
    platform: "instagram",
    handle: "@alexrivera",
    followers: 1290000,
    verified: true,
    avgViews: 198000,
    engagementRate: 0.041,
  },
  {
    platform: "youtube",
    handle: "@alexrivera",
    followers: 1080000,
    verified: false,
    avgViews: 285000,
    engagementRate: 0.052,
  },
];

export const MOCK_CONTENT_ITEMS = [
  {
    id: "c1",
    platform: "youtube",
    title: "The case for boring software",
    thumbnailUrl: "",
    viewCount: 1240000,
    likeCount: 84200,
    commentCount: 3120,
    engagementRate: 0.0704,
    metricSource: "api",
    isFeatured: true,
    nicheTag: "Tech",
  },
  {
    id: "c2",
    platform: "instagram",
    title: "Morning routine with Notion",
    thumbnailUrl: "",
    viewCount: 482000,
    likeCount: 31400,
    commentCount: 980,
    engagementRate: 0.0671,
    metricSource: "api",
    isFeatured: true,
    nicheTag: "Lifestyle",
  },
  {
    id: "c3",
    platform: "tiktok",
    title: "Why I switched to a manual workflow",
    thumbnailUrl: "",
    viewCount: 2840000,
    likeCount: 412000,
    commentCount: 18200,
    engagementRate: 0.1514,
    metricSource: "manual",
    isFeatured: false,
    nicheTag: "Tech",
  },
  {
    id: "c4",
    platform: "youtube",
    title: "30 days with the Bose QC Ultra",
    thumbnailUrl: "",
    viewCount: 612000,
    likeCount: 28200,
    commentCount: 1410,
    engagementRate: 0.0484,
    metricSource: "api",
    isFeatured: false,
    nicheTag: "Tech",
  },
];

export const MOCK_TESTIMONIALS = [
  {
    id: "t1",
    brandName: "Notion",
    brandContactName: "Priya Shah",
    rating: 5,
    text: "Alex delivered the cleanest launch reel of the campaign. Calm, on-brand, and well above benchmarks. Already booked round two.",
    isApproved: true,
    isVerified: true,
  },
  {
    id: "t2",
    brandName: "Glossier",
    brandContactName: "Marcus Lee",
    rating: 5,
    text: "Easiest creator we worked with all quarter. Strong direction, great asset hand-off, and the deliverables shipped a week early.",
    isApproved: true,
    isVerified: true,
  },
  {
    id: "t3",
    brandName: "Bose",
    brandContactName: "Sasha Patel",
    rating: 4,
    text: "Quality of edit and storytelling was a clear step above other partners on our roster.",
    isApproved: true,
    isVerified: true,
  },
];

export const MOCK_INQUIRIES = [
  {
    id: "i1",
    brandName: "Linear",
    contactName: "Jamie Foster",
    email: "jamie@linear.app",
    budget: "$8k–$12k",
    summary: "Q2 founder-led product reel — looking for a 60s narrative spot.",
    status: "new",
    receivedAt: "2026-04-18T14:22:00Z",
  },
  {
    id: "i2",
    brandName: "Vercel",
    contactName: "Lucia Romano",
    email: "lucia@vercel.com",
    budget: "$3k–$5k",
    summary: "Developer experience explainer for Next.js conf, single platform deliverable.",
    status: "replied",
    receivedAt: "2026-04-15T09:01:00Z",
  },
  {
    id: "i3",
    brandName: "Loom",
    contactName: "Devon Wright",
    email: "devon@loom.com",
    budget: "$1k–$3k",
    summary: "UGC ad pack, 4 vertical assets.",
    status: "new",
    receivedAt: "2026-04-19T18:44:00Z",
  },
];

export const MOCK_RATES = [
  { id: "r1", deliverable: "TikTok video", priceLabel: "$3,400", isPrivate: false, notes: "1 round of revisions, 30-day usage" },
  { id: "r2", deliverable: "Instagram Reel", priceLabel: "$2,800", isPrivate: false, notes: "60-day usage, paid amplification +$600" },
  { id: "r3", deliverable: "YouTube integration (60s)", priceLabel: "$6,200", isPrivate: false, notes: "Includes script collab" },
  { id: "r4", deliverable: "Full UGC ad pack (4 assets)", priceLabel: "Hidden", isPrivate: true, notes: "Request via inquiry form" },
];

export const MOCK_ANALYTICS = {
  views7d: 1842,
  views30d: 7320,
  uniqueVisitors30d: 5180,
  topReferrers: [
    { source: "instagram.com", count: 2240 },
    { source: "linktr.ee", count: 980 },
    { source: "direct", count: 1820 },
    { source: "google", count: 412 },
  ],
  topCountries: [
    { code: "US", count: 3120 },
    { code: "GB", count: 880 },
    { code: "CA", count: 612 },
    { code: "AU", count: 342 },
  ],
  recentViews: [
    { city: "Brooklyn", country: "US", at: "12 min ago" },
    { city: "Austin", country: "US", at: "38 min ago" },
    { city: "London", country: "GB", at: "1 hr ago" },
    { city: "Toronto", country: "CA", at: "3 hr ago" },
  ],
};

export const MOCK_INCIDENTS = [
  { id: "1", date: "Apr 18, 2026", title: "Email delivery latency on Resend", status: "resolved", durationMin: 22 },
  { id: "2", date: "Mar 30, 2026", title: "Brief Supabase auth slowness", status: "resolved", durationMin: 9 },
];

export const MOCK_COMPONENTS = [
  { name: "KitPager App", status: "operational" as const },
  { name: "Public Kit Pages", status: "operational" as const },
  { name: "Authentication", status: "operational" as const },
  { name: "Builder and Save Operations", status: "operational" as const },
  { name: "Email Delivery", status: "operational" as const },
  { name: "Billing Webhooks", status: "operational" as const },
  { name: "Analytics Ingestion", status: "operational" as const },
];

export const MOCK_ADMIN_USERS = [
  { id: "u1", email: "alex@kitpager.pro", plan: "creator", status: "active", joinedAt: "Mar 2, 2026" },
  { id: "u2", email: "mira@example.com", plan: "pro", status: "active", joinedAt: "Mar 14, 2026" },
  { id: "u3", email: "jordan@example.com", plan: "free", status: "active", joinedAt: "Apr 1, 2026" },
  { id: "u4", email: "sara@example.com", plan: "creator", status: "suspended", joinedAt: "Feb 22, 2026" },
];

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

export function formatPercent(n: number, decimals = 2): string {
  return (n * 100).toFixed(decimals) + "%";
}
