// Plan, Kontingent und Einwilligung vom Tor (/stand) – für die ganze App an einer Stelle.
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/lib/auth";
import { ladeStand, type Stand } from "@/lib/lens";

type StandCtx = {
  stand: Stand | null;
  /** null = alles gut · "offline" · "anmeldung" · sonst Fehlertext */
  fehler: string | null;
  laden: () => Promise<void>;
  setStand: (s: Stand) => void;
};

const Ctx = createContext<StandCtx | null>(null);

export function StandProvider({ children }: { children: ReactNode }) {
  const { bereit, session } = useAuth();
  const [stand, setStand] = useState<Stand | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);

  const laden = useCallback(async () => {
    const r = await ladeStand();
    if (r.daten) {
      setStand(r.daten);
      setFehler(null);
    } else {
      setFehler(r.fehler ?? "fehler");
    }
  }, []);

  const userId = session?.user.id ?? null;
  useEffect(() => {
    if (!bereit) return;
    if (!userId) {
      setStand(null);
      setFehler(null);
      return;
    }
    void laden();
    // nur bei neuem Konto neu laden, nicht bei jedem Token-Refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bereit, userId, laden]);

  return <Ctx.Provider value={{ stand, fehler, laden, setStand }}>{children}</Ctx.Provider>;
}

export function useStand(): StandCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStand außerhalb von StandProvider");
  return c;
}
