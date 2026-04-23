import { Outlet, useParams, Navigate } from "react-router-dom";

/**
 * Strict whitelist of supported locales. Any unknown short segment
 * falls through to /:slug rather than being treated as a locale.
 */
const ALLOWED_LOCALES: ReadonlySet<string> = new Set([
  "en", "fr", "de", "es", "pt", "it", "nl", "ja", "ko", "zh",
]);

export function LocaleGate(): JSX.Element {
  const { locale } = useParams<{ locale: string }>();

  if (!locale || !ALLOWED_LOCALES.has(locale.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
