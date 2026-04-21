/**
 * Slug validation. Used in onboarding step 1 and Settings → Page.
 * Slugs become public URLs at /:slug, so they must not collide with locale
 * prefixes or any platform route segment.
 */

export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  // locale codes
  "us", "ng", "gb", "ca", "au", "de", "fr", "in", "br", "za",
  // marketing routes
  "pricing", "templates", "features", "about", "changelog", "contact",
  "how-it-works", "security", "examples", "resources", "status", "legal",
  // app namespaces
  "app", "admin", "api", "auth", "login", "signup", "forgot-password",
  "reset-password", "onboarding", "review", "share", "preview",
  // common platform conflicts / future-proof
  "www", "mail", "blog", "docs", "support", "help", "settings",
  "explore", "discover", "trending", "search", "tos", "privacy",
]);

export type SlugValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

const SLUG_RE = /^[a-z0-9_-]+$/i;

export function validateSlugSync(raw: string): SlugValidationResult {
  const value = raw.trim().toLowerCase();
  if (value.length < 3) return { ok: false, reason: "Min 3 characters" };
  if (value.length > 30) return { ok: false, reason: "Max 30 characters" };
  if (!SLUG_RE.test(value))
    return { ok: false, reason: "Letters, numbers, hyphens, underscores only" };
  if (RESERVED_SLUGS.has(value))
    return { ok: false, reason: "This name is reserved" };
  return { ok: true };
}

/** Mock availability check — 400ms delay, ~10% taken */
export function checkSlugAvailability(slug: string): Promise<boolean> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const taken = ["alex", "demo", "admin", "test", "creator"].includes(
        slug.toLowerCase(),
      );
      resolve(!taken);
    }, 400);
  });
}