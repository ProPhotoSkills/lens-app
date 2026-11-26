import { Link } from "@tanstack/react-router";
import { ArrowLeft, Info } from "lucide-react";

import { KARTE, Rahmen } from "@/components/rahmen";
import { useI18n } from "@/lib/i18n";
import { datenschutzPpsUrl, impressumUrl, RECHT_STAND, type Rechtstext } from "@/lib/rechtstexte";

/** Seite für Datenschutz / Nutzungsbedingungen – Texte aus lib/rechtstexte.ts (de, sonst en) */
export function Rechtsseite({ texte }: { texte: Record<"de" | "en", Rechtstext> }) {
  const { t, lang } = useI18n();
  const x = lang === "de" ? texte.de : texte.en;
  return (
    <Rahmen>
      <article className={`${KARTE} max-w-3xl p-6 sm:p-8`}>
        <Link to="/" className="mb-4 flex w-fit items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900">
          <ArrowLeft className="h-4 w-4" /> {t("auth.back")}
        </Link>
        <h1 className="inline-block rounded-md bg-[#f8e800] px-2.5 py-1 text-xl font-bold text-stone-800 sm:text-2xl">{x.titel}</h1>
        <p className="mt-2 text-xs text-stone-500">{t("legal.stand", { d: RECHT_STAND })}</p>
        <p className="mt-4 flex gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" /> {t("legal.draft")}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-stone-700">{x.einleitung}</p>
        {x.abschnitte.map((a) => (
          <section key={a.titel} className="mt-6">
            <h2 className="text-base font-bold text-stone-900">{a.titel}</h2>
            {a.absaetze.map((p, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-stone-700">
                {p}
              </p>
            ))}
            {a.punkte && (
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-stone-700">
                {a.punkte.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-200 pt-4 text-sm">
          <a href={impressumUrl(lang)} target="_blank" rel="noreferrer" className="font-semibold text-stone-900 underline underline-offset-2">
            {t("footer.imprint")}
          </a>
          <a href={datenschutzPpsUrl(lang)} target="_blank" rel="noreferrer" className="font-semibold text-stone-900 underline underline-offset-2">
            {t("legal.ppsPrivacy")}
          </a>
          <Link to="/datenschutz" className="font-semibold text-stone-900 underline underline-offset-2">{t("legal.privacy")}</Link>
          <Link to="/nutzungsbedingungen" className="font-semibold text-stone-900 underline underline-offset-2">{t("legal.terms")}</Link>
        </div>
      </article>
    </Rahmen>
  );
}
