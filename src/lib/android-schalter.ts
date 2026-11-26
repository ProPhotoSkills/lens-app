// ANDROID-SCHALTER – lens-app v6 (Eric 26.11.: „Liste von Dingen, die ich jetzt rausnehme,
// die wir erst später wieder reintun“). Gilt NUR in der Android-App (Hülle lens-android).
// Im normalen Browser (lens.prophotoskills.workers.dev) bleibt alles wie in v5.
//
//   true  = in der Android-App ausgeblendet (Google-Play-Fassung)
//   false = wieder da wie im Browser
//
// Wieder einschalten: Wert auf false, WEB_VERSION hochzählen, hochladen. Kein neuer Android-Build nötig,
// weil die App die Web-Seite lädt. Liste mit Begründung: 1_web/23_lens-(Fotobewertung +Community)/TODO_spaeter-wieder-rein_v2.md (höchste Nummer)

export const ANDROID_OHNE = {
  /** MemberAbo: Hinweis „mit dem MemberAbo 300“, Knopf „MemberAbo ansehen“, Kauf-Hinweis beim Anmelden.
   *  Google Play: keine Käufe/Kauf-Werbung außerhalb von Google Play Billing. */
  memberAbo: true,
  /** Wort „KI-Coach“ (Reiter oben, Verlauf, Fazit) → in der App „Bewerten“ / „Fazit“.
   *  Grund: PPS Coach ist eine eigene App im Play Store, keine Verwechslung. */
  kiCoach: true,
  /** Knopf „App installieren“ (PWA) – in der Play-App unnötig */
  appInstallieren: true,
  /** Lektion-Links in den Tipps (Artikel auf prophotoskills.com mit Shop) – schon seit lens v2 aus */
  lektionLinks: true,
} as const;

export type AndroidSchalter = keyof typeof ANDROID_OHNE;

/** Ersatztexte in der Android-App. Schlüssel = i18n-Schlüssel; leer "" = Text ganz weglassen. */
export const APP_TEXTE: Record<"de" | "en", Partial<Record<string, { schalter: AndroidSchalter; text: string }>>> = {
  de: {
    "nav.coach": { schalter: "kiCoach", text: "Bewerten" },
    "hist.empty": { schalter: "kiCoach", text: "Noch keine Bewertungen. Lass dein erstes Foto bewerten." },
    "hist.toCoach": { schalter: "kiCoach", text: "Foto bewerten" },
    "score.summary": { schalter: "kiCoach", text: "Fazit" },
    "start.sub": { schalter: "kiCoach", text: "KI-Fotobewertung: Lade ein Foto hoch und bekomm eine ehrliche Bewertung mit konkreten Tipps für dein nächstes Bild." },
    "start.plans": { schalter: "memberAbo", text: "Kostenlos: 3 Bewertungen im Monat" },
    "err.upgrade": { schalter: "memberAbo", text: "" },
    "auth.hint": { schalter: "memberAbo", text: "Ein Konto für alle ProPhotoSkills-Apps: Melde dich mit deinem ProPhotoSkills-Konto an, zum Beispiel dem von PPS Books." },
  },
  en: {
    "nav.coach": { schalter: "kiCoach", text: "Review" },
    "hist.empty": { schalter: "kiCoach", text: "No reviews yet. Have your first photo reviewed." },
    "hist.toCoach": { schalter: "kiCoach", text: "Review a photo" },
    "score.summary": { schalter: "kiCoach", text: "Verdict" },
    "start.sub": { schalter: "kiCoach", text: "AI photo review: upload a photo and get an honest review with concrete tips for your next shot." },
    "start.plans": { schalter: "memberAbo", text: "Free: 3 reviews per month" },
    "err.upgrade": { schalter: "memberAbo", text: "" },
    "auth.hint": { schalter: "memberAbo", text: "One account for all ProPhotoSkills apps: sign in with your ProPhotoSkills account, for example the one from PPS Books." },
  },
};
