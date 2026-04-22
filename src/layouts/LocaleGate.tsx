import { Outlet, useParams } from "react-router-dom";
import { SUPPORTED_LOCALES } from "@/store/locale";
import PublicKitPage from "@/pages/public/PublicKitPage";

/**
 * For routes mounted at "/:locale". If the param is a supported locale,
 * render the marketing layout (via <Outlet/>). Otherwise treat the segment
 * as a creator slug and render the public kit page directly. This avoids
 * a redirect so /:slug never flickers through marketing.
 */
export function LocaleGate(): JSX.Element {
  const { locale } = useParams<{ locale: string }>();
  const isLocale =
    !!locale && (SUPPORTED_LOCALES as readonly string[]).includes(locale.toLowerCase());
  if (isLocale) return <Outlet />;
  return <PublicKitPage />;
}