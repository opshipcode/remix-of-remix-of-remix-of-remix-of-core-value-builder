import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemePresetId } from "@/lib/themePresets";
import type { SectionKey } from "@/components/templates/MinimalTemplate";

export type TemplateId = "minimal" | "bold" | "professional";
export type PlatformId = "tiktok" | "instagram" | "youtube";

// ─── Platform ─────────────────────────────────────────────────────────────────
export interface ConnectedPlatform {
  id: string;
  platform: PlatformId;
  handle: string;
  url: string;
  followers: number;
  avgViews: number;
  engagementRate: number;
  visible: boolean;
  selfReported: boolean;
  label: "Main" | "Brand" | "Backup" | "Personal";
  labelChangedAt: string | null;
  updatedAt: string | null;
}

// ─── Content Gallery ──────────────────────────────────────────────────────────
export interface ContentCard {
  id: string;
  platform: PlatformId;
  url: string;
  caption: string;
  featured: boolean;
  views: number;
  likes: number;
  comments?: number;
  engagementRate: number;
  selfReported: boolean;
  niche: string;
  thumbnailUrl: string | null;
  aspectRatio: "landscape" | "portrait" | "square";
  fetchedTitle?: string;
  fetchedAt?: string;
  fetchStatus: "idle" | "fetching" | "success" | "error";
  fetchError?: string;
}

// ─── Brand Collab ─────────────────────────────────────────────────────────────
export interface BrandCollab {
  id: string;
  brandName: string;
  logoUrl: string | null;
  deliverables: string;
  results: string;
  collabVideoUrl?: string;
  collabVideoThumbnail?: string;
  collabVideoViews?: number;
  collabVideoLikes?: number;
  collabVideoComments?: number;
}

// ─── Testimonial ──────────────────────────────────────────────────────────────
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

// ─── Rates ────────────────────────────────────────────────────────────────────
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

// ─── Inquiry ──────────────────────────────────────────────────────────────────
export interface InquirySettings {
  introMessage: string | null;
  showBudgetField: boolean;
}

// ─── SEO ──────────────────────────────────────────────────────────────────────
export interface SeoSettings {
  title: string;
  description: string;
  ogImageUrl: string | null;
}

// ─── Audience ─────────────────────────────────────────────────────────────────
export type AgeRange = "18-24" | "25-34" | "35-44" | "45+";

export interface AudienceSnapshot {
  primaryAge: AgeRange | null;
  genderSplit: { female: number; male: number; other: number };
  topCountries: string[];
  isVerified: boolean;
}

// ─── Section Visibility ───────────────────────────────────────────────────────
export const DEFAULT_SECTION_VISIBILITY: Record<SectionKey, boolean> = {
  platforms: true,
  audience: true,
  about: true,
  gallery: true,
  collabs: true,
  testimonials: true,
  rates: true,
  inquiry: true,
};

// ─── Kit Page Data ────────────────────────────────────────────────────────────
export interface KitPageData {
  slug: string;
  template: TemplateId;
  email: string;
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
  audience: AudienceSnapshot;
  isActive: boolean;
  passwordProtect: boolean;
  passphrase: string;
  countryRestrictions: string[];
  contactEmail: string;
  sectionVisibility: Record<SectionKey, boolean>;
  theme?: ThemePresetId;
}

// ─── Default Data ─────────────────────────────────────────────────────────────
const DEFAULT_DATA: KitPageData = {
  slug: "alexrivera",
  template: "minimal",
  email: "alexrivera@gmail.com",
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
      url: "https://www.tiktok.com/@alexrivera",
      engagementRate: 6.4,
      visible: true,
      selfReported: false,
      label: "Main",
      labelChangedAt: null,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "p_ig_main",
      platform: "instagram",
      handle: "@alex.rivera",
      followers: 412_000,
      avgViews: 58_000,
      engagementRate: 4.1,
      visible: true,
      url: "https://www.instagram.com/@alex.rivera",
      selfReported: false,
      label: "Main",
      labelChangedAt: null,
      updatedAt: new Date().toISOString(),
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
      url: "https://www.youtube.com/@AlexRivera",
      label: "Main",
      labelChangedAt: null,
      updatedAt: new Date().toISOString(),
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
      thumbnailUrl: null,
      aspectRatio: "portrait",
      fetchStatus: "idle",
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
      thumbnailUrl: null,
      aspectRatio: "landscape",
      fetchStatus: "idle",
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
      quote: "Alex delivered above expectations. The engagement was real and the brand story landed perfectly.",
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
        priceUSD: 400_000,
        notes: "Includes 1 round of revisions.",
      },
      {
        id: "r2",
        platform: "instagram",
        deliverable: "Instagram Reel + 1 Story",
        priceUSD: 300_000,
        notes: "Whitelist available.",
      },
    ],
    licensingNotes: "Organic usage only. Paid usage quoted separately.",
    turnaround: "5–7 business days",
  },

  inquirySettings: {
    introMessage: "Tell me about your brand and what you're trying to launch. The more specific the better.",
    showBudgetField: true,
  },

  seo: {
    title: "Alex Rivera — Creator Media Kit",
    description: "Tech and lifestyle creator with verified reach across TikTok, Instagram and YouTube.",
    ogImageUrl: null,
  },

  audience: {
    primaryAge: null,
    genderSplit: { female: 0, male: 0, other: 0 },
    topCountries: [],
    isVerified: false,
  },

  isActive: true,
  passwordProtect: false,
  passphrase: "",
  countryRestrictions: [],
  contactEmail: "alex@kitpager.pro",

  sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY },
};

// ─── Store ────────────────────────────────────────────────────────────────────
interface KitPageStore {
  data: KitPageData;
  isDirty: boolean;
  setData: (patch: Partial<KitPageData>) => void;
  setField: <K extends keyof KitPageData>(key: K, value: KitPageData[K]) => void;
  setTemplate: (template: TemplateId) => void;
  setAudienceSnapshot: (snapshot: Partial<AudienceSnapshot>) => void;
  setInquiryConfig: (config: Partial<InquirySettings>) => void;
  setSectionVisibility: (key: SectionKey, visible: boolean) => void;
  updatePlatform: (id: string, patch: Partial<ConnectedPlatform>) => void;
  markClean: () => void;
  reset: () => void;
}

export const useKitPageStore = create<KitPageStore>()(
  persist(
    (set) => ({
      data: DEFAULT_DATA,
      isDirty: false,

      setData: (patch) =>
        set((s) => ({ data: { ...s.data, ...patch }, isDirty: true })),

      setField: (key, value) =>
        set((s) => ({ data: { ...s.data, [key]: value }, isDirty: true })),

      setTemplate: (template) =>
        set((s) => ({ data: { ...s.data, template }, isDirty: true })),

      setAudienceSnapshot: (snapshot) =>
        set((s) => ({
          data: { ...s.data, audience: { ...s.data.audience, ...snapshot } },
          isDirty: true,
        })),

      setInquiryConfig: (config) =>
        set((s) => ({
          data: {
            ...s.data,
            inquirySettings: { ...s.data.inquirySettings, ...config },
          },
          isDirty: true,
        })),

      setSectionVisibility: (key, visible) =>
        set((s) => ({
          data: {
            ...s.data,
            sectionVisibility: { ...s.data.sectionVisibility, [key]: visible },
          },
          isDirty: true,
        })),

      updatePlatform: (id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            platforms: s.data.platforms.map((p) =>
              p.id === id
                ? { ...p, ...patch, updatedAt: new Date().toISOString() }
                : p
            ),
          },
          isDirty: true,
        })),

      markClean: () => set({ isDirty: false }),

      reset: () => set({ data: DEFAULT_DATA, isDirty: false }),
    }),
    {
      name: "kp_kit_page",
      partialize: (s) => ({ data: s.data }),
    merge: (persisted, current) => {
  const persistedData = (persisted as { data?: KitPageData })?.data;
  if (!persistedData) return current;

  // Migrate old topCountry/secondaryCountry format to topCountries array
  const oldAudience = persistedData.audience as
    | (AudienceSnapshot & { topCountry?: string | null; secondaryCountry?: string | null })
    | undefined;

  let migratedTopCountries: string[] = [];

  // Prefer new format if it exists and has content
  if (persistedData.audience?.topCountries && persistedData.audience.topCountries.length > 0) {
    migratedTopCountries = persistedData.audience.topCountries;
  } else if (oldAudience) {
    // Migrate from old format
    const legacy: string[] = [];
    if (oldAudience.topCountry) legacy.push(oldAudience.topCountry);
    if (oldAudience.secondaryCountry) legacy.push(oldAudience.secondaryCountry);
    migratedTopCountries = legacy;
  }

  return {
    ...current,
    data: {
      ...current.data,
      ...persistedData,
      sectionVisibility: {
        ...DEFAULT_SECTION_VISIBILITY,
        ...(persistedData.sectionVisibility ?? {}),
      },
      audience: {
        primaryAge: null,
        genderSplit: { female: 0, male: 0, other: 0 },
        isVerified: false,
        ...persistedData.audience,
        languages: persistedData.languages ?? [],
        topCountries: migratedTopCountries,
      },
    },
  };
},
    },
  ),
);

// ─── Public page lookup ───────────────────────────────────────────────────────
export function getKitPageBySlug(slug: string | undefined): KitPageData | null {
  if (!slug) return null;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("kp_kit_page");
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