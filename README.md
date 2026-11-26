# PPS Lens – KI-Foto-Coach (Repo lens-app) · v4

Die App PPS Lens von ProPhotoSkills: Foto wählen, von der KI bewerten lassen, Verlauf ansehen.
Namen wie PPS Books: Repo **lens-app** (wie books-app), Cloudflare-Worker **lens** → https://lens.prophotoskills.workers.dev (wie books → books.prophotoskills.workers.dev). Tor = Repo/Worker **lens-gate** (wie books-gate).
Gleicher Aufbau wie PPS Books (Repo `books-app`): TanStack Start + React + Tailwind + lucide, läuft auf Cloudflare Workers.
Aussehen hell wie Books (gelber PPS-Kopf, Heli-Hintergrund, weiße Karten).

## Was die App kann (MVP)
- **Anmelden / Registrieren / Passwort vergessen** mit dem Konto aus „Web Login“ (gleiches Konto wie web und Books)
- **Einwilligung** vor dem ersten Foto (Text + Version, wird im Tor gespeichert, widerrufbar)
- **KI-Coach**: Foto wählen oder hineinziehen → EXIF wird im Browser gelesen, das Foto auf max. 1600 px **neu gezeichnet**
  (dabei fallen GPS, Seriennummer und alle anderen Metadaten weg) → erst bei „Bewerten lassen“ geht es an das Tor
- **Bildrechte** bestätigen (Pflicht), Vorschaubild im Verlauf nur auf Wunsch
- Ergebnis: Punktzahl, 4 Kategorien mit Begründung, Fazit, 3 Tipps, passender Look, Raster (Drittel-Regel, Goldener Schnitt), EXIF-Zeile
- **v2 – Grafiken**: Markierungen im Foto (Feld `markers` vom Tor ab v3, nummeriert, grün Stärke / rot Problem / gelb Hinweis),
  Histogramm und pixelgenaue Anzeige ausgefressener Lichter / abgesoffener Tiefen (im Browser berechnet),
  Note in Worten, Stärke und größter Hebel, Merksatz, Tipps mit Link zur PPS-Lektion, Skill-Radar + Notenverlauf im Verlauf
- **Kontingent**: Free 3 / Pro 300 im Monat (aus dem Tor), Upgrade-Link MemberAbo nur im Browser
- **Verlauf**: Liste, Detail, einzeln löschen, alle löschen, **Meine Daten herunterladen** (JSON), Einwilligung widerrufen
- 8 Flaggen: KI antwortet in allen 8 Sprachen; App-Texte vorerst Deutsch + Englisch (andere zeigen Englisch)

Noch nicht: Presets, Community/Challenges, Lernpfade, Android-Hülle.

## Hängt ab von
- Tor **lens-gate** (Brain `1_web/25_lens-gate`): Build-Variable `VITE_LENS_GATE_URL`, sonst https://lens-gate.prophotoskills.workers.dev
  Im Worker muss `ALLOWED_ORIGINS` die Adresse dieser App enthalten (z. B. `https://lens.prophotoskills.workers.dev,http://localhost:5173`).
- Supabase „Web Login“: Adresse der App als Redirect-URL eintragen (Authentication → URL Configuration).

## Google-Play-Regel (wie Books)
In einer späteren Android-Hülle kein Kaufknopf und keine Links zu Digistore – der MemberAbo-Link erscheint nur im Browser.

## Befehle
- `npm install` – einmal
- `npm run dev` – lokal ansehen (http://localhost:5173)
- `npm run build` – so baut auch Cloudflare
