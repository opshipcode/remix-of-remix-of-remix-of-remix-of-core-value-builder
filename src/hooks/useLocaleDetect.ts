import { useEffect } from "react";
import { useLocaleStore, LocaleState } from "@/store/locale";

const CACHE_KEY = "kp_locale";
const OVERRIDE_KEY = "kp_locale_override";

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

const CACHE_TTL_MS = 1000 * 60 * 60 * 6;

function localeForCountry(cc: string): string {
  try {
    return new Intl.Locale(`en-${cc}`).toString();
  } catch {
    return "en-US";
  }
}

function getCurrencySymbol(currency: string, locale: string): string {
  try {
    return (
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
      })
        .formatToParts(1)
        .find((p) => p.type === "currency")?.value ?? currency
    );
  } catch {
    return currency;
  }
}

export function useLocaleDetect(): void {
  const setLocale = useLocaleStore((s: LocaleState) => s.setLocale);

  useEffect(() => {
    let cancelled = false;

    const finalize = (data: Partial<LocaleState>) => {
      setLocale({
        ...data,
        hydrated: true,
        detected: true,
      });
    };

    // 0) Override
    try {
      if (window.sessionStorage.getItem(OVERRIDE_KEY) === "USD") {
        finalize({
          countryCode: "US",
          countryName: "United States",
          currencyCode: "USD",
          currencySymbol: "$",
          exchangeRate: 1,
          locale: "en-US",
          routePrefix: "us",
          forcedUSD: true,
        });
        return;
      }
    } catch {
      // ignore storage errors
    }

    // 1) Cache
    try {
      const raw = window.sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed: CachedLocale = JSON.parse(raw);

        if (Date.now() - parsed.ts < CACHE_TTL_MS) {
          finalize(parsed);
          return;
        }
      }
    } catch {
      // ignore cache errors
    }

    // 2) Live detection
    (async (): Promise<void> => {
      try {
        const [geoRes, rateRes] = await Promise.all([
          fetch("https://ipapi.co/json/"),
          fetch("https://open.er-api.com/v6/latest/USD"),
        ]);

        const geo: IpapiResponse = await geoRes.json();
        const rates: RatesResponse = await rateRes.json();

        if (cancelled) return;

        const cc: string = (geo.country_code ?? "US").toUpperCase();
        const currency: string = (geo.currency ?? "USD").toUpperCase();

        const locale: string = localeForCountry(cc);
        const exchangeRate: number = rates.rates?.[currency] ?? 1;
        const symbol: string = getCurrencySymbol(currency, locale);

        const result: CachedLocale = {
          countryCode: cc,
          countryName: geo.country_name ?? "United States",
          currencyCode: currency,
          currencySymbol: symbol,
          exchangeRate,
          locale,
          routePrefix: cc.toLowerCase(),
          forcedUSD: false,
          ts: Date.now(),
        };

        window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(result));

        finalize(result);
      } catch {
        setLocale({
          detected: true,
          hydrated: true,
        });
      }
    })();

    return (): void => {
      cancelled = true;
    };
  }, [setLocale]);
}