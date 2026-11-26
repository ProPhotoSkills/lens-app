import { useEffect, useState } from "react";

// Läuft die Seite in der Android-App (Hülle lens-android, Capacitor) oder im normalen Browser?
// v6 (Eric 26.11.: „mach das mal Google-konform“): zwei Merkmale, eins reicht:
//   1. window.Capacitor.isNativePlatform() – stellt Capacitor in der Hülle bereit
//   2. „PPSLensAndroid“ im User-Agent – hängt lens-android ab Version 1 an (capacitor.config: appendUserAgent)
// Wichtig: Beim ersten Aufbau (Server + erste Millisekunden) wissen wir es noch nicht.
// Dinge, die in der App NICHT erscheinen dürfen (Kauf-Hinweise), zeigen wir darum erst, wenn sicher
// feststeht „das ist ein Browser“ → useNurImBrowser(). So blitzt in der App nie ein Kauf-Link auf.

export const APP_KENNUNG = "PPSLensAndroid";

export function istAndroidApp(): boolean {
  if (typeof window === "undefined") return false;
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return !!cap?.isNativePlatform?.() || navigator.userAgent.includes(APP_KENNUNG);
}

type Umgebung = "unbekannt" | "app" | "browser";

export function useUmgebung(): Umgebung {
  const [u, setU] = useState<Umgebung>("unbekannt");
  useEffect(() => setU(istAndroidApp() ? "app" : "browser"), []);
  return u;
}

/** true = Android-App (nach dem ersten Aufbau) */
export function useIstApp(): boolean {
  return useUmgebung() === "app";
}

/** true nur, wenn sicher ein normaler Browser – für alles, was in der Android-App versteckt sein muss */
export function useNurImBrowser(): boolean {
  return useUmgebung() === "browser";
}
