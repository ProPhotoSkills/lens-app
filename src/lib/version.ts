// Versionsanzeige unten in der Fußzeile (Eric 15.11.: „unten bitte die Versionen immer drauf …
// mehr oder weniger unauffällig“).
// - WEB_VERSION = Stand der App PPS Lens (Brain 1_web/26_lens-app/dateien/lens-app_vN) –
//   bei jeder neuen Fassung hier mit hochzählen.
// - In der Android-App kommt die App-Version automatisch aus dem Android-Bundle
//   (versionName / versionCode der späteren Android-Hülle), nicht von Hand: Die Hülle lädt diese Seite
//   im WebView, Capacitor stellt dort window.Capacitor mit dem App-Plugin bereit.
//   Im normalen Browser gibt es window.Capacitor nicht – dann steht nur die Web-Version da.

import { useEffect, useState } from "react";

export const WEB_VERSION = "4";

type Info = { version: string; build: string };
type CapApp = { getInfo: () => Promise<Info> };
type Cap = {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
  Plugins?: { App?: CapApp };
  nativePromise?: (plugin: string, methode: string, optionen?: object) => Promise<Info>;
};

export function useAppVersion(): string | null {
  const [v, setV] = useState<string | null>(null);
  useEffect(() => {
    const cap = (window as unknown as { Capacitor?: Cap }).Capacitor;
    if (!cap?.isNativePlatform?.()) return;
    // Weg 1: App-Plugin-Objekt · Weg 2: direkter Aufruf über die Capacitor-Brücke (Remote-URL-Modus)
    const holen = cap.Plugins?.App
      ? cap.Plugins.App.getInfo()
      : cap.nativePromise
        ? cap.nativePromise("App", "getInfo", {})
        : null;
    if (!holen) return;
    holen
      .then((i) => {
        const plattform = cap.getPlatform?.() === "ios" ? "iOS" : "Android";
        setV(`${plattform} ${i.version} (${i.build})`);
      })
      .catch(() => setV(null));
  }, []);
  return v;
}
