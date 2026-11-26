import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Download, ImageOff, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Bewertung, FotoBuehne, fmt1, HistogrammKarte, Ring } from "@/components/ergebnis";
import { SkillRadar } from "@/components/radar";
import { KARTE, Rahmen } from "@/components/rahmen";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { ladeExport, ladeVerlauf, loescheAlle, loescheBewertung, setzeEinwilligung, speichereJson, type VerlaufEintrag } from "@/lib/lens";
import { useStand } from "@/lib/stand";

// Verlauf + „Deine Daten“ (Datenschutz-Konzept: Löschen Art. 17, Auskunft/Export Art. 15/20, Widerruf der Einwilligung).
// ?id=… zeigt eine Bewertung im Detail (ohne Foto – das wird nie gespeichert; nur das Vorschaubild, falls gewünscht).
export const Route = createFileRoute("/verlauf")({
  head: () => ({ meta: [{ title: "PPS Lens – Verlauf" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : undefined }),
  component: Verlauf,
});

function Verlauf() {
  const { t, lang } = useI18n();
  const { bereit, session } = useAuth();
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const [liste, setListe] = useState<VerlaufEintrag[] | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);

  const laden = useCallback(async () => {
    const r = await ladeVerlauf();
    if (r.daten) {
      setListe(r.daten.analysen ?? []);
      setFehler(null);
    } else setFehler(r.status === 0 ? t("err.offline") : r.status === 401 ? t("err.login") : t("err.generic", { f: r.fehler ?? "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bereit && session) void laden();
  }, [bereit, session?.user.id, laden]);

  if (bereit && !session) {
    return (
      <Rahmen>
        <div className={`${KARTE} max-w-md p-6 text-sm text-stone-700`}>
          {t("err.login")}{" "}
          <Link to="/anmelden" search={{ weiter: undefined }} className="font-semibold underline">
            {t("auth.login")}
          </Link>
        </div>
      </Rahmen>
    );
  }

  const datum = (s: string) =>
    new Date(s).toLocaleString(lang, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  async function eineLoeschen(eintrag: VerlaufEintrag) {
    if (!window.confirm(t("hist.deleteConfirm"))) return;
    const r = await loescheBewertung(eintrag.id);
    if (r.daten) {
      setListe((l) => (l ?? []).filter((x) => x.id !== eintrag.id));
      if (id) void navigate({ to: "/verlauf", search: { id: undefined } });
    } else setFehler(t("err.generic", { f: r.fehler ?? "" }));
  }

  const offen = id ? liste?.find((x) => x.id === id) : undefined;

  return (
    <Rahmen untertitel={offen ? undefined : t("hist.sub")}>
      {fehler && <p className={`${KARTE} mb-5 p-4 text-sm text-red-700`}>{fehler}</p>}

      {offen ? (
        <div className="space-y-4">
          <Link
            to="/verlauf"
            search={{ id: undefined }}
            className="inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-1.5 text-sm font-semibold text-stone-800 shadow-sm hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" /> {t("hist.back")}
          </Link>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="min-w-0 space-y-4 lg:col-span-2">
              <FotoBuehne src={offen.thumb ?? null} titel={offen.ergebnis.title} exif={offen.ergebnis.exif} vorschau markers={offen.ergebnis.markers} />
              <HistogrammKarte src={offen.thumb ?? null} />
              <div className={`${KARTE} flex flex-wrap items-center justify-between gap-3 p-4 text-sm text-stone-600`}>
                <span>{datum(offen.created_at)}</span>
                <button
                  type="button"
                  onClick={() => void eineLoeschen(offen)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> {t("hist.delete")}
                </button>
              </div>
            </div>
            <aside className="min-w-0 space-y-4">
              <Bewertung e={offen.ergebnis} />
            </aside>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            {!liste && !fehler && <p className={`${KARTE} p-5 text-sm text-stone-500`}>{t("hist.loading")}</p>}
            {liste && liste.length === 0 && (
              <div className={`${KARTE} p-5 text-sm text-stone-600`}>
                {t("hist.empty")}{" "}
                <Link to="/" className="font-semibold text-stone-900 underline">
                  {t("hist.toCoach")}
                </Link>
              </div>
            )}
            {liste && liste.length > 0 && (
              <ul className={`${KARTE} divide-y divide-stone-200`}>
                {liste.map((x) => (
                  <li key={x.id} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                    <Link to="/verlauf" search={{ id: x.id }} className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                      {x.thumb ? (
                        <img src={x.thumb} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" />
                      ) : (
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-400">
                          <ImageOff className="h-5 w-5" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-stone-900">{x.ergebnis?.title ?? x.titel}</span>
                        <span className="block text-xs text-stone-500">{datum(x.created_at)}</span>
                        <span className="mt-1 hidden gap-3 font-mono text-[11px] text-stone-500 sm:flex">
                          <span>{t("cat.comp").split(" ")[0]} {fmt1(Number(x.bildaufbau ?? 0))}</span>
                          <span>{t("cat.light").split(" ")[0]} {fmt1(Number(x.licht ?? 0))}</span>
                          <span>{t("cat.sharp").split(" ")[0]} {fmt1(Number(x.schaerfe ?? 0))}</span>
                          <span>{t("cat.color").split(" ")[0]} {fmt1(Number(x.farbe ?? 0))}</span>
                        </span>
                      </span>
                      <span className="relative flex shrink-0 items-center justify-center">
                        <Ring wert={Number(x.gesamt)} gross={false} />
                        <span className="absolute font-mono text-[11px] font-bold text-stone-900">{fmt1(Number(x.gesamt))}</span>
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => void eineLoeschen(x)}
                      title={t("hist.delete")}
                      aria-label={t("hist.delete")}
                      className="shrink-0 rounded-md p-2 text-stone-400 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <aside className="min-w-0 space-y-4">
            {liste && <SkillRadar liste={liste} />}
            <DeineDaten anzahl={liste?.length ?? 0} nachLoeschen={() => setListe([])} />
          </aside>
        </div>
      )}
    </Rahmen>
  );
}

function DeineDaten({ anzahl, nachLoeschen }: { anzahl: number; nachLoeschen: () => void }) {
  const { t } = useI18n();
  const { stand, setStand } = useStand();
  const [meldung, setMeldung] = useState<string | null>(null);
  const [laeuft, setLaeuft] = useState(false);
  const knopf = "inline-flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold disabled:opacity-50";

  async function exportieren() {
    setLaeuft(true);
    const r = await ladeExport();
    setLaeuft(false);
    if (r.daten) speichereJson(r.daten, `pps-lens-meine-daten-${new Date().toISOString().slice(0, 10)}.json`);
    else setMeldung(t("err.generic", { f: r.fehler ?? "" }));
  }

  async function alleLoeschen() {
    if (!window.confirm(t("data.deleteAllConfirm"))) return;
    setLaeuft(true);
    const r = await loescheAlle();
    setLaeuft(false);
    if (r.daten) {
      nachLoeschen();
      setMeldung(t("data.deleted", { n: r.daten.geloescht }));
    } else setMeldung(t("err.generic", { f: r.fehler ?? "" }));
  }

  async function widerrufen() {
    if (!window.confirm(t("data.revokeConfirm"))) return;
    setLaeuft(true);
    const r = await setzeEinwilligung(false);
    setLaeuft(false);
    if (r.daten) {
      setStand(r.daten);
      setMeldung(t("data.revoked"));
    } else setMeldung(t("err.generic", { f: r.fehler ?? "" }));
  }

  return (
    <div className={`${KARTE} space-y-4 p-5`}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">{t("data.title")}</div>
      {stand && (
        <p className="flex items-start gap-2 text-sm text-stone-700">
          {stand.einwilligung ? <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <ShieldOff className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />}
          {stand.einwilligung ? t("data.consentOn") : t("data.consentOff")}
        </p>
      )}
      <div>
        <button type="button" disabled={laeuft} onClick={() => void exportieren()} className={`${knopf} border-stone-300 bg-white text-stone-800 hover:bg-stone-100`}>
          <Download className="h-4 w-4" /> {t("data.export")}
        </button>
        <p className="mt-1 text-xs text-stone-500">{t("data.exportHint")}</p>
      </div>
      <button type="button" disabled={laeuft || anzahl === 0} onClick={() => void alleLoeschen()} className={`${knopf} border-red-200 bg-white text-red-700 hover:bg-red-50`}>
        <Trash2 className="h-4 w-4" /> {t("data.deleteAll")}
      </button>
      {stand?.einwilligung && (
        <button type="button" disabled={laeuft} onClick={() => void widerrufen()} className={`${knopf} border-stone-300 bg-white text-stone-700 hover:bg-stone-100`}>
          <ShieldOff className="h-4 w-4" /> {t("data.revoke")}
        </button>
      )}
      {meldung && <p role="status" className="rounded-md bg-stone-100 px-3 py-2 text-sm text-stone-700">{meldung}</p>}
      <p className="text-xs leading-relaxed text-stone-500">{t("data.account")}</p>
      {/* v6: Google Play – Konto-Löschung in der App erreichbar */}
      <Link to="/konto-loeschen" className={`${knopf} border-red-200 bg-white text-red-700 hover:bg-red-50`}>
        <Trash2 className="h-4 w-4" /> {t("data.deleteAccount")}
      </Link>
    </div>
  );
}
