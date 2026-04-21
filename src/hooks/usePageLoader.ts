import { useEffect, useState } from "react";

/**
 * Simulate a page load. Returns { loading } that flips false after `ms`.
 * Use in every page so skeletons + fade-in feel consistent.
 */
export function usePageLoader(ms = 1200): { loading: boolean } {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return { loading };
}
