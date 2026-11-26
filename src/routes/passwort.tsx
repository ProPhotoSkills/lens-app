import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { FELD, KNOPF, KontoSeite } from "@/components/konto-seite";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

// Neues Passwort setzen – Ziel des Links aus der Mail „Passwort vergessen“ (v12).
// Supabase hängt die Sitzung an die Adresse an; supabase-js liest sie beim Laden selbst aus.
export const Route = createFileRoute("/passwort")({
  head: () => ({ meta: [{ title: "PPS Lens – Neues Passwort" }] }),
  component: Passwort,
});

function Passwort() {
  const { t } = useI18n();
  const { bereit, session, neuesPasswort } = useAuth();
  const [passwort, setPasswort] = useState("");
  const [laeuft, setLaeuft] = useState(false);
  const [fertig, setFertig] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [gewartet, setGewartet] = useState(false);

  // kurz warten, bis die Sitzung aus dem Link gelesen ist
  useEffect(() => {
    const id = window.setTimeout(() => setGewartet(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  async function speichern(e: React.FormEvent) {
    e.preventDefault();
    setLaeuft(true);
    const f = await neuesPasswort(passwort);
    setLaeuft(false);
    if (f) setFehler(f);
    else setFertig(true);
  }

  const ungueltig = bereit && gewartet && !session;

  return (
    <KontoSeite titel={t("auth.newTitle")}>
      {fertig ? (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">{t("auth.saved")}</p>
      ) : ungueltig ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{t("auth.linkInvalid")}</p>
      ) : (
        <form onSubmit={speichern} className="space-y-4">
          <label className="block text-sm font-medium text-stone-700">
            {t("auth.newPassword")}
            <input type="password" required minLength={8} autoComplete="new-password" value={passwort} onChange={(e) => setPasswort(e.target.value)} className={FELD} />
          </label>
          {fehler && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{fehler}</p>}
          <button type="submit" disabled={laeuft || !session} className={KNOPF}>
            {laeuft ? t("auth.busy") : t("auth.save")}
          </button>
        </form>
      )}
      <div className="mt-5 text-sm">
        <Link to="/" className="text-stone-600 underline-offset-2 hover:underline">{t("auth.back")}</Link>
      </div>
    </KontoSeite>
  );
}
