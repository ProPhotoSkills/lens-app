// Rechtstexte für PPS Lens – ENTWURF (lens-app v5, Claude 26.11.2026), NICHT anwaltlich geprüft.
// Grundlage: Datenschutz-Konzept (Brain 23_lens/konzept_datenschutz_foto_bewertungs_app.md), Worker lens-gate v3,
// unterschriebenes OpenAI Data Processing Addendum (26.11.2026, Vertragspartner für EWR-Kunden: OpenAI Ireland Ltd.,
// Übermittlung außerhalb des EWR auf Basis der EU-Standardvertragsklauseln), Einstellungen bei OpenAI laut Eric 26.11.:
// Daten-Teilen fürs Training aus, Protokollierung der API-Aufrufe aus, keine Zero Data Retention.
// Stellen in [eckigen Klammern] muss Eric bzw. ein Anwalt ergänzen/prüfen.
// Verantwortlicher: bewusst „siehe Impressum“ – dort steht heute Sabine Kraus, den OpenAI-Vertrag hat Eric für
// „ProPhotoSkills“ unterschrieben → vom Anwalt klären lassen.

export const RECHT_STAND = "26.11.2026";

export type Abschnitt = { titel: string; absaetze: string[]; punkte?: string[] };
export type Rechtstext = { titel: string; einleitung: string; abschnitte: Abschnitt[] };

const IMPRESSUM_DE = "https://prophotoskills.com/impressum/";
const IMPRESSUM_EN = "https://prophotoskills.com/site-notice/";
export const impressumUrl = (lang: string) => (lang === "de" ? IMPRESSUM_DE : IMPRESSUM_EN);
export const datenschutzPpsUrl = (lang: string) =>
  lang === "de" ? "https://prophotoskills.com/datenschutz/" : "https://prophotoskills.com/privacy-policy/";

export const DATENSCHUTZ: Record<"de" | "en", Rechtstext> = {
  de: {
    titel: "Datenschutz bei PPS Lens",
    einleitung:
      "Hier steht, was mit deinen Daten passiert, wenn du PPS Lens nutzt. Diese Hinweise ergänzen die allgemeine Datenschutzerklärung von ProPhotoSkills.",
    abschnitte: [
      {
        titel: "1. Wer ist verantwortlich?",
        absaetze: [
          "Verantwortlich für die Datenverarbeitung ist der Betreiber von ProPhotoSkills. Name, Anschrift und Kontakt findest du im Impressum. Fragen zum Datenschutz: support@prophotoskills.com.",
        ],
      },
      {
        titel: "2. Was mit deinem Foto passiert",
        absaetze: ["Dein Foto ist das Wichtigste – darum ist der Ablauf so gebaut, dass so wenig wie möglich dein Gerät verlässt:"],
        punkte: [
          "Wenn du ein Foto auswählst, bleibt es zunächst auf deinem Gerät. Die App liest dort nur die Aufnahmedaten Kamera, Brennweite, Blende, Belichtungszeit und ISO.",
          "Noch auf deinem Gerät wird das Foto auf höchstens 1.600 Pixel verkleinert und neu gespeichert. Dabei fallen alle Metadaten weg – auch GPS-Standort und Seriennummer der Kamera.",
          "Erst wenn du auf „Bewerten lassen“ tippst, geht das verkleinerte Foto mit den fünf Aufnahmedaten an unseren Server (lens-gate). Der Server entfernt sicherheitshalber noch einmal alle Metadaten.",
          "Der Server schickt das Foto zur Bewertung an OpenAI (siehe Punkt 4) und gibt dir das Ergebnis zurück.",
          "Wir speichern dein Foto nicht. Gespeichert wird nur das Ergebnis der Bewertung – und, nur wenn du den Haken setzt, ein kleines Vorschaubild (96 Pixel breit).",
        ],
      },
      {
        titel: "3. Welche Daten wir speichern",
        absaetze: [],
        punkte: [
          "Dein Konto (E-Mail-Adresse, Passwort verschlüsselt) – dasselbe Konto wie für die anderen ProPhotoSkills-Apps.",
          "Deine Einwilligung (ja/nein, Zeitpunkt, Version des Einwilligungstextes) – als Nachweis.",
          "Deine Bewertungen: Bildtitel, Punktzahlen, Texte und Tipps der KI, Markierungen, die fünf Aufnahmedaten, Datum, Sprache, verwendetes KI-Modell, deine Bestätigung der Bildrechte und – falls gewünscht – das Vorschaubild.",
          "Die Anzahl deiner Bewertungen pro Monat (nur Zahlen, für das Monatskontingent).",
          "In deinem Browser: deine Anmeldung, die gewählte Sprache und deine Cookie-Auswahl (lokaler Speicher). Google Analytics oder andere Statistik-Dienste setzt PPS Lens derzeit nicht ein.",
        ],
      },
      {
        titel: "4. KI-Bewertung durch OpenAI",
        absaetze: [
          "Für die Bewertung nutzen wir die Programmierschnittstelle (API) von OpenAI. Unser Vertragspartner ist OpenAI Ireland Ltd., Dublin, Irland. OpenAI verarbeitet die Daten als Auftragsverarbeiter nach unserem Auftrag; mit OpenAI besteht ein Vertrag zur Auftragsverarbeitung (Data Processing Addendum, abgeschlossen am 26.11.2026).",
          "OpenAI kann Daten auch in den USA verarbeiten (OpenAI OpCo, LLC, San Francisco). Für diese Übermittlung gelten die Standardvertragsklauseln der EU-Kommission bzw. ein Angemessenheitsbeschluss (Art. 45, 46 DSGVO).",
          "OpenAI nutzt Daten aus der API nicht zum Training seiner Modelle; das Teilen von Daten zu Trainingszwecken ist in unserem Konto ausgeschaltet. Nach Angaben von OpenAI können API-Anfragen zur Erkennung von Missbrauch bis zu 30 Tage gespeichert und danach gelöscht werden.",
          "Wir schicken OpenAI weder deinen Namen noch deine E-Mail-Adresse – nur das verkleinerte Foto ohne Metadaten und die fünf Aufnahmedaten. Die KI ist angewiesen, keine Personen, Orte, Adressen oder Kennzeichen zu benennen.",
        ],
      },
      {
        titel: "5. Weitere Dienstleister",
        absaetze: [],
        punkte: [
          "Cloudflare, Inc. – betreibt die App und den Server lens-gate (Cloudflare Workers). [Vertrag zur Auftragsverarbeitung prüfen]",
          "Supabase, Inc. – Datenbank für Konto, Einwilligung und Bewertungen. [Serverstandort des Projekts „Web Login“ eintragen; Vertrag zur Auftragsverarbeitung prüfen]",
          "Digistore24 – nur wenn du ein Produkt kaufst (z. B. das MemberAbo); dafür gilt die Datenschutzerklärung von ProPhotoSkills.",
        ],
      },
      {
        titel: "6. Rechtsgrundlagen",
        absaetze: [],
        punkte: [
          "Konto, Bewertungen speichern, Kontingent: Erfüllung des Nutzungsvertrags (Art. 6 Abs. 1 lit. b DSGVO).",
          "Übermittlung deines Fotos an OpenAI zur Bewertung: deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du vor dem ersten Foto gibst und jederzeit widerrufen kannst.",
          "Nachweis der Einwilligung und Sicherheit des Dienstes: berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO).",
        ],
      },
      {
        titel: "7. Wie lange wir speichern",
        absaetze: [
          "Bewertungen und Vorschaubilder speichern wir, bis du sie löschst oder dein Konto gelöscht wird. Die Monatszählung und der Nachweis deiner Einwilligung bleiben bis zur Löschung deines Kontos. Mit der Löschung des Kontos werden alle Daten von PPS Lens gelöscht. [Speicherdauer anwaltlich bestätigen]",
        ],
      },
      {
        titel: "8. Deine Rechte – direkt in der App",
        absaetze: [],
        punkte: [
          "Auskunft und Datenübertragbarkeit (Art. 15, 20 DSGVO): im Verlauf unter „Meine Daten herunterladen“ bekommst du alles, was PPS Lens über dich speichert, als Datei.",
          "Löschung (Art. 17 DSGVO): einzelne oder alle Bewertungen im Verlauf löschen. Dein ganzes Konto löschen wir auf Anfrage an support@prophotoskills.com.",
          "Widerruf (Art. 7 Abs. 3 DSGVO): im Verlauf unter „Einwilligung widerrufen“. Danach werden keine Fotos mehr an OpenAI geschickt. Bisherige Verarbeitungen bleiben rechtmäßig.",
          "Berichtigung, Einschränkung, Widerspruch (Art. 16, 18, 21 DSGVO): per E-Mail an support@prophotoskills.com.",
          "Beschwerde bei einer Datenschutz-Aufsichtsbehörde, z. B. der spanischen Agencia Española de Protección de Datos (aepd.es) oder der Behörde in deinem Land.",
        ],
      },
      {
        titel: "9. Keine automatisierte Entscheidung",
        absaetze: [
          "Die Bewertung ist ein Lern-Feedback einer KI zu deinem Foto. Sie hat keine rechtliche oder ähnlich erhebliche Wirkung für dich (Art. 22 DSGVO).",
        ],
      },
    ],
  },
  en: {
    titel: "Privacy at PPS Lens",
    einleitung:
      "This page explains what happens to your data when you use PPS Lens. It supplements the general ProPhotoSkills privacy policy.",
    abschnitte: [
      {
        titel: "1. Who is responsible?",
        absaetze: [
          "The operator of ProPhotoSkills is responsible for data processing. Name, address and contact details are in the site notice. Privacy questions: support@prophotoskills.com.",
        ],
      },
      {
        titel: "2. What happens to your photo",
        absaetze: ["Your photo matters most – so as little as possible leaves your device:"],
        punkte: [
          "When you choose a photo, it stays on your device. The app only reads the camera, focal length, aperture, shutter speed and ISO there.",
          "Still on your device, the photo is resized to at most 1,600 pixels and saved again. All metadata is dropped – including GPS location and the camera's serial number.",
          "Only when you tap “Review” does the resized photo go to our server (lens-gate) together with the five shooting values. The server removes all metadata once more.",
          "The server sends the photo to OpenAI for the review (see section 4) and returns the result to you.",
          "We do not store your photo. Only the review result is stored – and, only if you tick the box, a small thumbnail (96 pixels wide).",
        ],
      },
      {
        titel: "3. What we store",
        absaetze: [],
        punkte: [
          "Your account (email address, encrypted password) – the same account as for the other ProPhotoSkills apps.",
          "Your consent (yes/no, time, version of the consent text) – as proof.",
          "Your reviews: title, scores, the AI's texts and tips, markers, the five shooting values, date, language, AI model used, your confirmation of the image rights and – if you wish – the thumbnail.",
          "The number of reviews per month (numbers only, for the monthly quota).",
          "In your browser: your sign-in, chosen language and cookie choice (local storage). PPS Lens currently uses no Google Analytics or other statistics service.",
        ],
      },
      {
        titel: "4. AI review by OpenAI",
        absaetze: [
          "For the review we use the OpenAI API. Our contracting party is OpenAI Ireland Ltd., Dublin, Ireland, acting as our processor under a Data Processing Addendum (signed 26 Nov 2026).",
          "OpenAI may also process data in the USA (OpenAI OpCo, LLC, San Francisco). These transfers are based on the EU Standard Contractual Clauses or an adequacy decision (Art. 45, 46 GDPR).",
          "OpenAI does not use API data to train its models; data sharing for training is switched off in our account. According to OpenAI, API requests may be kept for up to 30 days to detect abuse and are deleted afterwards.",
          "We never send OpenAI your name or email – only the resized photo without metadata and the five shooting values. The AI is instructed not to name people, places, addresses or licence plates.",
        ],
      },
      {
        titel: "5. Other service providers",
        absaetze: [],
        punkte: [
          "Cloudflare, Inc. – runs the app and the lens-gate server (Cloudflare Workers). [check data processing agreement]",
          "Supabase, Inc. – database for account, consent and reviews. [add server region of the “Web Login” project; check data processing agreement]",
          "Digistore24 – only if you buy a product (e.g. the MemberAbo); the ProPhotoSkills privacy policy applies.",
        ],
      },
      {
        titel: "6. Legal bases",
        absaetze: [],
        punkte: [
          "Account, storing reviews, quota: performance of the user agreement (Art. 6(1)(b) GDPR).",
          "Sending your photo to OpenAI for the review: your consent (Art. 6(1)(a) GDPR), given before your first photo and revocable at any time.",
          "Proof of consent and security of the service: legitimate interest (Art. 6(1)(f) GDPR).",
        ],
      },
      {
        titel: "7. How long we keep data",
        absaetze: [
          "Reviews and thumbnails are kept until you delete them or your account is deleted. Monthly counts and proof of consent are kept until your account is deleted. Deleting your account deletes all PPS Lens data. [confirm retention with a lawyer]",
        ],
      },
      {
        titel: "8. Your rights – right in the app",
        absaetze: [],
        punkte: [
          "Access and portability (Art. 15, 20 GDPR): “Download my data” in your history gives you everything PPS Lens stores about you as a file.",
          "Erasure (Art. 17 GDPR): delete single or all reviews in your history. We delete your whole account on request to support@prophotoskills.com.",
          "Withdrawal (Art. 7(3) GDPR): “Withdraw consent” in your history. No more photos are sent to OpenAI afterwards; earlier processing remains lawful.",
          "Rectification, restriction, objection (Art. 16, 18, 21 GDPR): email support@prophotoskills.com.",
          "Complaint to a data protection authority, e.g. the Spanish Agencia Española de Protección de Datos (aepd.es) or the authority in your country.",
        ],
      },
      {
        titel: "9. No automated decision-making",
        absaetze: ["The review is AI learning feedback on your photo. It has no legal or similarly significant effect on you (Art. 22 GDPR)."],
      },
    ],
  },
};

export const NUTZUNG: Record<"de" | "en", Rechtstext> = {
  de: {
    titel: "Nutzungsbedingungen PPS Lens",
    einleitung: "Diese Bedingungen gelten für die Nutzung von PPS Lens, dem KI-Foto-Coach von ProPhotoSkills.",
    abschnitte: [
      {
        titel: "1. Anbieter",
        absaetze: ["PPS Lens wird vom Betreiber von ProPhotoSkills angeboten (siehe Impressum)."],
      },
      {
        titel: "2. Was PPS Lens leistet",
        absaetze: [
          "PPS Lens bewertet Fotos, die du hochlädst, mit Hilfe künstlicher Intelligenz und gibt dir Punktzahlen, Erklärungen und Tipps für deine nächsten Aufnahmen.",
          "Mit einem kostenlosen Konto sind 3 Bewertungen pro Kalendermonat enthalten, mit dem ProPhotoSkills-MemberAbo 300. Nicht genutzte Bewertungen verfallen am Monatsende. Wir bemühen uns um eine ständige Verfügbarkeit, können sie aber nicht garantieren. [Kontingente und Leistungsbeschreibung mit dem MemberAbo abgleichen]",
        ],
      },
      {
        titel: "3. Dein Konto",
        absaetze: [
          "Für PPS Lens brauchst du ein ProPhotoSkills-Konto. Halte dein Passwort geheim. Du musst mindestens 16 Jahre alt sein oder die Zustimmung deiner Eltern haben. [Mindestalter prüfen]",
        ],
      },
      {
        titel: "4. Deine Fotos und deine Rechte",
        absaetze: ["Mit jedem Foto bestätigst du, dass"],
        punkte: [
          "du die Rechte an dem Foto hast (in der Regel: du hast es selbst aufgenommen),",
          "erkennbare Personen auf dem Foto mit der Bewertung einverstanden sind,",
          "das Foto keine rechtswidrigen Inhalte zeigt und keine Rechte Dritter verletzt.",
        ],
      },
      {
        titel: "5. Nutzungsrecht",
        absaetze: [
          "Deine Fotos bleiben deine Fotos. Du räumst uns nur ein einfaches, nicht übertragbares, unentgeltliches Recht ein, das Foto zu verarbeiten, soweit es für die Bewertung nötig ist – einschließlich der Weitergabe an unseren KI-Dienstleister OpenAI zu diesem Zweck.",
          "Wir veröffentlichen deine Fotos nicht, geben sie nicht an andere weiter und nutzen sie nicht zum Training von KI-Modellen. Das Recht endet, sobald die Bewertung abgeschlossen ist; ein Vorschaubild, das du speichern lässt, behalten wir nur, bis du es löschst.",
        ],
      },
      {
        titel: "6. Hinweis zur KI",
        absaetze: [
          "Die Bewertungen werden von einer KI erzeugt (derzeit ein Modell von OpenAI) und sind als solche gekennzeichnet. Sie sind ein Lern-Feedback, kein Gutachten: Sie können ungenau oder falsch sein, und Markierungen im Foto zeigen nur ungefähre Stellen. Verlass dich bei wichtigen Entscheidungen nicht allein darauf.",
        ],
      },
      {
        titel: "7. Haftung",
        absaetze: [
          "Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper und Gesundheit. Im Übrigen haften wir nur für die Verletzung wesentlicher Pflichten und begrenzt auf den typischen, vorhersehbaren Schaden. [Haftungsregel anwaltlich prüfen]",
        ],
      },
      {
        titel: "8. Ende der Nutzung",
        absaetze: [
          "Du kannst PPS Lens jederzeit nicht mehr nutzen, deine Bewertungen löschen und die Löschung deines Kontos verlangen. Bei Verstößen gegen diese Bedingungen dürfen wir den Zugang sperren.",
        ],
      },
      {
        titel: "9. Änderungen und Recht",
        absaetze: [
          "Ändern sich diese Bedingungen, informieren wir dich in der App. Es gilt das Recht des Landes, in dem der Anbieter seinen Sitz hat; zwingende Verbraucherschutzvorschriften deines Wohnsitzlandes bleiben unberührt. [Rechtswahl anwaltlich prüfen]",
        ],
      },
    ],
  },
  en: {
    titel: "PPS Lens terms of use",
    einleitung: "These terms apply to the use of PPS Lens, the AI photo coach by ProPhotoSkills.",
    abschnitte: [
      { titel: "1. Provider", absaetze: ["PPS Lens is offered by the operator of ProPhotoSkills (see site notice)."] },
      {
        titel: "2. What PPS Lens does",
        absaetze: [
          "PPS Lens reviews photos you upload using artificial intelligence and gives you scores, explanations and tips for your next shots.",
          "A free account includes 3 reviews per calendar month, the ProPhotoSkills MemberAbo 300. Unused reviews expire at the end of the month. We aim for constant availability but cannot guarantee it. [align quotas with the MemberAbo]",
        ],
      },
      {
        titel: "3. Your account",
        absaetze: ["You need a ProPhotoSkills account. Keep your password secret. You must be at least 16 or have your parents' consent. [check minimum age]"],
      },
      {
        titel: "4. Your photos and your rights",
        absaetze: ["With every photo you confirm that"],
        punkte: [
          "you hold the rights to the photo (usually: you took it yourself),",
          "recognisable people in the photo agree to the review,",
          "the photo shows no unlawful content and does not infringe anyone's rights.",
        ],
      },
      {
        titel: "5. Licence",
        absaetze: [
          "Your photos remain yours. You only grant us a simple, non-transferable, free right to process the photo as far as needed for the review – including passing it to our AI provider OpenAI for that purpose.",
          "We do not publish your photos, share them with others or use them to train AI models. The right ends once the review is complete; a thumbnail you choose to save is kept only until you delete it.",
        ],
      },
      {
        titel: "6. About the AI",
        absaetze: [
          "Reviews are generated by AI (currently a model by OpenAI) and labelled as such. They are learning feedback, not an expert appraisal: they can be inaccurate or wrong, and markers on the photo show approximate spots only. Do not rely on them alone for important decisions.",
        ],
      },
      {
        titel: "7. Liability",
        absaetze: [
          "We are liable without limitation for intent and gross negligence and for injury to life, body or health. Otherwise we are liable only for breach of essential obligations, limited to typical, foreseeable damage. [have liability reviewed by a lawyer]",
        ],
      },
      {
        titel: "8. Ending use",
        absaetze: ["You can stop using PPS Lens at any time, delete your reviews and request deletion of your account. We may block access for breaches of these terms."],
      },
      {
        titel: "9. Changes and law",
        absaetze: [
          "If these terms change, we will inform you in the app. The law of the provider's country applies; mandatory consumer protection rules of your country of residence remain unaffected. [have choice of law reviewed]",
        ],
      },
    ],
  },
};
