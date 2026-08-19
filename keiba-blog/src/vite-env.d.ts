/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_ORIGIN?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
}
