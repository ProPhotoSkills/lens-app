// Anmelde-Wege für PPS Lens – v11 (Eric 26.11.: „was ist mit dem Google-Konto anmelden? … immer 2 Optionen“).
// Stand Brain: Nur der KI-Coach (Supabase-Projekt „Coach App“) hat Google-Login. PPS Books und Web-Login
// (Projekt „Web Login“, das Lens nutzt) haben NUR E-Mail + Passwort – dort ist Google noch nicht eingerichtet.
//
// GOOGLE_LOGIN = false → Knopf ist aus. Einschalten erst, wenn in Supabase „Web Login“ der Anbieter Google aktiv ist
// (Authentication → Sign In / Providers → Google, mit OAuth-Client aus der Google Cloud Console) und
// https://lens.prophotoskills.workers.dev/** als Redirect-URL eingetragen ist. Dann: true, WEB_VERSION + CACHE hoch, hochladen.
// In der Android-App bleibt er trotzdem aus (Schalter googleLogin in android-schalter.ts), bis lens-android den
// Rückweg in die App kann (wie PPS Coach: Custom Tab + com.prophotoskills.lens://auth-callback, neue Android-Version).
export const GOOGLE_LOGIN = false;
