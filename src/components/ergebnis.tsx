// Anzeige einer KI-Bewertung – nach DUMMY_pps-lens_v2.html (Tab „KI-Foto-Coach“), im hellen Books-Look
// (Eric 26.11.: „hell“). lens v2 (Eric 26.11.: „grafische Elemente, wo wir etwas zeigen können“):
//   - Kopf mit Note in Worten, Stärke + größter Hebel
//   - Markierungen direkt im Foto (Feld markers vom Tor, optional)
//   - Histogramm, im Browser berechnet
//   - Tipps nummeriert, optional mit Link (Books-Kapitel / Artikel) – in einer Android-Hülle ohne Link
// Font-Awesome-Namen aus dem Tor (tips[].icon = fa-…) werden auf lucide umgesetzt.
import {
  Aperture, ArrowUpRight, Flag, BookOpen, Bot, Camera, CircleDot, Compass, Contrast, Crop, Eye, Filter, Footprints, Gauge, Grid3x3,
  Layers, Lightbulb, MapPin, Moon, Palette, Quote, Ruler, SlidersHorizontal, Sun, Target, Timer, TrendingUp, Trophy, type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { KARTE } from "@/components/rahmen";
import { ANDROID_OHNE } from "@/lib/android-schalter";
import { useNurImBrowser } from "@/lib/app-umgebung";
import { berechneHistogramm, clippingMaske, type Histogramm } from "@/lib/histogramm";
import { useI18n } from "@/lib/i18n";
import { gueltigeMarker, KATS, PRESETS, sichererLink, stufe, type Ergebnis, type Exif, type Kat, type Marker } from "@/lib/lens";

const ICONS: Record<string, LucideIcon> = {
  "fa-sun": Sun, "fa-moon": Moon, "fa-table-cells": Grid3x3, "fa-circle-half-stroke": Contrast, "fa-palette": Palette,
  "fa-bullseye": Target, "fa-eye": Eye, "fa-sliders": SlidersHorizontal, "fa-shoe-prints": Footprints, "fa-crop-simple": Crop,
  "fa-stopwatch": Timer, "fa-layer-group": Layers, "fa-compass": Compass, "fa-filter": Filter, "fa-lightbulb": Lightbulb,
};

export const fmt1 = (v: number) => (Math.round(v * 10) / 10).toFixed(1);
const UEBER = "text-[11px] font-semibold uppercase tracking-wider text-stone-500";

/** Farbe nach Note – gleiche Stufen überall (Balken, Ring, Radar) */
export function notenFarbe(v: number): string {
  return v >= 8.5 ? "#059669" : v >= 7.5 ? "#65a30d" : v >= 6.5 ? "#d97706" : v >= 5 ? "#ea580c" : "#e11d48";
}

export function Ring({ wert, gross = true }: { wert: number; gross?: boolean }) {
  const r = 26;
  const C = 2 * Math.PI * r;
  const off = C * (1 - Math.max(0, Math.min(10, wert)) / 10);
  return (
    <svg viewBox="0 0 64 64" className={`${gross ? "h-20 w-20" : "h-10 w-10"} -rotate-90`} aria-hidden="true">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#e7e5e4" strokeWidth="6" />
      <circle cx="32" cy="32" r={r} fill="none" stroke={notenFarbe(wert)} strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} />
    </svg>
  );
}

/** Rechte Spalte: Note, Kategorien, Fazit, Tipps, Look */
export function Bewertung({ e }: { e: Ergebnis }) {
  const { t } = useI18n();
  const linksErlaubt = useNurImBrowser() || !ANDROID_OHNE.lektionLinks;
  const sortiert = [...KATS].sort((a, b) => e.scores[b] - e.scores[a]);
  const beste = sortiert[0];
  const schwaechste = sortiert[sortiert.length - 1];
  return (
    <div className="space-y-4">
      <div className={`${KARTE} overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 p-5">
          <div>
            <div className={UEBER}>{t("score.index")}</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-mono text-5xl font-bold text-stone-900">{fmt1(e.scores.total)}</span>
              <span className="font-mono text-stone-400">/ 10</span>
            </div>
            <div className="mt-1 text-sm font-semibold" style={{ color: notenFarbe(e.scores.total) }}>
              {t(stufe(e.scores.total))}
            </div>
          </div>
          <Ring wert={e.scores.total} />
        </div>
        <div className="grid grid-cols-2 border-t border-stone-200 text-xs">
          <div className="flex items-start gap-2 p-3">
            <Trophy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <div>
              <div className="text-stone-500">{t("score.strength")}</div>
              <div className="font-semibold text-stone-900">{t(`cat.${beste}`).split(" &")[0]}</div>
            </div>
          </div>
          <div className="flex items-start gap-2 border-l border-stone-200 p-3">
            <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
            <div>
              <div className="text-stone-500">{t("score.lever")}</div>
              <div className="font-semibold text-stone-900">{t(`cat.${schwaechste}`).split(" &")[0]}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${KARTE} space-y-4 p-5`}>
        {KATS.map((k) => (
          <KategorieZeile key={k} k={k} wert={e.scores[k]} notiz={e.notes?.[k]} />
        ))}
      </div>

      <div className={`${KARTE} space-y-2 p-5`}>
        <div className={`flex items-center gap-2 ${UEBER}`}>
          <Bot className="h-4 w-4" /> {t("score.summary")}
        </div>
        <p className="text-sm leading-relaxed text-stone-700">{e.summary}</p>
        {e.merksatz && (
          <blockquote className="mt-3 flex gap-2 rounded-md border-l-4 border-[#f8e800] bg-[#fffbd1] px-3 py-2 text-sm font-medium italic text-stone-800">
            <Quote className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
            {e.merksatz}
          </blockquote>
        )}
      </div>

      <div className={`${KARTE} space-y-3 p-5`}>
        <div className={UEBER}>{t("score.tips")}</div>
        {e.tips.map((tip, i) => {
          const Icon = ICONS[tip.icon] ?? Lightbulb;
          const link = linksErlaubt ? sichererLink(tip.link) : undefined;
          return (
            <div key={i} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-start gap-3">
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f8e800]">
                  <Icon className="h-4 w-4 text-stone-900" />
                  <span className="absolute -left-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-[9px] font-bold text-white">{i + 1}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-stone-900">{tip.label}</div>
                  <p className="text-sm leading-relaxed text-stone-700">{tip.text}</p>
                  {link && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 flex items-center gap-2 rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs hover:border-stone-400"
                    >
                      <BookOpen className="h-3.5 w-3.5 shrink-0 text-stone-500" />
                      <span className="min-w-0">
                        <span className="block text-[10px] uppercase tracking-wider text-stone-500">
                          {t("tip.lesson")}{link.produkt ? ` · ${link.produkt}` : ""}{link.modul ? ` · ${link.modul}` : ""}
                        </span>
                        <span className="block font-semibold leading-snug text-stone-900">{link.titel}</span>
                      </span>
                      <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-stone-500" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {PRESETS[e.preset] && (
        <div className="rounded-xl border border-stone-300 bg-[#fffbd1]/95 p-5 shadow-lg">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-stone-600">{t("score.preset")}</div>
          <div className="font-bold text-stone-900">{PRESETS[e.preset]}</div>
          <p className="mt-1 text-xs text-stone-600">{t("score.presetSoon")}</p>
        </div>
      )}

      {/* v6: Google Play (KI-Inhalte) – Nutzer müssen eine KI-Antwort melden können */}
      <a
        href={`mailto:support@prophotoskills.com?subject=${encodeURIComponent(t("report.subject"))}&body=${encodeURIComponent(t("report.body", { id: e.id ?? "-" }))}`}
        className="inline-flex items-center gap-1.5 text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800"
      >
        <Flag className="h-3.5 w-3.5" /> {t("report.link")}
      </a>
    </div>
  );
}

function KategorieZeile({ k, wert, notiz }: { k: Kat; wert: number; notiz?: string }) {
  const { t } = useI18n();
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-stone-700">{t(`cat.${k}`)}</span>
        <span className="font-mono font-semibold text-stone-900">{fmt1(wert)}</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-stone-200">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${wert * 10}%`, backgroundColor: notenFarbe(wert) }} />
        {/* Marken bei 5 / 7 / 8,5 = Handyfoto / Amateur / Profi */}
        {[50, 70, 85].map((p) => (
          <span key={p} className="absolute top-0 h-full w-px bg-white/80" style={{ left: `${p}%` }} />
        ))}
      </div>
      {notiz && <p className="mt-1 text-[12px] leading-snug text-stone-500">{notiz}</p>}
    </div>
  );
}

/** Histogramm-Karte: Helligkeit als Fläche, R/G/B als Linien, Hinweise auf ausgefressene Lichter / abgesoffene Tiefen */
export function HistogrammKarte({ src }: { src: string | null }) {
  const { t } = useI18n();
  const [h, setH] = useState<Histogramm | null>(null);
  useEffect(() => {
    setH(null);
    if (!src) return;
    let aktiv = true;
    berechneHistogramm(src)
      .then((x) => aktiv && setH(x))
      .catch((err) => console.warn("[lens] Histogramm", err));
    return () => {
      aktiv = false;
    };
  }, [src]);
  if (!src || !h) return null;
  const W = 256, H = 80;
  // Wurzel-Skala: sonst drückt ein einziger Spitzenwert (z. B. reines Weiß) alles andere platt
  const pfad = (a: number[], zu: boolean) => {
    const pts = a.map((v, i) => `${((i + 0.5) / a.length) * W},${H - Math.sqrt(v) * (H - 4)}`);
    return zu ? `M0,${H} L${pts.join(" L")} L${W},${H} Z` : `M${pts.join(" L")}`;
  };
  const prozent = (v: number) => `${(v * 100).toFixed(1).replace(".", ",")} %`;
  const warnLichter = h.lichter > 0.01;
  const warnTiefen = h.tiefen > 0.03;
  return (
    <div className={`${KARTE} p-5`}>
      <div className="flex items-baseline justify-between gap-2">
        <div className={UEBER}>{t("histo.title")}</div>
        <div className="text-[10px] text-stone-400">{t("histo.local")}</div>
      </div>
      <div className="mt-3 overflow-hidden rounded-md bg-stone-900">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-24 w-full" aria-label={t("histo.title")}>
          {[0.25, 0.5, 0.75].map((p) => (
            <line key={p} x1={W * p} y1="0" x2={W * p} y2={H} stroke="rgba(255,255,255,.12)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={pfad(h.l, true)} fill="rgba(255,255,255,.28)" />
          <path d={pfad(h.r, false)} fill="none" stroke="#f87171" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <path d={pfad(h.g, false)} fill="none" stroke="#4ade80" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <path d={pfad(h.b, false)} fill="none" stroke="#60a5fa" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          {warnTiefen && <rect x="0" y="0" width="5" height={H} fill="#60a5fa" />}
          {warnLichter && <rect x={W - 5} y="0" width="5" height={H} fill="#f87171" />}
        </svg>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-stone-400">
        <span>{t("histo.dark")}</span>
        <span>{t("histo.bright")}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <Kennzahl titel={t("histo.shadows")} wert={prozent(h.tiefen)} warn={warnTiefen} />
        <Kennzahl titel={t("histo.mean")} wert={`${Math.round(h.mittel * 100)} %`} />
        <Kennzahl titel={t("histo.highlights")} wert={prozent(h.lichter)} warn={warnLichter} />
      </div>
      {(warnLichter || warnTiefen) && (
        <p className="mt-3 text-xs leading-snug text-stone-600">
          {warnLichter && t("histo.warnHighlights")} {warnTiefen && t("histo.warnShadows")}
        </p>
      )}
    </div>
  );
}

function Kennzahl({ titel, wert, warn }: { titel: string; wert: string; warn?: boolean }) {
  return (
    <div className={`rounded-md border px-2 py-1.5 ${warn ? "border-rose-200 bg-rose-50" : "border-stone-200 bg-stone-50"}`}>
      <div className="text-[10px] text-stone-500">{titel}</div>
      <div className={`font-mono font-semibold ${warn ? "text-rose-700" : "text-stone-900"}`}>{wert}</div>
    </div>
  );
}

type Raster = "off" | "thirds" | "golden";

const MARKER_FARBE: Record<string, string> = { staerke: "#059669", problem: "#e11d48", hinweis: "#d97706" };

/** Foto mit Markierungen, Kompositions-Raster und EXIF-Zeile.
 *  vorschau = nur das kleine 96-px-Vorschaubild aus dem Verlauf (wird größer, aber unscharf gezeigt) */
export function FotoBuehne({
  src, titel, exif, laeuft, vorschau, markers,
}: { src: string | null; titel: string; exif: Exif | null; laeuft?: boolean; vorschau?: boolean; markers?: Marker[] }) {
  const { t } = useI18n();
  const [raster, setRaster] = useState<Raster>("off");
  const punkte = gueltigeMarker(markers);
  const [zeigeMarker, setZeigeMarker] = useState(true);
  const [clipping, setClipping] = useState(false);
  const [maske, setMaske] = useState<string | null>(null);
  useEffect(() => {
    setMaske(null);
    if (!clipping || !src) return;
    let aktiv = true;
    clippingMaske(src).then((m) => aktiv && setMaske(m)).catch((err) => console.warn("[lens] Clipping", err));
    return () => {
      aktiv = false;
    };
  }, [clipping, src]);
  const x = exif;
  const zellen: [LucideIcon, string, string | undefined][] = [
    [Camera, t("exif.camera"), x ? x.camera : t("coach.noExif")],
    [Ruler, t("exif.focal"), x?.focal],
    [Aperture, t("exif.aperture"), x?.aperture],
    [Timer, t("exif.shutter"), x?.shutter],
    [Gauge, t("exif.iso"), x?.iso],
  ];
  const knopf = (an: boolean) =>
    `rounded-md border px-2.5 py-1.5 text-xs font-medium ${an ? "border-stone-800 bg-stone-800 text-white" : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"}`;
  return (
    <div className={`${KARTE} overflow-hidden`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 px-4 py-3">
        <h2 className="min-w-0 truncate text-sm font-semibold text-stone-900">{titel}</h2>
        {src && (
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t("overlay.label")}>
            {punkte.length > 0 && (
              <button type="button" aria-pressed={zeigeMarker} onClick={() => setZeigeMarker(!zeigeMarker)} className={`${knopf(zeigeMarker)} inline-flex items-center gap-1`}>
                <MapPin className="h-3 w-3" /> {t("markers.label")}
              </button>
            )}
            {!vorschau && (
              <button type="button" aria-pressed={clipping} onClick={() => setClipping(!clipping)} className={`${knopf(clipping)} inline-flex items-center gap-1`} title={t("clip.hint")}>
                <Contrast className="h-3 w-3" /> {t("clip.label")}
              </button>
            )}
            <span className="ml-1 mr-0.5 hidden text-[11px] text-stone-500 sm:inline">{t("overlay.label")}</span>
            {(["off", "thirds", "golden"] as Raster[]).map((r) => (
              <button key={r} type="button" aria-pressed={raster === r} onClick={() => setRaster(r)} className={knopf(raster === r)}>
                {t(`overlay.${r}`)}
              </button>
            ))}
          </div>
        )}
      </div>
      {src && (
        <div className="flex justify-center bg-stone-900">
          <div className="relative inline-block">
            <img src={src} alt={titel} className={vorschau ? "block h-56 w-auto max-w-full sm:h-72" : "block max-h-[62vh] w-auto max-w-full"} />
            {clipping && maske && <img src={maske} alt="" className="pointer-events-none absolute inset-0 h-full w-full" />}
            {raster === "thirds" && (
              <svg viewBox="0 0 300 300" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                <g stroke="rgba(255,255,255,.7)" strokeWidth="1" vectorEffect="non-scaling-stroke">
                  {[100, 200].map((p) => (
                    <g key={p}>
                      <line x1={p} y1="0" x2={p} y2="300" vectorEffect="non-scaling-stroke" />
                      <line x1="0" y1={p} x2="300" y2={p} vectorEffect="non-scaling-stroke" />
                    </g>
                  ))}
                </g>
                {[[100, 100], [200, 100], [100, 200], [200, 200]].map(([cx, cy]) => (
                  <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx="4" ry="4" fill="rgba(248,232,0,.35)" stroke="#f8e800" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
            )}
            {raster === "golden" && (
              <svg viewBox="0 0 1618 1000" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                <g fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.5">
                  <line x1="618" y1="0" x2="618" y2="1000" vectorEffect="non-scaling-stroke" />
                  <line x1="1000" y1="0" x2="1000" y2="1000" vectorEffect="non-scaling-stroke" />
                  <line x1="0" y1="382" x2="1618" y2="382" vectorEffect="non-scaling-stroke" />
                  <line x1="0" y1="618" x2="1618" y2="618" vectorEffect="non-scaling-stroke" />
                </g>
                <path
                  d="M1618,1000 A1000,1000 0 0 1 618,0 M618,0 A618,618 0 0 1 1236,618 M1236,618 A382,382 0 0 1 854,1000 M854,1000 A236,236 0 0 1 618,764 M618,764 A146,146 0 0 1 764,618 M764,618 A90,90 0 0 1 854,708"
                  fill="none" stroke="#f8e800" strokeWidth="2" vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}
            {zeigeMarker &&
              punkte.map((m, i) => (
                <div
                  key={i}
                  className="pointer-events-none absolute"
                  style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%`, transform: "translate(-50%, -50%)" }}
                >
                  <span
                    className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-lg"
                    style={{ backgroundColor: MARKER_FARBE[m.art ?? "hinweis"] ?? MARKER_FARBE.hinweis }}
                  >
                    {i + 1}
                    <span className="absolute inset-0 animate-ping rounded-full opacity-30" style={{ backgroundColor: MARKER_FARBE[m.art ?? "hinweis"] }} />
                  </span>
                  <span
                    className={`absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded bg-black/75 px-2 py-0.5 text-[11px] font-medium text-white sm:block ${
                      m.x > 0.6 ? "right-9" : "left-9"
                    }`}
                  >
                    {m.label}
                  </span>
                </div>
              ))}
            {laeuft && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-stone-800 shadow">
                  <CircleDot className="h-4 w-4 animate-pulse" /> {t("coach.rating")}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {clipping && (
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-stone-200 px-4 py-2 text-xs text-stone-600">
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-rose-500" /> {t("histo.highlights")}</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-blue-500" /> {t("histo.shadows")}</span>
        </p>
      )}
      {zeigeMarker && punkte.length > 0 && (
        <ol className="grid grid-cols-1 gap-x-4 gap-y-1.5 border-t border-stone-200 px-4 py-3 text-sm sm:grid-cols-2">
          {punkte.map((m, i) => (
            <li key={i} className="flex items-center gap-2 text-stone-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: MARKER_FARBE[m.art ?? "hinweis"] ?? MARKER_FARBE.hinweis }}>
                {i + 1}
              </span>
              <span className="min-w-0">{m.label}</span>
            </li>
          ))}
        </ol>
      )}
      {(src || exif) && (
        <div className="grid grid-cols-2 border-t border-stone-200 sm:grid-cols-5">
          {zellen.map(([Icon, l, v], i) => (
            <div key={l} className={`px-4 py-3 ${i % 2 === 1 ? "border-l" : ""} ${i > 1 ? "border-t sm:border-t-0" : ""} ${i > 0 ? "sm:border-l" : ""} border-stone-200 ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-stone-500">
                <Icon className="h-3 w-3" /> {l}
              </div>
              <div className="mt-0.5 truncate font-mono text-sm text-stone-900">{v || "–"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
