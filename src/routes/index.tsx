import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ImagePlus, RotateCcw, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

import { Bewertung, FotoBuehne, HistogrammKarte } from "@/components/ergebnis";
import { EinwilligungKarte, Kontingent, KontingentKarte } from "@/components/hinweise";
import { Installieren } from "@/components/installieren";
import { KARTE, Rahmen } from "@/components/rahmen";
import { useAuth } from "@/lib/auth";
import { istBild, vorbereiten, type Vorbereitet } from "@/lib/bild";
import { useI18n } from "@/lib/i18n";
import { bewerte, type Ergebnis } from "@/lib/lens";
import { useStand } from "@/lib/stand";

// Startseite: nicht angemeldet → kurze Vorstellung + Anmelden/Registrieren · angemeldet → KI-Foto-Coach
// (Tab „KI-Foto-Coach“ aus DUMMY_pps-lens_v2.html; Beispielbilder, Portfolio-Knopf und Challenge-Knopf entfallen im MVP)
export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "PPS Lens – KI-Foto-Coach" }] }),
  component: Start,
});

function Start() {
  const { t } = useI18n();
  const { bereit, session } = useAuth();
  if (bereit && session) return <Coach />;
  return (
    <Rahmen untertitel={t("start.sub")}>
      {bereit && (
        <div className={`${KARTE} max-w-xl p-6 sm:p-8`}>
          <ul className="space-y-3">
            {["start.p1", "start.p2", "start.p3"].map((k) => (
              <li key={k} className="flex items-start gap-2.5 text-sm text-stone-800">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f8e800]">
                  <Check className="h-3 w-3 text-stone-900" />
                </span>
                {t(k)}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-stone-500">{t("start.plans")}</p>
          <div className="mt-3">
            <Installieren />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/anmelden" search={{ weiter: undefined }} className="inline-flex items-center rounded-md bg-stone-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-700">
              {t("auth.login")}
            </Link>
            <Link to="/registrieren" search={{ weiter: undefined }} className="inline-flex items-center rounded-md border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-100">
              {t("auth.register")}
            </Link>
          </div>
        </div>
      )}
    </Rahmen>
  );
}

type Meldung = { art: "fehler" | "ok"; text: string } | { art: "kontingent"; limit: number };

function Coach() {
  const { t, lang } = useI18n();
  const { abmelden } = useAuth();
  const { stand, fehler: standFehler, laden, setStand } = useStand();
  const eingabe = useRef<HTMLInputElement>(null);
  const [foto, setFoto] = useState<Vorbereitet | null>(null);
  const [liest, setLiest] = useState(false);
  const [rechte, setRechte] = useState(false);
  const [thumbMerken, setThumbMerken] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [ergebnis, setErgebnis] = useState<Ergebnis | null>(null);
  const [meldung, setMeldung] = useState<Meldung | null>(null);
  const [ziehen, setZiehen] = useState(false);

  const einwilligung = !!stand?.einwilligung;
  const leer = !!stand && stand.genutzt >= stand.limit; // Kontingent für diesen Monat aufgebraucht

  async function waehle(f: File | undefined) {
    if (!f) return;
    setMeldung(null);
    setErgebnis(null);
    if (!istBild(f)) return setMeldung({ art: "fehler", text: t("err.notImage") });
    setLiest(true);
    try {
      setFoto(await vorbereiten(f));
      setRechte(false);
    } catch (err) {
      console.warn(err);
      setFoto(null);
      setMeldung({ art: "fehler", text: t("err.format") });
    } finally {
      setLiest(false);
      if (eingabe.current) eingabe.current.value = "";
    }
  }

  async function bewerten() {
    if (!foto || !rechte) return;
    setLaeuft(true);
    setMeldung(null);
    const r = await bewerte({
      bild: foto.bild,
      rechte: true,
      exif: foto.exif,
      dateiname: foto.name,
      thumb: foto.thumb,
      verlaufBild: thumbMerken,
      sprache: lang,
    });
    setLaeuft(false);
    if (r.daten) {
      const { stand: neu, ...e } = r.daten;
      setErgebnis(e);
      if (stand) setStand({ ...stand, ...neu });
      setMeldung({ art: "ok", text: t("coach.done") });
      return;
    }
    const roh = r.roh ?? {};
    if (r.status === 402) {
      setMeldung({ art: "kontingent", limit: Number(roh.limit ?? stand?.limit ?? 3) });
      void laden();
    } else if (r.status === 428) void laden(); // zeigt die Einwilligung wieder
    else if (r.status === 422) setMeldung({ art: "fehler", text: t("err.kein_foto") });
    else if (r.status === 401) {
      setMeldung({ art: "fehler", text: t("err.login") });
      await abmelden();
    } else if (r.status === 0) setMeldung({ art: "fehler", text: t("err.offline") });
    else setMeldung({ art: "fehler", text: t("err.generic", { f: String(roh.hinweis ?? r.fehler ?? r.status) }) });
  }

  function neu() {
    setFoto(null);
    setErgebnis(null);
    setMeldung(null);
    eingabe.current?.click();
  }

  const titel = ergebnis?.title ?? foto?.name ?? t("coach.pick");

  return (
    <Rahmen>
      {/* v9: Plan + Kontingent als kleiner Kasten oben rechts (Eric 26.11.) */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <Installieren />
        <div className="ml-auto">
          <Kontingent />
        </div>
      </div>

      {standFehler && (
        <p className={`${KARTE} mb-5 p-4 text-sm text-red-700`}>{standFehler === "offline" ? t("err.offline") : standFehler === "anmeldung" ? t("err.login") : t("err.generic", { f: standFehler })}</p>
      )}

      {stand && !einwilligung && (
        <div className="mb-5 max-w-3xl">
          <EinwilligungKarte />
        </div>
      )}

      {stand && einwilligung && leer && (
        <div className="mb-5 max-w-3xl">
          <KontingentKarte limit={stand.limit} />
        </div>
      )}

      <input
        ref={eingabe}
        type="file"
        accept="image/*,.heic,.heif"
        className="sr-only"
        onChange={(e) => void waehle(e.target.files?.[0])}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 lg:col-span-2">
          {!foto ? (
            <button
              type="button"
              disabled={!einwilligung || liest || leer}
              onClick={() => eingabe.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                if (einwilligung && !leer) setZiehen(true);
              }}
              onDragLeave={() => setZiehen(false)}
              onDrop={(e) => {
                e.preventDefault();
                setZiehen(false);
                if (einwilligung && !leer) void waehle(e.dataTransfer.files?.[0]);
              }}
              className={`${KARTE} flex w-full flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-16 text-center transition disabled:cursor-not-allowed disabled:opacity-60 ${
                ziehen ? "border-stone-800 bg-[#fffbd1]" : "border-stone-300 hover:border-stone-500"
              }`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8e800]">
                <ImagePlus className="h-7 w-7 text-stone-900" />
              </span>
              <span className="text-base font-semibold text-stone-900">
                {liest ? t("coach.reading") : !einwilligung ? t("coach.consentFirst") : leer && stand ? t("err.kontingent", { l: stand.limit }) : t("coach.drop")}
              </span>
              <span className="max-w-md text-sm text-stone-500">{t("coach.local")}</span>
            </button>
          ) : (
            <FotoBuehne src={foto.bild} titel={titel} exif={ergebnis?.exif ?? foto.exif} laeuft={laeuft} markers={ergebnis?.markers} />
          )}

          {/* v8: Grund direkt beim Foto zeigen, warum „Bewerten“ noch nicht geht (Eric 26.11.: Knopf blieb grau, Hinweis stand nur oben) */}
          {foto && !ergebnis && stand && !einwilligung && <EinwilligungKarte />}
          {foto && !ergebnis && stand && einwilligung && leer && <KontingentKarte limit={stand.limit} />}
          {foto && !ergebnis && !stand && (
            <p className={`${KARTE} p-4 text-sm text-red-700`}>
              {standFehler === "offline" ? t("err.offline") : standFehler === "anmeldung" ? t("err.login") : standFehler ? t("err.generic", { f: standFehler }) : t("hist.loading")}
            </p>
          )}

          {foto && !ergebnis && (
            <div className={`${KARTE} space-y-3 p-5`}>
              <label className="flex items-start gap-2.5 text-sm text-stone-800">
                <input type="checkbox" checked={rechte} onChange={(e) => setRechte(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-stone-800" />
                <span>
                  {t("coach.rights")}{" "}
                  <Link to="/nutzungsbedingungen" className="text-stone-500 underline underline-offset-2">{t("coach.rightsTerms")}</Link>
                </span>
              </label>
              <label className="flex items-start gap-2.5 text-sm text-stone-800">
                <input type="checkbox" checked={thumbMerken} onChange={(e) => setThumbMerken(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-stone-800" />
                <span>{t("coach.thumb")}</span>
              </label>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  disabled={!rechte || laeuft || !einwilligung || leer}
                  onClick={() => void bewerten()}
                  className="inline-flex items-center gap-2 rounded-md bg-stone-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" /> {laeuft ? t("coach.rating") : t("coach.rate")}
                </button>
                <button
                  type="button"
                  disabled={laeuft}
                  onClick={neu}
                  className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-100 disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" /> {t("coach.other")}
                </button>
              </div>
            </div>
          )}

          {ergebnis && (
            <button
              type="button"
              onClick={neu}
              className="inline-flex items-center gap-2 rounded-md bg-stone-800 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-stone-700"
            >
              <ImagePlus className="h-4 w-4" /> {t("coach.other")}
            </button>
          )}

          <HistogrammKarte src={foto?.bild ?? null} />

          {meldung?.art === "kontingent" && !leer && <KontingentKarte limit={meldung.limit} />}
          {meldung && meldung.art !== "kontingent" && (
            <p role="status" className={`rounded-md px-4 py-3 text-sm shadow ${meldung.art === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
              {meldung.text}{" "}
              {meldung.art === "ok" && (
                <Link to="/verlauf" search={{ id: undefined }} className="font-semibold underline underline-offset-2">
                  {t("nav.history")}
                </Link>
              )}
            </p>
          )}
        </div>

        <aside className="min-w-0">
          {ergebnis ? <Bewertung e={ergebnis} /> : <div className={`${KARTE} p-5 text-sm text-stone-500`}>{t("score.empty")}</div>}
        </aside>
      </div>
    </Rahmen>
  );
}
