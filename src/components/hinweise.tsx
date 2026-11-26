import { Link } from "@tanstack/react-router";
import { Crown, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { KARTE } from "@/components/rahmen";
import { ANDROID_OHNE } from "@/lib/android-schalter";
import { useNurImBrowser } from "@/lib/app-umgebung";
import { useI18n } from "@/lib/i18n";
import { PRO_URL, setzeEinwilligung } from "@/lib/lens";
import { useStand } from "@/lib/stand";

/** Einwilligung vor dem ersten Foto (Datenschutz-Konzept: Transparenz vor dem Upload, Art. 6/7 DSGVO).
 *  Gespeichert wird sie im Tor mit Zeitpunkt + Textversion; ohne sie schickt das Tor kein Foto an die KI (428). */
export function EinwilligungKarte() {
  const { t } = useI18n();
  const { stand, setStand } = useStand();
  const [ja, setJa] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  async function speichern() {
    setLaeuft(true);
    setFehler(null);
    const r = await setzeEinwilligung(true);
    setLaeuft(false);
    if (r.daten) setStand(r.daten);
    else setFehler(r.status === 0 ? t("err.offline") : t("err.generic", { f: r.fehler ?? "" }));
  }

  return (
    <div className={`${KARTE} border-amber-300 p-5`}>
      <div className="flex items-center gap-2 font-semibold text-stone-900">
        <ShieldCheck className="h-5 w-5" /> {t("consent.title")}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-stone-700">{t("consent.text")}</p>
      <p className="mt-2 text-sm text-stone-700">
        {t("legal.more")}{" "}
        <Link to="/datenschutz" className="font-semibold underline underline-offset-2">{t("legal.privacy")}</Link> {t("legal.and")}{" "}
        <Link to="/nutzungsbedingungen" className="font-semibold underline underline-offset-2">{t("legal.terms")}</Link>
      </p>
      {stand?.version && <p className="mt-1 text-xs text-stone-400">{t("consent.version", { v: stand.version })}</p>}
      <label className="mt-4 flex items-start gap-2.5 text-sm text-stone-800">
        <input type="checkbox" checked={ja} onChange={(e) => setJa(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-stone-800" />
        <span>{t("consent.check")}</span>
      </label>
      {fehler && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{fehler}</p>}
      <button
        type="button"
        disabled={!ja || laeuft}
        onClick={() => void speichern()}
        className="mt-4 inline-flex items-center justify-center rounded-md bg-stone-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-50"
      >
        {laeuft ? t("auth.busy") : t("consent.save")}
      </button>
    </div>
  );
}

/** Kontingent aufgebraucht – MemberAbo-Hinweis + Link nur im Browser (v6: Schalter memberAbo, Google-Play-Regel) */
export function KontingentKarte({ limit }: { limit: number }) {
  const { t } = useI18n();
  const browser = useNurImBrowser();
  const aboZeigen = browser || !ANDROID_OHNE.memberAbo;
  const { stand } = useStand();
  return (
    <div className={`${KARTE} border-amber-300 p-5`}>
      <p className="text-sm text-stone-800">{t("err.kontingent", { l: limit })}</p>
      {stand?.plan !== "pro" && aboZeigen && (
        <>
          <p className="mt-2 text-sm text-stone-600">{t("err.upgrade")}</p>
          {(
            <a
              href={PRO_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#f8e800] px-4 py-2 text-sm font-bold text-stone-900 hover:brightness-95"
            >
              <Crown className="h-4 w-4" /> {t("err.upgradeBtn")}
            </a>
          )}
        </>
      )}
    </div>
  );
}

export function Kontingent() {
  const { t } = useI18n();
  const { stand } = useStand();
  if (!stand) return null;
  const frei = Math.max(0, stand.limit - stand.genutzt);
  // v9: kleiner Kasten oben rechts (Eric 26.11.: „Free 0 von 3 … rechts hin in einem Block“)
  return (
    <div className={`rounded-lg border px-3 py-2 text-right shadow-sm ${frei ? "border-stone-300 bg-white/95" : "border-rose-300 bg-rose-50"}`}>
      <div className="flex items-center justify-end gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
        {t("quota.plan")}
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] ${stand.plan === "pro" ? "bg-[#f8e800] text-stone-900" : "bg-stone-800 text-white"}`}>
          {stand.plan === "pro" && <Crown className="h-3 w-3" />}
          {stand.plan === "pro" ? "PRO" : "FREE"}
        </span>
      </div>
      <div className={`mt-1 text-xs font-medium ${frei ? "text-stone-800" : "text-rose-700"}`}>{t("quota.left", { n: frei, l: stand.limit })}</div>
    </div>
  );
}
