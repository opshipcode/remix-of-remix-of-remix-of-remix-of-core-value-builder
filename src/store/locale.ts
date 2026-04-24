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

  // NEW: ensures router doesn't run early
  hydrated: boolean;

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

  hydrated: false,

  setLocale: () => undefined,
  resetToUSD: () => undefined,
};

export const useLocaleStore = create<LocaleState>((set) => ({
  ...DEFAULT,

  setLocale: (patch: Partial<LocaleState>) =>
    set((s: LocaleState): LocaleState => ({ ...s, ...patch })),

  resetToUSD: () =>
    set((s: LocaleState): LocaleState => ({
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