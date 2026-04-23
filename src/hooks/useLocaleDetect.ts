import { useEffect } from "react";
import { useLocaleStore } from "@/store/locale";

const CACHE_KEY = "kp_locale";
const OVERRIDE_KEY = "kp_locale_override";

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

const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

export function useLocaleDetect(): void {
  const setLocale = useLocaleStore((s) => s.setLocale);

  useEffect(() => {
    let cancelled = false;

    // 0) User override (force USD)
    try {
      if (window.sessionStorage.getItem(OVERRIDE_KEY) === "USD") {
        setLocale({
          countryCode: "US",
          countryName: "United States",
          currencyCode: "USD",
          currencySymbol: "$",
          exchangeRate: 1,
          locale: "en-US",
          routePrefix: "us",
          forcedUSD: true,
          detected: true,
        });
        return;
      }
    } catch {
      console.log("error in user override")
    }

    // 1) Load from cache
    try {
      const raw = window.sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CachedLocale;
        if (Date.now() - parsed.ts < CACHE_TTL_MS) {
          setLocale({ ...parsed, detected: true });
          return;
        }
      }
    } catch {
      console.log("error in cache");
    }

    // 2) Detect live
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
        const ccLower = cc.toLowerCase();

        const currency = (geo.currency ?? "USD").toUpperCase();
        const exchangeRate = rates.rates?.[currency] ?? 1;

        const locale = localeForCountry(cc);
        const symbol = getCurrencySymbol(currency, locale);

        const routePrefix = ccLower;

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

        // Save + update state
        window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
        setLocale({ ...next, detected: true });


      } catch {
        setLocale({ detected: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setLocale]);
}