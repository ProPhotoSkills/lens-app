import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LanguageSwitcher } from "@/components/language-switcher";

// Rahmen für Anmelden / Registrieren / Neues Passwort – wie PPS Books: Heli-Hintergrund, helle Karte
export function KontoSeite({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header right={<LanguageSwitcher />} />
      <main className="flex-1">
        <section
          className="relative overflow-hidden"
          style={{ backgroundImage: "url(/assets/heli-bg.webp)", backgroundSize: "cover", backgroundPosition: "center", minHeight: "calc(100dvh - 64px - 64px)" }}
        >
          <div className="absolute inset-0 bg-white/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
          <div className="relative mx-auto flex max-w-6xl justify-center px-4 py-12 sm:py-20">
            <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white/95 p-6 shadow-lg backdrop-blur-sm sm:p-8">
              <h1 className="inline-block rounded-md bg-[#f8e800] px-2.5 py-1 text-xl font-bold text-stone-800 sm:text-2xl">{titel}</h1>
              <div className="mt-5">{children}</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export const FELD =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-600 focus:ring-2 focus:ring-[#f8e800]";
export const KNOPF =
  "inline-flex w-full items-center justify-center rounded-md bg-stone-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-60";
