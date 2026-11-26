// Google Analytics für PPS Lens – lens v1: noch KEIN eigener Datenstrom angelegt (GA_ID leer).
// Solange GA_ID leer ist, lädt kein Google-Skript und der Cookie-Hinweis erscheint nicht (es gibt nur notwendige Speicher).
// Sobald Eric in Google Analytics einen Datenstrom für die Lens-Adresse anlegt: Mess-ID hier eintragen
// (wie books-app: gtag.js mit config, lädt NUR nach „Akzeptieren“ im Cookie-Hinweis).

export const GA_ID = "";

export const CONSENT_KEY = "ppsl_cookie_consent";
/** "all" = Analytics erlaubt, "essential" = nur notwendige */
export type Consent = "all" | "essential";

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

export function loadAnalytics(): void {
  if (!GA_ID) return;
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (document.getElementById("ppsl-gtag")) return;
  const w = window as unknown as { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID);
  const s = document.createElement("script");
  s.id = "ppsl-gtag";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}
