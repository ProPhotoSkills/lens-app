// PPS Lens spricht NUR mit dem Tor lens-gate (Brain 1_web/25_lens-gate) – nie direkt mit OpenAI oder den Tabellen.
// Das Tor prüft Anmeldung, Einwilligung und Kontingent, entfernt nochmals alle Metadaten, fragt die KI
// und speichert das Ergebnis (Supabase „Web Login“, Tabellen lc_…).
//
// Adressen des Tors (lens-gate v1):
//   GET  /stand        → Plan, genutzt, Limit, Einwilligung
//   POST /einwilligung → { erteilt: true | false }
//   POST /bewerten     → Foto bewerten
//   GET  /verlauf      → letzte 50 Bewertungen (?mitBild=1 mit Vorschaubild)
//   POST /loeschen     → { id } oder { alle: true }
//   GET  /export       → alle gespeicherten Daten (Art. 15/20 DSGVO)
//
// Adresse: Build-Variable VITE_LENS_GATE_URL, sonst https://lens-gate.prophotoskills.workers.dev
// Wichtig: im Worker muss ALLOWED_ORIGINS die Adresse dieser App enthalten (z. B. https://lens.prophotoskills.workers.dev),
// sonst blockt der Browser die Antworten (CORS).

import { supabase } from "@/lib/auth";

export const GATE_URL: string = (
  (import.meta.env.VITE_LENS_GATE_URL as string | undefined) ?? "https://lens-gate.prophotoskills.workers.dev"
).replace(/\/+$/, "");

// Pro = MemberAbo (Digistore 629796) – nur im Browser zeigen, nie in einer Android-Hülle (Google-Play-Regel)
export const PRO_URL = "https://www.digistore24.com/product/629796";

export type Kat = "comp" | "light" | "sharp" | "color";
export const KATS: Kat[] = ["comp", "light", "sharp", "color"];

export type Exif = { camera: string; focal: string; aperture: string; shutter: string; iso: string };

/** optional (lens-gate ab v3): passende PPS-Lektion (öffentlicher Artikel auf prophotoskills.com) – in einer Android-Hülle ausgeblendet */
export type Lektion = { titel: string; url: string; code?: string; modul?: string; produkt?: string };
export type Tipp = { icon: string; label: string; text: string; link?: Lektion };

/** optional (lens-gate ab v3): Markierung im Foto, x/y relativ 0–1 (0/0 = oben links) */
export type Marker = { x: number; y: number; label: string; art?: "staerke" | "problem" | "hinweis"; kat?: Kat };

export type Ergebnis = {
  id?: string;
  title: string;
  exif: Exif;
  scores: Record<Kat, number> & { total: number };
  notes: Partial<Record<Kat, string>>;
  summary: string;
  tips: Tipp[];
  preset: number;
  markers?: Marker[];
  /** optional (lens-gate ab v3): ein Merksatz im PPS-Stil */
  merksatz?: string;
};

export type Stand = {
  plan: string; // "free" | "pro"
  genutzt: number;
  limit: number;
  monat: string;
  einwilligung: boolean;
  version?: string;
};

export type VerlaufEintrag = {
  id: string;
  created_at: string;
  titel: string | null;
  gesamt: number;
  bildaufbau: number | null;
  licht: number | null;
  schaerfe: number | null;
  farbe: number | null;
  ergebnis: Ergebnis;
  thumb?: string | null;
};

// Gleiche IDs und Namen wie PRESETS im Worker und im Dummy (Preset-Studio kommt später)
export const PRESETS: Record<number, string> = {
  1: "CyberRain Teal & Amber",
  2: "Golden Skin Soft Glow",
  3: "CineLog Kodak 2383",
  4: "Nordic Mist & Peaks",
  5: "Monochrome Leica Contrast",
  6: "Anamorphic Night Drift",
};

/** Antwort des Tors: status 0 = keine Verbindung */
export type Antwort<T> = { status: number; daten: T | null; fehler?: string; roh?: Record<string, unknown> };

async function token(): Promise<string | null> {
  const sb = supabase();
  if (!sb) return null;
  return (await sb.auth.getSession()).data.session?.access_token ?? null;
}

async function gate<T>(pfad: string, body?: unknown): Promise<Antwort<T>> {
  const t = await token();
  if (!t) return { status: 401, daten: null, fehler: "anmeldung" };
  try {
    const res = await fetch(`${GATE_URL}${pfad}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { Authorization: `Bearer ${t}`, ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const j = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    if (res.ok) return { status: res.status, daten: j as T };
    return { status: res.status, daten: null, fehler: typeof j?.fehler === "string" ? j.fehler : `HTTP ${res.status}`, roh: j ?? undefined };
  } catch (err) {
    console.error("[lens] Tor nicht erreichbar", err);
    return { status: 0, daten: null, fehler: "offline" };
  }
}

export const ladeStand = () => gate<Stand>("/stand");
export const setzeEinwilligung = (erteilt: boolean) => gate<Stand>("/einwilligung", { erteilt });
export const ladeVerlauf = () => gate<{ analysen: VerlaufEintrag[] }>("/verlauf?mitBild=1");
export const loescheBewertung = (id: string) => gate<{ geloescht: number }>("/loeschen", { id });
export const loescheAlle = () => gate<{ geloescht: number }>("/loeschen", { alle: true });
export const ladeExport = () => gate<Record<string, unknown>>("/export");

export type BewertenDaten = {
  bild: string;
  rechte: true;
  exif: Exif | null;
  dateiname: string;
  thumb: string;
  verlaufBild: boolean;
  sprache: string;
};
export const bewerte = (d: BewertenDaten) =>
  gate<Ergebnis & { stand: { plan: string; genutzt: number; limit: number } }>("/bewerten", d);

/** JSON als Datei herunterladen (Export „Meine Daten“) */
export function speichereJson(daten: unknown, name: string): void {
  const blob = new Blob([JSON.stringify(daten, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Markierungen absichern: nur gültige Punkte im Bild, höchstens 6 */
export function gueltigeMarker(m: unknown): Marker[] {
  if (!Array.isArray(m)) return [];
  return m
    .filter((x): x is Marker => !!x && typeof x === "object" && Number.isFinite((x as Marker).x) && Number.isFinite((x as Marker).y) && typeof (x as Marker).label === "string")
    .map((x) => ({ ...x, x: Math.min(1, Math.max(0, x.x)), y: Math.min(1, Math.max(0, x.y)), label: x.label.slice(0, 60) }))
    .slice(0, 6);
}

/** nur https-Links anzeigen */
export function sichererLink(l: Tipp["link"]): Tipp["link"] | undefined {
  if (!l || typeof l.url !== "string" || !/^https:\/\//.test(l.url)) return undefined;
  const txt = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 80) : undefined);
  return { titel: txt(l.titel) ?? l.url, url: l.url, code: txt(l.code), modul: txt(l.modul), produkt: txt(l.produkt) };
}

/** Wort zur Gesamtnote (Maßstab wie in der KI-Anweisung des Tors: 5 Handyfoto, 7 gute Amateur-Arbeit, 8,5 professionell) */
export function stufe(v: number): string {
  return v >= 9.5 ? "grade.6" : v >= 8.5 ? "grade.5" : v >= 7.5 ? "grade.4" : v >= 6.5 ? "grade.3" : v >= 5 ? "grade.2" : "grade.1";
}
