import { useEffect, useState } from "react";

// v22: Laeuft die Seite in der Android-App (Capacitor-Huelle)?
// Google-Play-Regel (wie PPS Books): in der App keine Links nach draussen zu Kauf-/Produktseiten –
// der MemberAbo-Link (Upgrade auf Pro) erscheint darum nur im Browser.
// Server und erster Aufbau: false (Browser) → Suchmaschinen sehen die Links.
export function useIstApp(): boolean {
  const [app, setApp] = useState(false);
  useEffect(() => {
    const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
    setApp(!!cap?.isNativePlatform?.());
  }, []);
  return app;
}
