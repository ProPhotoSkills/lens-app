// ANDROID-SCHALTER – lens-app v6 (Eric 26.11.: „Liste von Dingen, die ich jetzt rausnehme,
// die wir erst später wieder reintun“). Gilt NUR in der Android-App (Hülle lens-android).
// Im normalen Browser (lens.prophotoskills.workers.dev) bleibt alles wie in v5.
//
//   true  = in der Android-App ausgeblendet (Google-Play-Fassung)
//   false = wieder da wie im Browser
//
// Wieder einschalten: Wert auf false, WEB_VERSION hochzählen, hochladen. Kein neuer Android-Build nötig,
// weil die App die Web-Seite lädt. Liste mit Begründung: 1_web/23_lens-(Fotobewertung +Community)/TODO_spaeter-wieder-rein_v3.md (höchste Nummer)

export const ANDROID_OHNE = {
  /** MemberAbo: Hinweis „mit dem MemberAbo 300“, Knopf „MemberAbo ansehen“, Kauf-Hinweis beim Anmelden.
   *  Google Play: keine Käufe/Kauf-Werbung außerhalb von Google Play Billing. */
  memberAbo: true,
  /** Wort „KI-Coach“ (Reiter oben, Verlauf, Fazit) → in der App „Bewerten“ / „Fazit“.
   *  Grund: PPS Coach ist eine eigene App im Play Store, keine Verwechslung. */
  kiCoach: true,
  /** Knopf „App installieren“ (PWA) – in der Play-App unnötig */
  appInstallieren: true,
  /** v11: „Mit Google anmelden“ – in der App erst, wenn lens-android den Rückweg in die App kann (wie PPS Coach, android_v3) */
  googleLogin: true,
  /** Lektion-Links in den Tipps (Artikel auf prophotoskills.com mit Shop) – schon seit lens v2 aus */
  lektionLinks: true,
} as const;

export type AndroidSchalter = keyof typeof ANDROID_OHNE;

/** Ersatztexte in der Android-App. Schlüssel = i18n-Schlüssel; leer "" = Text ganz weglassen. */
export const APP_TEXTE: Partial<Record<string, Partial<Record<string, { schalter: AndroidSchalter; text: string }>>>> & Record<"de" | "en", Partial<Record<string, { schalter: AndroidSchalter; text: string }>>> = {
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
  fr: {
    "nav.coach": { schalter: "kiCoach", text: "Évaluer" },
    "hist.empty": { schalter: "kiCoach", text: "Pas encore d'évaluation. Fais évaluer ta première photo." },
    "hist.toCoach": { schalter: "kiCoach", text: "Évaluer une photo" },
    "score.summary": { schalter: "kiCoach", text: "Verdict" },
    "start.sub": { schalter: "kiCoach", text: "Évaluation photo par IA : charge une photo et reçois une évaluation honnête avec des conseils concrets pour ta prochaine image." },
    "start.plans": { schalter: "memberAbo", text: "Gratuit : 3 évaluations par mois" },
    "auth.hint": { schalter: "memberAbo", text: "Un seul compte pour toutes les applis ProPhotoSkills : connecte-toi avec ton compte ProPhotoSkills, par exemple celui de PPS Books." },
    "err.upgrade": { schalter: "memberAbo", text: "" },
  },
  it: {
    "nav.coach": { schalter: "kiCoach", text: "Valuta" },
    "hist.empty": { schalter: "kiCoach", text: "Ancora nessuna valutazione. Fai valutare la tua prima foto." },
    "hist.toCoach": { schalter: "kiCoach", text: "Valuta una foto" },
    "score.summary": { schalter: "kiCoach", text: "Verdetto" },
    "start.sub": { schalter: "kiCoach", text: "Valutazione foto con IA: carica una foto e ricevi una valutazione onesta con consigli concreti per il prossimo scatto." },
    "start.plans": { schalter: "memberAbo", text: "Gratis: 3 valutazioni al mese" },
    "auth.hint": { schalter: "memberAbo", text: "Un solo account per tutte le app ProPhotoSkills: accedi con il tuo account ProPhotoSkills, ad esempio quello di PPS Books." },
    "err.upgrade": { schalter: "memberAbo", text: "" },
  },
  es: {
    "nav.coach": { schalter: "kiCoach", text: "Valorar" },
    "hist.empty": { schalter: "kiCoach", text: "Aún no hay valoraciones. Haz valorar tu primera foto." },
    "hist.toCoach": { schalter: "kiCoach", text: "Valorar una foto" },
    "score.summary": { schalter: "kiCoach", text: "Veredicto" },
    "start.sub": { schalter: "kiCoach", text: "Valoración de fotos con IA: sube una foto y recibe una valoración honesta con consejos concretos para tu próxima imagen." },
    "start.plans": { schalter: "memberAbo", text: "Gratis: 3 valoraciones al mes" },
    "auth.hint": { schalter: "memberAbo", text: "Una cuenta para todas las apps de ProPhotoSkills: inicia sesión con tu cuenta de ProPhotoSkills, por ejemplo la de PPS Books." },
    "err.upgrade": { schalter: "memberAbo", text: "" },
  },
  pt: {
    "nav.coach": { schalter: "kiCoach", text: "Avaliar" },
    "hist.empty": { schalter: "kiCoach", text: "Ainda sem avaliações. Faz avaliar a tua primeira foto." },
    "hist.toCoach": { schalter: "kiCoach", text: "Avaliar uma foto" },
    "score.summary": { schalter: "kiCoach", text: "Veredicto" },
    "start.sub": { schalter: "kiCoach", text: "Avaliação de fotos com IA: carrega uma foto e recebe uma avaliação honesta com dicas concretas para a tua próxima imagem." },
    "start.plans": { schalter: "memberAbo", text: "Grátis: 3 avaliações por mês" },
    "auth.hint": { schalter: "memberAbo", text: "Uma conta para todas as apps ProPhotoSkills: entra com a tua conta ProPhotoSkills, por exemplo a do PPS Books." },
    "err.upgrade": { schalter: "memberAbo", text: "" },
  },
  el: {
    "nav.coach": { schalter: "kiCoach", text: "Αξιολόγηση" },
    "hist.empty": { schalter: "kiCoach", text: "Δεν υπάρχουν ακόμη αξιολογήσεις. Αξιολόγησε την πρώτη σου φωτογραφία." },
    "hist.toCoach": { schalter: "kiCoach", text: "Αξιολόγηση φωτογραφίας" },
    "score.summary": { schalter: "kiCoach", text: "Ετυμηγορία" },
    "start.sub": { schalter: "kiCoach", text: "Αξιολόγηση φωτογραφιών με AI: ανέβασε μια φωτογραφία και πάρε μια ειλικρινή αξιολόγηση με συγκεκριμένες συμβουλές για την επόμενη λήψη." },
    "start.plans": { schalter: "memberAbo", text: "Δωρεάν: 3 αξιολογήσεις τον μήνα" },
    "auth.hint": { schalter: "memberAbo", text: "Ένας λογαριασμός για όλες τις εφαρμογές ProPhotoSkills: συνδέσου με τον λογαριασμό σου ProPhotoSkills, π.χ. αυτόν του PPS Books." },
    "err.upgrade": { schalter: "memberAbo", text: "" },
  },
  ja: {
    "nav.coach": { schalter: "kiCoach", text: "評価" },
    "hist.empty": { schalter: "kiCoach", text: "まだ評価がありません。最初の写真を評価しましょう。" },
    "hist.toCoach": { schalter: "kiCoach", text: "写真を評価する" },
    "score.summary": { schalter: "kiCoach", text: "総評" },
    "start.sub": { schalter: "kiCoach", text: "AI 写真評価：写真をアップロードすると、次の一枚に役立つ具体的なアドバイス付きで率直に評価します。" },
    "start.plans": { schalter: "memberAbo", text: "無料：月 3 回の評価" },
    "auth.hint": { schalter: "memberAbo", text: "すべての ProPhotoSkills アプリで使える 1 つのアカウント：ProPhotoSkills アカウント（例：PPS Books のアカウント）でログインしてください。" },
    "err.upgrade": { schalter: "memberAbo", text: "" },
  },
};
