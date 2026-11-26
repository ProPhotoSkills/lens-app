// Skill-Radar + Verlauf der Gesamtnote (aus dem Dummy, Tab „Member-Dashboard“) – berechnet aus dem Verlauf,
// keine eigenen Tabellen nötig. lens v2.
import { KARTE } from "@/components/rahmen";
import { fmt1, notenFarbe } from "@/components/ergebnis";
import { useI18n } from "@/lib/i18n";
import { KATS, type Kat, type VerlaufEintrag } from "@/lib/lens";

const SPALTE: Record<Kat, keyof VerlaufEintrag> = { comp: "bildaufbau", light: "licht", sharp: "schaerfe", color: "farbe" };

export function SkillRadar({ liste }: { liste: VerlaufEintrag[] }) {
  const { t } = useI18n();
  if (liste.length === 0) return null;
  const schnitt = Object.fromEntries(
    KATS.map((k) => {
      const werte = liste.map((x) => Number(x[SPALTE[k]] ?? x.ergebnis?.scores?.[k] ?? 0)).filter((v) => v > 0);
      return [k, werte.length ? werte.reduce((a, b) => a + b, 0) / werte.length : 0];
    }),
  ) as Record<Kat, number>;

  // Radar: 4 Achsen (oben Bildaufbau, rechts Licht, unten Schärfe, links Farbe)
  const cx = 160, cy = 122, R = 82;
  const winkel = (i: number) => -Math.PI / 2 + (i * Math.PI) / 2;
  const punkt = (i: number, v: number) => [cx + Math.cos(winkel(i)) * R * (v / 10), cy + Math.sin(winkel(i)) * R * (v / 10)];
  const poly = KATS.map((k, i) => punkt(i, schnitt[k]).join(",")).join(" ");
  const kurz = (k: Kat) => t(`cat.${k}`).split(" &")[0];
  const schwach = [...KATS].sort((a, b) => schnitt[a] - schnitt[b])[0];

  // Verlauf der Gesamtnote: älteste links, höchstens 12
  const reihe = [...liste].reverse().slice(-12).map((x) => Number(x.gesamt));
  const W = 260, H = 70;
  const sx = (i: number) => (reihe.length === 1 ? W / 2 : 10 + (i * (W - 20)) / (reihe.length - 1));
  const sy = (v: number) => H - 8 - ((Math.max(4, Math.min(10, v)) - 4) / 6) * (H - 16);

  return (
    <div className={`${KARTE} p-5`}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">{t("radar.title")}</div>
      <p className="mt-0.5 text-xs text-stone-500">{t("radar.sub", { n: liste.length })}</p>
      <svg viewBox="0 0 320 240" className="mx-auto mt-2 block w-full max-w-[340px]" role="img" aria-label={t("radar.title")}>
        {[2.5, 5, 7.5, 10].map((v) => (
          <polygon key={v} points={KATS.map((_, i) => punkt(i, v).join(",")).join(" ")} fill="none" stroke="#e7e5e4" strokeWidth="1" />
        ))}
        {KATS.map((_, i) => {
          const [x, y] = punkt(i, 10);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e7e5e4" strokeWidth="1" />;
        })}
        <polygon points={poly} fill="rgba(248,232,0,.45)" stroke="#292524" strokeWidth="2" strokeLinejoin="round" />
        {KATS.map((k, i) => {
          const [x, y] = punkt(i, schnitt[k]);
          return <circle key={k} cx={x} cy={y} r="4" fill={notenFarbe(schnitt[k])} stroke="#fff" strokeWidth="1.5" />;
        })}
        {KATS.map((k, i) => {
          // oben/unten mittig über bzw. unter der Achse, links/rechts am Rand über der Achse
          const pos = [
            { x: cx, y: cy - R - 8, a: "middle" },
            { x: 318, y: cy - 8, a: "end" },
            { x: cx, y: cy + R + 16, a: "middle" },
            { x: 2, y: cy - 8, a: "start" },
          ][i];
          return (
            <text key={k} x={pos.x} y={pos.y} textAnchor={pos.a as "middle" | "end" | "start"} fontSize="13" fill="#57534e">
              <tspan fontWeight="600">{kurz(k)}</tspan> <tspan fontFamily="ui-monospace,monospace">{fmt1(schnitt[k])}</tspan>
            </text>
          );
        })}
      </svg>
      <p className="mt-2 rounded-md bg-[#fffbd1] px-3 py-2 text-xs text-stone-700">{t("radar.focus", { kat: kurz(schwach) })}</p>

      {reihe.length > 1 && (
        <div className="mt-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">{t("radar.trend")}</div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 block w-full" role="img" aria-label={t("radar.trend")}>
            {[5, 7, 8.5].map((v) => (
              <line key={v} x1="0" x2={W} y1={sy(v)} y2={sy(v)} stroke="#e7e5e4" strokeDasharray="3 3" />
            ))}
            <polyline points={reihe.map((v, i) => `${sx(i)},${sy(v)}`).join(" ")} fill="none" stroke="#292524" strokeWidth="2" strokeLinejoin="round" />
            {reihe.map((v, i) => (
              <circle key={i} cx={sx(i)} cy={sy(v)} r="3.5" fill={notenFarbe(v)} stroke="#fff" strokeWidth="1" />
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}
