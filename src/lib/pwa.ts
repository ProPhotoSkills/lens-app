// Installierbare App (PWA) – lens-app v5 (Eric 26.11. über den Projekt-Chat: App installierbar machen).
// - registriert /sw.js (nur im gebauten Stand, nicht bei „npm run dev“, nicht in einer Android-Hülle)
// - merkt sich das Installations-Angebot von Chrome/Android/Edge (beforeinstallprompt), damit die App
//   einen eigenen Knopf „App installieren“ zeigen kann
// - iPhone/iPad (Safari) kennen das nicht: dort zeigt die App eine kurze Anleitung (Teilen → Zum Home-Bildschirm)
import { useEffect, useState } from "react";

import { istAndroidApp } from "@/lib/app-umgebung";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

let angebot: InstallEvent | null = null;
const hoerer = new Set<() => void>();
const melden = () => hoerer.forEach((f) => f());

export function pwaStarten(): void {
  if (typeof window === "undefined") return;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    angebot = e as InstallEvent;
    melden();
  });
  window.addEventListener("appinstalled", () => {
    angebot = null;
    melden();
  });
  if (import.meta.env.PROD && "serviceWorker" in navigator && !istAndroidApp()) {
    navigator.serviceWorker.register("/sw.js").catch((err) => console.warn("[lens] Service Worker", err));
  }
}

export type InstallStand = { art: "knopf" | "ios" | "keins"; installieren: () => Promise<void> };

export function useInstallation(): InstallStand {
  const [zaehler, setZaehler] = useState(0);
  const [art, setArt] = useState<InstallStand["art"]>("keins");
  useEffect(() => {
    const neu = () => setZaehler((z) => z + 1);
    hoerer.add(neu);
    return () => {
      hoerer.delete(neu);
    };
  }, []);
  useEffect(() => {
    const installiert =
      window.matchMedia?.("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (installiert) setArt("keins");
    else if (angebot) setArt("knopf");
    else if (ios) setArt("ios");
    else setArt("keins");
  }, [zaehler]);
  return {
    art,
    installieren: async () => {
      if (!angebot) return;
      await angebot.prompt();
      await angebot.userChoice.catch(() => null);
      angebot = null;
      melden();
    },
  };
}
