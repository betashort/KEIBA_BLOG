import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? "").trim();
const SCRIPT_ID = "ga4-gtag";

function installGtag(measurementId: string): void {
  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // gtag.js は Arguments オブジェクトを dataLayer に積む前提
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }

  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });
}

function sendPageView(measurementId: string, pagePath: string): void {
  if (typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", "page_view", {
    send_to: measurementId,
    page_path: pagePath,
    page_title: document.title,
    page_location: window.location.href,
  });
}

/**
 * GA4 計測。プリレンダーでは何もせず、マウント後に gtag を読み SPA 遷移を page_view する。
 * 測定ID未設定時は無効。Storybook からは App を経由しないため送出しない。
 */
export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (!MEASUREMENT_ID) {
      return;
    }
    installGtag(MEASUREMENT_ID);
    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    const timer = window.setTimeout(() => {
      sendPageView(MEASUREMENT_ID, pagePath);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search, location.hash]);

  return null;
}
