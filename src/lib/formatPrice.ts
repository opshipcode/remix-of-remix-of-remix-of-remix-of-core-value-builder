import type { LocaleState } from "@/store/locale";
import { useLocaleStore } from "@/store/locale";

export function formatPrice(usdPrice: number, locale: LocaleState): string {
  const local = usdPrice * locale.exchangeRate;
  const rounded =
    local < 100
      ? Math.round(local * 100) / 100
      : local < 10000
        ? Math.round(local / 10) * 10
        : Math.round(local / 100) * 100;
  return new Intl.NumberFormat(locale.locale, {
    style: "currency",
    currency: locale.currencyCode,
    maximumFractionDigits: local > 999 ? 0 : 2,
  }).format(rounded);
}

/** Convenience hook — re-renders when locale changes. */
export function useFormatPrice(): (usdPrice: number) => string {
  const locale = useLocaleStore();
  return (usdPrice: number) => formatPrice(usdPrice, locale);
}
