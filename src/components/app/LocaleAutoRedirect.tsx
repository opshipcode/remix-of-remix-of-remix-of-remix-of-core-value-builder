import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocaleStore, MARKETING_PATHS, SUPPORTED_LOCALES } from "@/store/locale";

/** Redirects the user to the locale-prefixed marketing route once detection resolves. */
export function LocaleAutoRedirect(): null {
  const location = useLocation();
  const navigate = useNavigate();
  const { detected, routePrefix, forcedUSD } = useLocaleStore();

  useEffect(() => {
    if (!detected || !routePrefix || forcedUSD) return;
    if (!MARKETING_PATHS.has(location.pathname)) return;

    const alreadyPrefixed = (SUPPORTED_LOCALES as readonly string[]).some(
      (l) =>
        location.pathname.startsWith(`/${l}/`) ||
        location.pathname === `/${l}`,
    );
    if (alreadyPrefixed) return;

    const next =
      location.pathname === "/"
        ? `/${routePrefix}`
        : `/${routePrefix}${location.pathname}`;
    navigate(next, { replace: true });
  }, [detected, routePrefix, forcedUSD, location.pathname, navigate]);

  return null;
}