import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, Trash2 } from "lucide-react";

import { KARTE, Rahmen } from "@/components/rahmen";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

// v6: Konto löschen – Google Play verlangt bei Apps mit Konto (1) einen Weg in der App und (2) eine
// Web-Adresse, unter der man die Löschung beantragen kann, auch ohne die App:
//   https://lens.prophotoskills.workers.dev/konto-loeschen  → in der Play Console unter „Datensicherheit“ eintragen.
// Gelöscht wird von Hand über Supabase (Projekt „Web Login“ → Authentication → Users → Delete user);
// alle lc_-Tabellen hängen mit „on delete cascade“ am Konto. Das Tor hat bewusst keinen Admin-Schlüssel.
export const SUPPORT = "support@prophotoskills.com";

export const Route = createFileRoute("/konto-loeschen")({
  head: () => ({ meta: [{ title: "PPS Lens – Konto löschen" }] }),
  component: KontoLoeschen,
});

const TEXT = {
  de: {
    titel: "Konto löschen",
    intro: "So löschst du dein ProPhotoSkills-Konto und alle Daten von PPS Lens. Das geht in der App und hier im Browser, ohne Installation.",
    schritteTitel: "So geht's",
    schritte: [
      "Tippe unten auf „Löschung per E-Mail beantragen“ (oder schreib an " + SUPPORT + ").",
      "Schreib von der E-Mail-Adresse, mit der du angemeldet bist, damit wir sehen, dass es dein Konto ist.",
      "Wir löschen dein Konto spätestens innerhalb eines Monats und bestätigen dir das per E-Mail.",
    ],
    wasTitel: "Was gelöscht wird",
    was: [
      "Dein Konto: E-Mail-Adresse, Passwort und Kontodaten",
      "Alle Bewertungen in PPS Lens, gespeicherte Vorschaubilder, deine Einwilligungen und der Zähler für dein Monatskontingent",
      "Dein Konto gilt für alle ProPhotoSkills-Apps (zum Beispiel auch PPS Books). Es wird dort ebenfalls gelöscht.",
    ],
    bleibtTitel: "Was bleibt",
    bleibt: [
      "Rechnungen zu früheren Käufen bewahren wir so lange auf, wie das Gesetz es verlangt (Steuerrecht).",
      "Deine Fotos speichert PPS Lens ohnehin nie – nur das Ergebnis der Bewertung.",
    ],
    nurTitel: "Nur Bewertungen löschen, Konto behalten",
    nur: "Melde dich an und öffne den Verlauf. Unter „Deine Daten“ kannst du einzelne oder alle Bewertungen sofort selbst löschen.",
    knopf: "Löschung per E-Mail beantragen",
    betreff: "Konto löschen – PPS Lens",
    text: (mail: string) => `Bitte löscht mein ProPhotoSkills-Konto${mail ? ` (${mail})` : ""} mit allen Daten.`,
    verlauf: "Zum Verlauf",
  },
  en: {
    titel: "Delete account",
    intro: "How to delete your ProPhotoSkills account and all PPS Lens data. Works in the app and here in the browser, no installation needed.",
    schritteTitel: "How it works",
    schritte: [
      "Tap “Request deletion by email” below (or write to " + SUPPORT + ").",
      "Write from the email address you sign in with, so we can see it is your account.",
      "We delete your account within one month at the latest and confirm it by email.",
    ],
    wasTitel: "What is deleted",
    was: [
      "Your account: email address, password and account data",
      "All reviews in PPS Lens, saved thumbnails, your consents and the counter for your monthly quota",
      "Your account works for all ProPhotoSkills apps (for example PPS Books). It is deleted there as well.",
    ],
    bleibtTitel: "What is kept",
    bleibt: [
      "Invoices for earlier purchases are kept as long as the law requires (tax law).",
      "PPS Lens never stores your photos anyway – only the result of the review.",
    ],
    nurTitel: "Delete reviews only, keep the account",
    nur: "Sign in and open your history. Under “Your data” you can delete single or all reviews yourself right away.",
    knopf: "Request deletion by email",
    betreff: "Delete account – PPS Lens",
    text: (mail: string) => `Please delete my ProPhotoSkills account${mail ? ` (${mail})` : ""} with all data.`,
    verlauf: "To history",
  },
};

function KontoLoeschen() {
  const { t, lang } = useI18n();
  const { session } = useAuth();
  const x = lang === "de" ? TEXT.de : TEXT.en;
  const mail = session?.user?.email ?? "";
  const href = `mailto:${SUPPORT}?subject=${encodeURIComponent(x.betreff)}&body=${encodeURIComponent(x.text(mail))}`;
  const liste = (punkte: string[], nummern = false) => {
    const Tag = nummern ? "ol" : "ul";
    return (
      <Tag className={`mt-2 ${nummern ? "list-decimal" : "list-disc"} space-y-1.5 pl-5 text-sm leading-relaxed text-stone-700`}>
        {punkte.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </Tag>
    );
  };
  return (
    <Rahmen>
      <article className={`${KARTE} max-w-3xl p-6 sm:p-8`}>
        <Link to="/" className="mb-4 flex w-fit items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900">
          <ArrowLeft className="h-4 w-4" /> {t("auth.back")}
        </Link>
        <h1 className="inline-flex items-center gap-2 rounded-md bg-[#f8e800] px-2.5 py-1 text-xl font-bold text-stone-800 sm:text-2xl">
          <Trash2 className="h-5 w-5" /> {x.titel}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-stone-700">{x.intro}</p>
        <h2 className="mt-6 text-base font-bold text-stone-900">{x.schritteTitel}</h2>
        {liste(x.schritte, true)}
        <a href={href} className="mt-4 inline-flex items-center gap-2 rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800">
          <Mail className="h-4 w-4" /> {x.knopf}
        </a>
        <h2 className="mt-6 text-base font-bold text-stone-900">{x.wasTitel}</h2>
        {liste(x.was)}
        <h2 className="mt-6 text-base font-bold text-stone-900">{x.bleibtTitel}</h2>
        {liste(x.bleibt)}
        <h2 className="mt-6 text-base font-bold text-stone-900">{x.nurTitel}</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-700">{x.nur}</p>
        {session && (
          <Link to="/verlauf" search={{ id: undefined }} className="mt-3 inline-flex text-sm font-semibold underline underline-offset-2">
            {x.verlauf}
          </Link>
        )}
      </article>
    </Rahmen>
  );
}
