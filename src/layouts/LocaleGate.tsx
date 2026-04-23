import { Outlet, useParams } from "react-router-dom";
import { SUPPORTED_LOCALES } from "@/store/locale";
import PublicKitPage from "@/pages/public/PublicKitPage";

export function LocaleGate(): JSX.Element {
  const { locale } = useParams<{ locale: string }>();

  if (!locale) return <PublicKitPage />;

  const isLocale = (SUPPORTED_LOCALES as readonly string[])
    .includes(locale.toLowerCase());

  // ✅ valid locale → continue to marketing routes
  if (isLocale) return <Outlet />;

  // ❌ not a locale → treat as slug
  return <PublicKitPage />;
}