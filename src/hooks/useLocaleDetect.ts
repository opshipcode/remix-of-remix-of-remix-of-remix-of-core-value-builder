import { useEffect } from "react";
import { useLocaleStore, SUPPORTED_LOCALES, type SupportedLocale } from "@/store/locale";

const CACHE_KEY = "kp_locale";
const OVERRIDE_KEY = "kp_locale_override";

/**
 * Currency symbol map for currencies we render in the UI.
 * Intl.NumberFormat will produce the formatted string — the symbol is
 * only used for compact display where we want raw character access.
 */
const SYMBOL_MAP: Record<string, string> = {
  USD: "$", NGN: "₦", GBP: "£", EUR: "€", CAD: "C$", AUD: "A$",
  INR: "₹", BRL: "R$", ZAR: "R", JPY: "¥", KRW: "₩", MXN: "Mex$",
};

  function localeForCountry(cc: string): string {
    try {
      return new Intl.Locale(`en-${cc}`).toString();
    } catch {
      return "en-US";
    }
  }
  function getCurrencySymbol(currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(1)
      .find((p) => p.type === "currency")?.value ?? currency;
  } catch {
    return currency;
  }
}

interface CachedLocale {
  countryCode: string;
  countryName: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  locale: string;
  routePrefix: string;
  forcedUSD: boolean;
  ts: number;
}

interface IpapiResponse {
  country_code?: string;
  country_name?: string;
  currency?: string;
}

interface RatesResponse {
  rates?: Record<string, number>;
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6h

export function useLocaleDetect(): void {
  const setLocale = useLocaleStore((s) => s.setLocale);

  useEffect(() => {
    let cancelled = false;

    // 0) explicit user override → force USD, never re-detect this session
    try {
      if (window.sessionStorage.getItem(OVERRIDE_KEY) === "USD") {
        setLocale({
          countryCode: "US",
          countryName: "United States",
          currencyCode: "USD",
          currencySymbol: "$",
          exchangeRate: 1,
          locale: "en-US",
          routePrefix: "",
          forcedUSD: true,
          detected: true,
        });
        return;
      }
    } catch {
      /* ignore */
    }

    // 1) hydrate from sessionStorage if fresh
    try {
      const raw = window.sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CachedLocale;
        if (Date.now() - parsed.ts < CACHE_TTL_MS) {
          setLocale({
            countryCode: parsed.countryCode,
            countryName: parsed.countryName,
            currencyCode: parsed.currencyCode,
            currencySymbol: parsed.currencySymbol,
            exchangeRate: parsed.exchangeRate,
            locale: parsed.locale,
            routePrefix: parsed.routePrefix,
            forcedUSD: parsed.forcedUSD,
            detected: true,
          });
          return;
        }
      }
    } catch {
      /* ignore */
    }

    // 2) live detect — non-blocking
    (async () => {
      try {
        const [geoRes, rateRes] = await Promise.all([
          fetch("https://ipapi.co/json/"),
          fetch("https://open.er-api.com/v6/latest/USD"),
        ]);
        const geo = (await geoRes.json()) as IpapiResponse;
        const rates = (await rateRes.json()) as RatesResponse;
        if (cancelled) return;

        const cc = (geo.country_code ?? "US").toUpperCase();
        const ccLower = cc.toLowerCase() as SupportedLocale;
        const currency = (geo.currency ?? "USD").toUpperCase();
        const exchangeRate = rates.rates?.[currency] ?? 1;
        const locale = localeForCountry(cc);
        const symbol = getCurrencySymbol(currency, locale);
        const routePrefix = (SUPPORTED_LOCALES as readonly string[]).includes(ccLower)
          ? ccLower
          : "";

        const next: CachedLocale = {
          countryCode: cc,
          countryName: geo.country_name ?? "United States",
          currencyCode: currency,
          currencySymbol: symbol,
          exchangeRate,
          locale,
          routePrefix,
          forcedUSD: false,
          ts: Date.now(),
        };
        window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
        setLocale({ ...next, detected: true });
      } catch {
        // graceful: stay on USD default
        setLocale({ detected: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setLocale]);
}