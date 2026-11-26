import { useEffect, useState } from "react";

import { CONSENT_KEY, GA_ID, loadAnalytics, readConsent, type Consent } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";

// Cookie-Hinweis wie im KI-Coach (app_v26): „Nur notwendige“ / „Akzeptieren“. Analytics nur nach „Akzeptieren“.
// „Mehr erfahren“ → Datenschutzerklärung auf prophotoskills.com.
// v11 (Eric 26.11.: „Cookie wäre wichtig, weil Analytics ist ja eine Frage der Zeit“): Hinweis kommt IMMER beim
// ersten Besuch. Analytics lädt trotzdem nur, wenn GA_ID gesetzt ist UND „Akzeptieren“ gewählt wurde.
// Fußzeile „Cookie-Einstellungen“ öffnet ihn wieder (Ereignis „ppsl-cookies“).
export function cookieEinstellungenOeffnen() {
  window.dispatchEvent(new Event("ppsl-cookies"));
}
export function CookieBanner() {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const consent = readConsent();
    if (consent === "all" && GA_ID) loadAnalytics();
    if (!consent) setOpen(true);
    const auf = () => setOpen(true);
    window.addEventListener("ppsl-cookies", auf);
    return () => window.removeEventListener("ppsl-cookies", auf);
  }, []);

  if (!open) return null;

  const decide = (v: Consent) => {
    try {
      localStorage.setItem(CONSENT_KEY, v);
    } catch {
      // ohne localStorage: Hinweis erscheint beim nächsten Besuch wieder
    }
    if (v === "all") loadAnalytics();
    setOpen(false);
  };

  void lang;
  const datenschutz = "/datenschutz"; // v11: eigene Lens-Datenschutzseite (bleibt in der App)

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-stone-300 bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:p-5">
        <p className="flex-1 text-sm text-stone-800">
          {t("cookie.text")}{" "}
          <a href={datenschutz} className="underline">
            {t("cookie.more")}
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => decide("essential")}
            className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100"
          >
            {t("cookie.essential")}
          </button>
          <button
            onClick={() => decide("all")}
            className="rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-stone-50 hover:bg-stone-800"
          >
            {t("cookie.ok")}
          </button>
        </div>
      </div>
    </div>
  );
}
