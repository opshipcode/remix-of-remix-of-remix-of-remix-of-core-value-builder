import { useState, useCallback } from "react";
import { Plus, Loader2, AlertCircle, ExternalLink, Eye, EyeOff, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { ContentCard, PlatformId } from "@/store/kitPage";
import { toast } from "@/hooks/use-toast";
import { calculateGalleryStats, detectPlatform, fetchVideoMetadata } from "@/lib/videoMetadata";

interface GalleryEditorProps {
  items: ContentCard[];
  maxItems?: number;
  onChange: (items: ContentCard[]) => void;
}

export function GalleryEditor({ items, maxItems = 6, onChange }: GalleryEditorProps) {
  const [urlInput, setUrlInput] = useState("");
  const [fetching, setFetching] = useState(false);

  const stats = calculateGalleryStats(items.filter(i => i.fetchStatus === "success"));

  const handleAddUrl = useCallback(async () => {
    const url = urlInput.trim();
    if (!url) return;

    const platform = detectPlatform(url);
    if (!platform) {
      toast({ title: "Invalid URL", description: "Please paste a TikTok, Instagram, or YouTube URL.", variant: "destructive" });
      return;
    }

    if (items.length >= maxItems) {
      toast({ title: "Limit reached", description: `You can only add up to ${maxItems} videos.`, variant: "destructive" });
      return;
    }

    // Check for duplicate
    if (items.some(i => i.url === url)) {
      toast({ title: "Duplicate", description: "This video is already in your gallery.", variant: "destructive" });
      return;
    }

    // Create placeholder card immediately
    const tempId = `temp_${Date.now()}`;
    const placeholder: ContentCard = {
      id: tempId,
      platform,
      url,
      caption: "",
      featured: items.length === 0,
      views: 0,
      likes: 0,
      comments: 0,
      engagementRate: 0,
      selfReported: false,
      niche: "",
      thumbnailUrl: null,
      aspectRatio: platform === "youtube" ? "landscape" : "portrait",
      fetchStatus: "fetching",
    };

    const newItems = [...items, placeholder];
    onChange(newItems);
    setUrlInput("");
    setFetching(true);

    try {
      const metadata = await fetchVideoMetadata(url);
      
      // Update the placeholder with fetched data
      const updatedItems = newItems.map(item =>
        item.id === tempId
          ? {
              ...item,
              id: `${platform}_${Date.now()}`, // Replace temp ID
              views: metadata.views || item.views,
              likes: metadata.likes || item.likes,
              comments: metadata.comments || item.comments,
              engagementRate: metadata.engagementRate ?? calculateEngagementRate(metadata.views, metadata.likes, metadata.comments),
              thumbnailUrl: metadata.thumbnailUrl || item.thumbnailUrl,
              fetchedTitle: metadata.title,
              fetchedAt: new Date().toISOString(),
              fetchStatus: "success" as const,
              caption: metadata.title || item.caption,
            }
          : item
      );

      onChange(updatedItems);
      toast({ title: "Added!", description: metadata.title || "Video added to gallery." });
    } catch (error) {
      // Mark as error but keep the card
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch";
      const updatedItems = newItems.map(item =>
        item.id === tempId
          ? { ...item, fetchStatus: "error" as const, fetchError: errorMessage }
          : item
      );
      onChange(updatedItems);
      toast({ title: "Couldn't fetch", description: errorMessage, variant: "destructive" });
    } finally {
      setFetching(false);
    }
  }, [urlInput, items, maxItems, onChange]);

  const handleRemove = (id: string) => {
    onChange(items.filter(i => i.id !== id));
  };

  const handleToggleFeatured = (id: string) => {
    onChange(
      items.map(i =>
        i.id === id
          ? { ...i, featured: !i.featured }
          : { ...i, featured: false } // Only one featured at a time
      )
    );
  };

  const handleCaptionChange = (id: string, caption: string) => {
    onChange(items.map(i => (i.id === id ? { ...i, caption } : i)));
  };

  return (
    <div className="space-y-5">
      {/* ─── Stats Row ─────────────────────────────────────────────────── */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <StatCard label="Videos" value={stats.totalVideos.toString()} />
          <StatCard label="Avg Views" value={formatNumber(stats.avgViews)} />
          <StatCard label="Avg Likes" value={formatNumber(stats.avgLikes)} />
          <StatCard label="Avg Comments" value={formatNumber(stats.avgComments)} />
          <StatCard label="Total Views" value={formatNumber(stats.totalViews)} />
          <StatCard label="Total Likes" value={formatNumber(stats.totalLikes)} />
          <StatCard label="Total Comments" value={formatNumber(stats.totalComments)} />
          <StatCard label="Avg Engagement" value={`${stats.avgEngagementRate}%`} />
        </div>
      )}

      {/* ─── URL Input ─────────────────────────────────────────────────── */}
      {items.length < maxItems && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Add Video URL
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
              placeholder="Paste TikTok, Instagram, or YouTube URL…"
              className="flex-1 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none"
              disabled={fetching}
            />
            <button
              onClick={handleAddUrl}
              disabled={!urlInput.trim() || fetching}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50 transition-opacity"
            >
              {fetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {items.length}/{maxItems} videos · We'll fetch the thumbnail and metadata automatically.
          </p>
        </div>
      )}

      {/* ─── Video Cards ───────────────────────────────────────────────── */}
      {items.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Gallery Items
          </p>
          <div className="space-y-2">
            {items.map((item) => (
              <VideoCard
                key={item.id}
                item={item}
                onRemove={() => handleRemove(item.id)}
                onToggleFeatured={() => handleToggleFeatured(item.id)}
                onCaptionChange={(caption) => handleCaptionChange(item.id, caption)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-2.5 text-center">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function VideoCard({
  item,
  onRemove,
  onToggleFeatured,
  onCaptionChange,
}: {
  item: ContentCard;
  onRemove: () => void;
  onToggleFeatured: () => void;
  onCaptionChange: (caption: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.caption || item.fetchedTitle || ""}
            className="h-16 w-24 rounded-lg object-cover bg-surface"
          />
        ) : (
          <div className="h-16 w-24 rounded-lg bg-surface flex items-center justify-center">
            {item.fetchStatus === "fetching" ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : item.fetchStatus === "error" ? (
              <AlertCircle className="h-5 w-5 text-red-400" />
            ) : (
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {item.fetchedTitle || item.caption || "Untitled"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {item.platform} · {formatNumber(item.views)} views · {formatNumber(item.likes)} likes
                {item.comments != null && ` · ${formatNumber(item.comments)} comments`}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onToggleFeatured}
                className={`grid h-6 w-6 place-items-center rounded-lg transition-colors ${
                  item.featured
                    ? "bg-amber-500/20 text-amber-600"
                    : "text-muted-foreground hover:bg-surface"
                }`}
                title={item.featured ? "Featured" : "Set as featured"}
              >
                <Star className="h-3.5 w-3.5" fill={item.featured ? "currentColor" : "none"} />
              </button>
              <button
                onClick={onRemove}
                className="grid h-6 w-6 place-items-center rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
                title="Remove"
              >
                ×
              </button>
            </div>
          </div>

          {/* Caption input */}
          <input
            type="text"
            value={item.caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            placeholder="Add a custom caption…"
            className="mt-1.5 w-full text-xs bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none pb-0.5 transition-colors"
          />

          {/* Fetch status indicator */}
          {item.fetchStatus === "fetching" && (
            <p className="mt-1 text-[10px] text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Fetching metadata…
            </p>
          )}
          {item.fetchStatus === "error" && (
            <p className="mt-1 text-[10px] text-red-500">{item.fetchError}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function calculateEngagementRate(views: number, likes: number, comments: number = 0): number {
  if (views <= 0) return 0;
  return parseFloat((((likes + comments) / views) * 100).toFixed(1));
}