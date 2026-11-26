import { useEffect, useRef, useState } from "react";

import { LANGS, useI18n } from "@/lib/i18n";

/** Flaggen-Auswahl wie beim KI-Coach: aktuelle Flagge + Kürzel, Klick öffnet die Liste. */
export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={t("lang.label")}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-md border border-black/15 bg-black/5 px-2 py-1.5 transition hover:bg-black/10"
      >
        <img src={current.flag} alt="" className="h-3.5 w-5 rounded-sm object-cover" />
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-900/90">{current.code}</span>
      </button>
      {open && (
        <ul className="absolute right-0 z-50 mt-1 min-w-[10rem] overflow-hidden rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-xl">
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-accent ${
                  l.code === lang ? "font-semibold" : ""
                }`}
              >
                <img src={l.flag} alt="" className="h-3.5 w-5 rounded-sm object-cover" />
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
