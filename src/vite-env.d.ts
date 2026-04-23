/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FLUTTERWAVE_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    FlutterwaveCheckout?: (config: object) => void;
  }
}

export {};
