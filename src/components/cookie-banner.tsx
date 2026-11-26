import { useEffect, useState } from "react";

import { CONSENT_KEY, GA_ID, loadAnalytics, readConsent, type Consent } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";

// Cookie-Hinweis wie im KI-Coach (app_v26): „Nur notwendige“ / „Akzeptieren“. Analytics nur nach „Akzeptieren“.
// „Mehr erfahren“ → Datenschutzerklärung auf prophotoskills.com.
// lens v1: ohne GA_ID gibt es nichts zuzustimmen → Hinweis bleibt aus.
export function CookieBanner() {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !GA_ID) return;
    const consent = readConsent();
    if (consent === "all") loadAnalytics();
    if (!consent) setOpen(true);
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

  const datenschutz = lang === "de" ? "https://prophotoskills.com/datenschutz/" : "https://prophotoskills.com/privacy-policy/";

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-stone-300 bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:p-5">
        <p className="flex-1 text-sm text-stone-800">
          {t("cookie.text")}{" "}
          <a href={datenschutz} target="_blank" rel="noreferrer" className="underline">
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
