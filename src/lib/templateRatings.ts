import type { TemplateId } from "@/store/kitPage";

interface RatingEntry {
  rating: number;
  thumbsUp: boolean;
}

const SEED_AGGREGATES: Record<TemplateId, { count: number; sum: number; thumbs: number }> = {
  minimal: { count: 124, sum: 124 * 4.6, thumbs: 89 },
  bold: { count: 87, sum: 87 * 4.4, thumbs: 64 },
  professional: { count: 102, sum: 102 * 4.7, thumbs: 78 },
};

function key(id: TemplateId): string {
  return `kp_template_rating_${id}`;
}

export function getMyRating(id: TemplateId): RatingEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(id));
    if (!raw) return null;
    return JSON.parse(raw) as RatingEntry;
  } catch {
    return null;
  }
}

export function setMyRating(id: TemplateId, entry: RatingEntry): void {
  try {
    window.localStorage.setItem(key(id), JSON.stringify(entry));
  } catch {
    // ignore
  }
}

export function getAggregate(id: TemplateId): { avg: number; count: number; thumbs: number } {
  const seed = SEED_AGGREGATES[id];
  const mine = getMyRating(id);
  if (!mine) {
    return {
      avg: seed.sum / seed.count,
      count: seed.count,
      thumbs: seed.thumbs,
    };
  }
  return {
    avg: (seed.sum + mine.rating) / (seed.count + 1),
    count: seed.count + 1,
    thumbs: seed.thumbs + (mine.thumbsUp ? 1 : 0),
  };
}
