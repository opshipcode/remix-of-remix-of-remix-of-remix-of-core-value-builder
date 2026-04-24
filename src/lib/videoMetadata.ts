// lib/videoMetadata.ts

export type PlatformId = "tiktok" | "instagram" | "youtube";

export interface VideoMetadata {
  title: string;
  thumbnailUrl: string;
  views: number;
  likes: number;
  comments: number;
  engagementRate?: number;
  platform: PlatformId;
}

// ─── URL Parsing ────────────────────────────────────────────────────────────
export function detectPlatform(url: string): PlatformId | null {
  const normalized = url.toLowerCase();
  if (normalized.includes("tiktok.com")) return "tiktok";
  if (normalized.includes("instagram.com") || normalized.includes("instagr.am"))
    return "instagram";
  if (normalized.includes("youtube.com") || normalized.includes("youtu.be"))
    return "youtube";
  return null;
}

// ─── API Calls ──────────────────────────────────────────────────────────────

async function fetchYouTubeMetadata(url: string): Promise<VideoMetadata> {
  // Use YouTube's oEmbed endpoint (no API key needed)
  const videoId = extractYouTubeId(url);
  if (!videoId) throw new Error("Invalid YouTube URL");

  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${videoId}`
  )}&format=json`;

  const response = await fetch(oembedUrl);
  if (!response.ok) throw new Error("Failed to fetch YouTube data");

  const data = await response.json();

  return {
    title: data.title || "Untitled",
    thumbnailUrl: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    views: 0, // oEmbed doesn't provide stats
    likes: 0,
    comments: 0,
    platform: "youtube",
  };
}

async function fetchTikTokMetadata(url: string): Promise<VideoMetadata> {
  // TikTok's oEmbed endpoint
  const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;

  const response = await fetch(oembedUrl);
  if (!response.ok) throw new Error("Failed to fetch TikTok data");

  const data = await response.json();

  return {
    title: data.title || "Untitled",
    thumbnailUrl: data.thumbnail_url || "",
    views: 0,
    likes: 0,
    comments: 0,
    platform: "tiktok",
  };
}

async function fetchInstagramMetadata(url: string): Promise<VideoMetadata> {
  // Instagram's oEmbed endpoint
  const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(
    url
  )}&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN || ""}`;

  // Fallback: if no token, still return basic structure
  if (!process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN) {
    return {
      title: "Instagram Post",
      thumbnailUrl: "",
      views: 0,
      likes: 0,
      comments: 0,
      platform: "instagram",
    };
  }

  const response = await fetch(oembedUrl);
  if (!response.ok) throw new Error("Failed to fetch Instagram data");

  const data = await response.json();

  return {
    title: data.title || "Instagram Post",
    thumbnailUrl: data.thumbnail_url || "",
    views: 0,
    likes: 0,
    comments: 0,
    platform: "instagram",
  };
}

// ─── Main Fetch Function ────────────────────────────────────────────────────
export async function fetchVideoMetadata(url: string): Promise<VideoMetadata> {
  const platform = detectPlatform(url);
  if (!platform) throw new Error("Unsupported platform URL");

  switch (platform) {
    case "youtube":
      return fetchYouTubeMetadata(url);
    case "tiktok":
      return fetchTikTokMetadata(url);
    case "instagram":
      return fetchInstagramMetadata(url);
    default:
      throw new Error("Unsupported platform");
  }
}

// ─── URL Helpers ─────────────────────────────────────────────────────────────
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtube\.com\/embed\/)([^/?]+)/,
    /(?:youtu\.be\/)([^/?]+)/,
    /(?:youtube\.com\/shorts\/)([^/?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// ─── Stats Calculator ────────────────────────────────────────────────────────
export interface GalleryStats {
  totalVideos: number;
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  avgEngagementRate: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export function calculateGalleryStats(
  items: Array<{ views: number; likes: number; comments?: number; engagementRate?: number }>
): GalleryStats {
  const total = items.length;
  if (total === 0) {
    return {
      totalVideos: 0,
      avgViews: 0,
      avgLikes: 0,
      avgComments: 0,
      avgEngagementRate: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
    };
  }

  const totalViews = items.reduce((sum, item) => sum + (item.views || 0), 0);
  const totalLikes = items.reduce((sum, item) => sum + (item.likes || 0), 0);
  const totalComments = items.reduce((sum, item) => sum + (item.comments || 0), 0);

  return {
    totalVideos: total,
    avgViews: Math.round(totalViews / total),
    avgLikes: Math.round(totalLikes / total),
    avgComments: Math.round(totalComments / total),
    avgEngagementRate: items.length > 0
      ? parseFloat(
          (items.reduce((sum, item) => sum + (item.engagementRate || 0), 0) / total).toFixed(1)
        )
      : 0,
    totalViews,
    totalLikes,
    totalComments,
  };
}