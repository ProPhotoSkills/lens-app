import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { FELD, KNOPF, KontoSeite } from "@/components/konto-seite";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

// Kostenloses Konto anlegen – wie PPS Books (books-app v22). Free = 3 Bewertungen im Monat.
// Gleiche Konten wie web und Books: wer später das MemberAbo kauft (gleiche E-Mail), ist automatisch Pro.
// Newsletter nur als freiwilliger, nicht vorausgewählter Haken – wird mit Zeitpunkt im Konto gespeichert.
export const Route = createFileRoute("/registrieren")({
  head: () => ({ meta: [{ title: "PPS Lens – Registrieren" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ weiter: typeof s.weiter === "string" && s.weiter.startsWith("/") ? s.weiter : undefined }),
  component: Registrieren,
});

function Registrieren() {
  const { t, lang } = useI18n();
  const { registrieren } = useAuth();
  const { weiter } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [fertig, setFertig] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    setLaeuft(true);
    setFehler(null);
    const f = await registrieren({ email, passwort, newsletter, sprache: lang, weiter });
    setLaeuft(false);
    if (f === null) {
      window.location.assign(weiter ?? "/");
      return;
    }
    if (f === "bestaetigen") {
      setFertig(true);
      return;
    }
    console.warn(f);
    setFehler(`${t("reg.error")} ${f}`);
  }

  const datenschutz = lang === "de" ? "https://prophotoskills.com/datenschutz/" : "https://prophotoskills.com/privacy-policy/";

  return (
    <KontoSeite titel={t("reg.title")}>
      {fertig ? (
        <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">{t("reg.confirm")}</p>
      ) : (
        <>
          <p className="text-sm text-stone-600">{t("reg.hint")}</p>
          <form onSubmit={absenden} className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-stone-700">
              {t("auth.email")}
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={FELD} />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {t("reg.password")}
              <input type="password" required minLength={8} autoComplete="new-password" value={passwort} onChange={(e) => setPasswort(e.target.value)} className={FELD} />
            </label>
            <label className="flex items-start gap-2.5 text-sm text-stone-700">
              <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-stone-800" />
              <span>{t("reg.newsletter")}</span>
            </label>
            <p className="text-xs text-stone-500">
              {t("reg.privacy")}{" "}
              <a href={datenschutz} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-stone-800">
                {t("footer.privacy")}
              </a>
            </p>
            {fehler && <p role="status" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{fehler}</p>}
            <button type="submit" disabled={laeuft} className={KNOPF}>
              {laeuft ? t("auth.busy") : t("reg.submit")}
            </button>
          </form>
        </>
      )}
      <div className="mt-5 flex items-center justify-between gap-3 text-sm">
        <Link to="/anmelden" search={{ weiter }} className="text-stone-600 underline-offset-2 hover:underline">{t("reg.haveAccount")}</Link>
        <Link to="/" className="text-stone-600 underline-offset-2 hover:underline">{t("auth.back")}</Link>
      </div>
    </KontoSeite>
  );
}
