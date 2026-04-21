import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TemplateId = "minimal" | "bold" | "professional";
export type PlatformId = "tiktok" | "instagram" | "facebook" | "youtube";

export interface ConnectedPlatform {
  id: string;
  platform: PlatformId;
  handle: string;
  followers: number;
  avgViews: number;
  engagementRate: number;
  visible: boolean;
  selfReported: boolean;
  label: "Main" | "Brand" | "Backup" | "Personal";
  labelChangedAt: string | null;
}

export interface ContentCard {
  id: string;
  platform: PlatformId;
  url: string;
  caption: string;
  featured: boolean;
  views: number;
  likes: number;
  engagementRate: number;
  selfReported: boolean;
  niche: string;
}

export interface BrandCollab {
  id: string;
  brandName: string;
  logoUrl: string | null;
  deliverables: string;
  results: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  reviewerName: string;
  brandName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  verified: boolean;
  visible: boolean;
  status: "approved" | "pending";
  brandLogoUrl: string | null;
}

export interface RateRow {
  id: string;
  platform: PlatformId;
  deliverable: string;
  priceUSD: number;
  notes: string;
}

export interface RateCard {
  isPublic: boolean;
  rows: RateRow[];
  licensingNotes: string;
  turnaround: string;
}

export interface InquirySettings {
  introMessage: string | null;
  showBudgetField: boolean;
}

export interface SeoSettings {
  title: string;
  description: string;
  ogImageUrl: string | null;
}

export interface KitPageData {
  slug: string;
  template: TemplateId;
  displayName: string;
  tagline: string;
  bio: string;
  profileImage: string | null;
  bannerImage: string | null;
  bannerVideo: string | null;
  nicheTags: string[];
  location: string;
  languages: string[];
  creatingSince: number | null;
  collabStyle: string;
  platforms: ConnectedPlatform[];
  contentGallery: ContentCard[];
  brandCollabs: BrandCollab[];
  testimonials: Testimonial[];
  rates: RateCard;
  inquirySettings: InquirySettings;
  seo: SeoSettings;
  isActive: boolean;
  passwordProtect: boolean;
  passphrase: string;
  countryRestrictions: string[];
  contactEmail: string;
}

const DEFAULT_DATA: KitPageData = {
  slug: "alexrivera",
  template: "minimal",
  displayName: "Alex Rivera",
  tagline: "Honest reviews. Real engagement. Built for brand stories.",
  bio: "I'm Alex — I make tech and lifestyle content that brands trust. Three years of consistent uploads, real engagement, and partnerships with DTC teams who care about authentic storytelling.",
  profileImage: null,
  bannerImage: null,
  bannerVideo: null,
  nicheTags: ["Tech", "Lifestyle", "Reviews"],
  location: "Lagos, Nigeria",
  languages: ["English", "Yoruba"],
  creatingSince: 2022,
  collabStyle: "I specialize in honest, story-led product reviews for DTC brands.",
  platforms: [
    {
      id: "p_tt_main",
      platform: "tiktok",
      handle: "@alexrivera",
      followers: 1_800_000,
      avgViews: 240_000,
      engagementRate: 6.4,
      visible: true,
      selfReported: false,
      label: "Main",
      labelChangedAt: null,
    },
    {
      id: "p_ig_main",
      platform: "instagram",
      handle: "@alex.rivera",
      followers: 412_000,
      avgViews: 58_000,
      engagementRate: 4.1,
      visible: true,
      selfReported: false,
      label: "Main",
      labelChangedAt: null,
    },
    {
      id: "p_yt_main",
      platform: "youtube",
      handle: "@AlexRivera",
      followers: 96_400,
      avgViews: 22_000,
      engagementRate: 5.2,
      visible: true,
      selfReported: false,
      label: "Main",
      labelChangedAt: null,
    },
  ],
  contentGallery: [
    {
      id: "c1",
      platform: "tiktok",
      url: "https://www.tiktok.com/@alexrivera/video/1",
      caption: "iPhone 17 Pro vs Pixel 9 — honest take.",
      featured: true,
      views: 1_240_000,
      likes: 142_000,
      engagementRate: 11.4,
      selfReported: false,
      niche: "Tech",
    },
    {
      id: "c2",
      platform: "instagram",
      url: "https://instagram.com/p/2",
      caption: "Skincare routine that actually works.",
      featured: false,
      views: 312_000,
      likes: 38_000,
      engagementRate: 12.2,
      selfReported: false,
      niche: "Lifestyle",
    },
  ],
  brandCollabs: [
    {
      id: "b1",
      brandName: "Glossier",
      logoUrl: null,
      deliverables: "2 IG Reels, 1 TikTok",
      results: "1.4M reach, 84K saves",
    },
    {
      id: "b2",
      brandName: "Notion",
      logoUrl: null,
      deliverables: "YouTube long-form, IG carousel",
      results: "320K views, 6.1% CTR",
    },
  ],
  testimonials: [
    {
      id: "t1",
      quote:
        "Alex delivered above expectations. The engagement was real and the brand story landed perfectly.",
      reviewerName: "Maya Chen",
      brandName: "Glossier",
      rating: 5,
      verified: true,
      visible: true,
      status: "approved",
      brandLogoUrl: null,
    },
    {
      id: "t2",
      quote: "One of the cleanest creator collabs we've run this year.",
      reviewerName: "Jordan P.",
      brandName: "Notion",
      rating: 5,
      verified: true,
      visible: true,
      status: "approved",
      brandLogoUrl: null,
    },
  ],
  rates: {
    isPublic: true,
    rows: [
      {
        id: "r1",
        platform: "tiktok",
        deliverable: "TikTok 60s",
        priceUSD: 2400,
        notes: "Includes 1 round of revisions.",
      },
      {
        id: "r2",
        platform: "instagram",
        deliverable: "Instagram Reel + 1 Story",
        priceUSD: 1800,
        notes: "Whitelist available.",
      },
    ],
    licensingNotes: "Organic usage only. Paid usage quoted separately.",
    turnaround: "5–7 business days",
  },
  inquirySettings: {
    introMessage:
      "Tell me about your brand and what you're trying to launch. The more specific the better.",
    showBudgetField: true,
  },
  seo: {
    title: "Alex Rivera — Creator Media Kit",
    description:
      "Tech and lifestyle creator with verified reach across TikTok, Instagram and YouTube.",
    ogImageUrl: null,
  },
  isActive: true,
  passwordProtect: false,
  passphrase: "",
  countryRestrictions: [],
  contactEmail: "alex@kitpager.pro",
};

interface KitPageStore {
  data: KitPageData;
  setData: (patch: Partial<KitPageData>) => void;
  setTemplate: (template: TemplateId) => void;
  reset: () => void;
}

export const useKitPageStore = create<KitPageStore>()(
  persist(
    (set) => ({
      data: DEFAULT_DATA,
      setData: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
      setTemplate: (template) =>
        set((s) => ({ data: { ...s.data, template } })),
      reset: () => set({ data: DEFAULT_DATA }),
    }),
    { name: "kp_page_data" },
  ),
);

export function getKitPageBySlug(slug: string | undefined): KitPageData | null {
  if (!slug) return null;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("kp_page_data");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { data?: KitPageData } };
    const data = parsed.state?.data;
    if (!data) return null;
    if (data.slug.toLowerCase() === slug.toLowerCase()) return data;
    return null;
  } catch {
    return null;
  }
}
