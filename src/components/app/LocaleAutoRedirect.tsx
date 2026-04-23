import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocaleStore } from "@/store/locale";
import { validCountries } from "@/lib/validateCountry";
import { LOCALIZED_ROUTES } from "@/lib/localizedRoutes";

export function LocaleAutoRedirect(): null {
  const location = useLocation();
  const navigate = useNavigate();
  const { detected, routePrefix, forcedUSD } = useLocaleStore();

  useEffect(() => {
    if (!detected || !routePrefix || forcedUSD) return;

    const path = location.pathname;

    // 1. Already localized → do nothing
    if (path.startsWith("/en/")) return;

    // 2. Extract first segment
    const segments = path.split("/").filter(Boolean);
    const firstSegment = segments[0]?.toLowerCase();

    // 3. Country routes (/kr, /us, etc.) → let router handle
    if (firstSegment && validCountries.has(firstSegment)) return;

    // 4. System routes → never localize
    if (
      path.startsWith("/app") ||
      path.startsWith("/admin") ||
      path.startsWith("/review") ||
      path.startsWith("/share")
    ) {
      return;
    }

    // 5. Single segment (likely user slug) → do not touch
    const isSingleSegment = segments.length === 1;
    if (isSingleSegment && path !== "/") return;

    // 6. Only allow exact marketing routes

    const isLocalizedRoute = Array.from(LOCALIZED_ROUTES).some((route) =>
      path === route || path.startsWith(`${route}/`)
    );

    if (!isLocalizedRoute) return;    // 7. Redirect
    const next =
      path === "/"
        ? `/en/${routePrefix}`
        : `/en/${routePrefix}${path}`;

    navigate(next, { replace: true });
  }, [detected, routePrefix, forcedUSD, location.pathname, navigate]);

  return null;
}