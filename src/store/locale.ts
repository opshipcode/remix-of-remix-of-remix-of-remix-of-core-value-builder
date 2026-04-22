import { create } from "zustand";

export interface LocaleState {
  countryCode: string;
  countryName: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  locale: string;
  detected: boolean;
  routePrefix: string;
  forcedUSD: boolean;
  setLocale: (patch: Partial<LocaleState>) => void;
  resetToUSD: () => void;
}

const DEFAULT: LocaleState = {
  countryCode: "US",
  countryName: "United States",
  currencyCode: "USD",
  currencySymbol: "$",
  exchangeRate: 1,
  locale: "en-US",
  detected: false,
  routePrefix: "",
  forcedUSD: false,
  setLocale: () => undefined,
  resetToUSD: () => undefined,
};

export const useLocaleStore = create<LocaleState>((set) => ({
  ...DEFAULT,
  setLocale: (patch) => set((s) => ({ ...s, ...patch })),
  resetToUSD: () =>
    set((s) => ({
      ...s,
      countryCode: "US",
      countryName: "United States",
      currencyCode: "USD",
      currencySymbol: "$",
      exchangeRate: 1,
      locale: "en-US",
      forcedUSD: true,
      routePrefix: "",
    })),
}));

export const SUPPORTED_LOCALES = ["us", "ng", "gb", "ca", "au", "de", "fr", "in", "br", "za"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const MARKETING_PATHS: ReadonlySet<string> = new Set([
  "/", "/pricing", "/features", "/about", "/blog",
  "/templates", "/how-it-works", "/security", "/examples",
  "/resources", "/status", "/contact", "/changelog",
]);
