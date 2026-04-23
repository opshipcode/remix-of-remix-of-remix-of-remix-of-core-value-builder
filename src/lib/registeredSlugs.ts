/**
 * Allowlist of registered creator slugs, persisted in localStorage.
 * Updated on signup/onboarding completion and on every Builder publish.
 * PublicKitPage uses this to decide between rendering the kit and
 * showing the SlugNotFound claim CTA.
 */
const KEY = "kp_registered_slugs";

const DEFAULT_SLUGS = ["alexrivera", "demo"];

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(DEFAULT_SLUGS));
      return DEFAULT_SLUGS;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((s): s is string => typeof s === "string");
    }
    return [];
  } catch {
    return [];
  }
}

function write(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(slugs));
  } catch {
    /* ignore */
  }
}

export function getRegisteredSlugs(): string[] {
  return read();
}

export function isSlugRegistered(slug: string | undefined | null): boolean {
  if (!slug) return false;
  const lower = slug.toLowerCase();
  return read().some((s) => s.toLowerCase() === lower);
}

export function registerSlug(slug: string): void {
  const lower = slug.trim().toLowerCase();
  if (!lower) return;
  const list = read();
  if (list.some((s) => s.toLowerCase() === lower)) return;
  write([...list, lower]);
}
