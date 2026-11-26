import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { GoogleKnopf } from "@/components/google-knopf";
import { FELD, KNOPF, KontoSeite } from "@/components/konto-seite";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

// Anmelden mit dem Konto aus web (Supabase „Web Login“) – wie PPS Books (books-app v22, ohne Buch-Sonderfälle)
// ?weiter=/verlauf → nach der Anmeldung direkt dorthin
export const Route = createFileRoute("/anmelden")({
  head: () => ({ meta: [{ title: "PPS Lens – Anmelden" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ weiter: typeof s.weiter === "string" && s.weiter.startsWith("/") ? s.weiter : undefined }),
  component: Anmelden,
});

function Anmelden() {
  const { t } = useI18n();
  const { anmelden, passwortVergessen } = useAuth();
  const { weiter } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [vergessen, setVergessen] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState<{ ok: boolean; text: string } | null>(null);

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    setLaeuft(true);
    setMeldung(null);
    if (vergessen) {
      const f = await passwortVergessen(email);
      setLaeuft(false);
      // Bewusst immer dieselbe Meldung (verrät nicht, ob es das Konto gibt)
      if (f) console.warn(f);
      setMeldung({ ok: true, text: t("auth.resetSent") });
      return;
    }
    const f = await anmelden(email, passwort);
    setLaeuft(false);
    if (f) {
      console.warn(f);
      setMeldung({ ok: false, text: t("auth.error") });
      return;
    }
    if (weiter) window.location.assign(weiter);
    else void navigate({ to: "/" });
  }

  return (
    <KontoSeite titel={vergessen ? t("auth.forgot") : t("auth.title")}>
      <p className="text-sm text-stone-600">{t("auth.hint")}</p>
      {!vergessen && <GoogleKnopf weiter={weiter} />}
      <form onSubmit={absenden} className="mt-5 space-y-4">
        <label className="block text-sm font-medium text-stone-700">
          {t("auth.email")}
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={FELD} />
        </label>
        {!vergessen && (
          <label className="block text-sm font-medium text-stone-700">
            {t("auth.password")}
            <input type="password" required autoComplete="current-password" value={passwort} onChange={(e) => setPasswort(e.target.value)} className={FELD} />
          </label>
        )}
        {meldung && (
          <p role="status" className={`rounded-md px-3 py-2 text-sm ${meldung.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
            {meldung.text}
          </p>
        )}
        <button type="submit" disabled={laeuft} className={KNOPF}>
          {laeuft ? t("auth.busy") : vergessen ? t("auth.forgotSend") : t("auth.submit")}
        </button>
      </form>
      {!vergessen && (
        <p className="mt-5 rounded-md bg-stone-100 px-3 py-2 text-sm text-stone-700">
          {t("auth.noAccount")}{" "}
          <Link to="/registrieren" search={{ weiter }} className="font-semibold text-stone-900 underline underline-offset-2">
            {t("auth.register")}
          </Link>
        </p>
      )}
      <div className="mt-5 flex items-center justify-between gap-3 text-sm">
        <button type="button" onClick={() => { setVergessen(!vergessen); setMeldung(null); }} className="text-stone-600 underline-offset-2 hover:underline">
          {vergessen ? t("auth.title") : t("auth.forgot")}
        </button>
        <Link to="/" className="text-stone-600 underline-offset-2 hover:underline">{t("auth.back")}</Link>
      </div>
    </KontoSeite>
  );
}
