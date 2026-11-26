import { Link } from "@tanstack/react-router";
import { History, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { KontoKnopf } from "@/components/konto-knopf";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const YELLOW = "#f8e800";
export const KARTE = "rounded-xl border border-stone-200 bg-white/95 shadow-lg backdrop-blur-sm";

/** Seitenrahmen wie PPS Books: gelber PPS-Kopf, Heli-Hintergrund, großes gelbes „Lens“, Fußzeile. */
export function Rahmen({ untertitel, children }: { untertitel?: string; children: ReactNode }) {
  const { session } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        right={
          <>
            {session && <Navi />}
            <KontoKnopf />
            <LanguageSwitcher />
          </>
        }
      />
      <main className="flex-1">
        <section
          className="relative overflow-hidden"
          style={{ backgroundImage: "url(/assets/heli-bg.webp)", backgroundSize: "cover", backgroundPosition: "center", minHeight: "calc(100dvh - 64px - 64px)" }}
        >
          <div className="absolute inset-0 bg-white/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
          <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
            <h1
              className="text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.35)" }}
            >
              <span style={{ color: YELLOW }}>Lens</span>
            </h1>
            {untertitel && <p className="mt-4 inline-block max-w-2xl rounded-lg bg-white/80 px-3 py-2 text-base font-medium text-stone-900 shadow-sm sm:text-lg">{untertitel}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Navi() {
  const { t } = useI18n();
  const cls = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-stone-800 hover:bg-white/70";
  const aktiv = { className: `${cls} bg-white shadow-sm` };
  return (
    <nav className="mr-1 flex items-center gap-1">
      <Link to="/" className={cls} activeProps={aktiv} activeOptions={{ exact: true }}>
        <Sparkles className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{t("nav.coach")}</span>
      </Link>
      <Link to="/verlauf" search={{ id: undefined }} className={cls} activeProps={aktiv}>
        <History className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{t("nav.history")}</span>
      </Link>
    </nav>
  );
}
