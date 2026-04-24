import { useState, useCallback } from "react";
import { Plus, Loader2, AlertCircle, ExternalLink, Trash2, Upload, Eye, Heart, MessageCircle } from "lucide-react";
import type { BrandCollab } from "@/store/kitPage";
import { fetchVideoMetadata, detectPlatform } from "@/lib/videoMetadata";
import { toast } from "@/hooks/use-toast";

interface CollabsEditorProps {
  items: BrandCollab[];
  maxItems?: number;
  onChange: (items: BrandCollab[]) => void;
}

export function CollabsEditor({ items, maxItems = 10, onChange }: CollabsEditorProps) {
  const [fetchingId, setFetchingId] = useState<string | null>(null);

  const handleAdd = () => {
    if (items.length >= maxItems) {
      toast({ title: "Limit reached", description: `Max ${maxItems} collabs.`, variant: "destructive" });
      return;
    }
    const newCollab: BrandCollab = {
      id: `collab_${Date.now()}`,
      brandName: "",
      logoUrl: null,
      deliverables: "",
      results: "",
    };
    onChange([...items, newCollab]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((i) => i.id !== id));
  };

  const handleUpdate = (id: string, patch: Partial<BrandCollab>) => {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const handleFetchVideo = useCallback(
    async (id: string, url: string) => {
      const platform = detectPlatform(url);
      if (!platform) {
        toast({ title: "Invalid URL", description: "Paste a TikTok, Instagram, or YouTube URL.", variant: "destructive" });
        return;
      }

      setFetchingId(id);
      try {
        const metadata = await fetchVideoMetadata(url);
        handleUpdate(id, {
          collabVideoUrl: url,
          collabVideoThumbnail: metadata.thumbnailUrl,
          collabVideoViews: metadata.views,
          collabVideoLikes: metadata.likes,
          collabVideoComments: metadata.comments,
        });
        toast({ title: "Fetched!", description: metadata.title || "Video metadata loaded." });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to fetch";
        toast({ title: "Couldn't fetch", description: msg, variant: "destructive" });
      } finally {
        setFetchingId(null);
      }
    },
    [handleUpdate]
  );

  return (
    <div className="space-y-4">
      {items.map((collab) => (
        <div key={collab.id} className="rounded-xl border border-border bg-surface-2 p-3 space-y-3">
          {/* Brand Name + Logo */}
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Brand name
              </label>
              <input
                type="text"
                value={collab.brandName}
                onChange={(e) => handleUpdate(collab.id, { brandName: e.target.value })}
                placeholder="e.g. Glossier"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Logo URL
              </label>
              <input
                type="url"
                value={collab.logoUrl ?? ""}
                onChange={(e) => handleUpdate(collab.id, { logoUrl: e.target.value || null })}
                placeholder="Optional"
                className="w-40 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Deliverables + Results */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Deliverables
              </label>
              <input
                type="text"
                value={collab.deliverables}
                onChange={(e) => handleUpdate(collab.id, { deliverables: e.target.value })}
                placeholder="e.g. 2 IG Reels"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Results
              </label>
              <input
                type="text"
                value={collab.results}
                onChange={(e) => handleUpdate(collab.id, { results: e.target.value })}
                placeholder="e.g. 1.4M reach"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Video URL + Fetch */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Collab video URL (optional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={collab.collabVideoUrl ?? ""}
                onChange={(e) => handleUpdate(collab.id, { collabVideoUrl: e.target.value })}
                placeholder="Paste TikTok/IG/YouTube URL…"
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={() => {
                  const url = collab.collabVideoUrl;
                  if (url) handleFetchVideo(collab.id, url);
                }}
                disabled={!collab.collabVideoUrl || fetchingId === collab.id}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
              >
                {fetchingId === collab.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ExternalLink className="h-3.5 w-3.5" />
                )}
                Fetch
              </button>
            </div>
          </div>

          {/* Fetched video preview */}
          {collab.collabVideoThumbnail && (
            <div className="relative rounded-lg overflow-hidden aspect-video bg-black/5">
              <img
                src={collab.collabVideoThumbnail}
                alt={collab.brandName}
                className="w-full h-full object-cover"
              />
              {collab.collabVideoViews != null && (
                <div className="absolute bottom-2 left-2 flex gap-3 text-[10px] text-white bg-black/60 backdrop-blur rounded-full px-3 py-1">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {fmt(collab.collabVideoViews)}
                  </span>
                  {collab.collabVideoLikes != null && (
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-3 w-3" /> {fmt(collab.collabVideoLikes)}
                    </span>
                  )}
                  {collab.collabVideoComments != null && (
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" /> {fmt(collab.collabVideoComments)}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Remove button */}
          <button
            onClick={() => handleRemove(collab.id)}
            className="flex items-center gap-1 text-[10px] text-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-3 w-3" /> Remove
          </button>
        </div>
      ))}

      {/* Add button */}
      {items.length < maxItems && (
        <button
          onClick={handleAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-3 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
        >
          <Plus className="h-4 w-4" /> Add brand collaboration
        </button>
      )}

      <p className="text-[10px] text-muted-foreground text-center">
        {items.length}/{maxItems} collabs
      </p>
    </div>
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}