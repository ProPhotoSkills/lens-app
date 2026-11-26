// Anmeldung für PPS Lens (lens v1) – genau wie PPS Books (books-app src/lib/auth.tsx):
// gleiches Konto wie web und Books (Supabase-Projekt „Web Login“). Wer bei Digistore kauft, bekommt dort
// automatisch ein Konto (Einladungs-Mail); kostenlos registrieren geht auch (E-Mail + Passwort, Bestätigungsmail).
// Plan (free/pro), Kontingent und Einwilligung sagt das Tor lens-gate (/stand) – die App fragt nicht selbst die Datenbank.
// In Supabase → Authentication → URL Configuration muss die Adresse dieser App als Redirect-URL eingetragen sein
// (für Bestätigungsmail und „Passwort vergessen“).
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";

// Öffentliche Werte des Projekts „Web Login“ (gleich wie in web und books-app).
// Der anon-Schlüssel ist öffentlich – geschützt wird über die Datenbank-Regeln (RLS) und das Tor.
const SUPABASE_URL = ((import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "https://rkgjuqdkwaaymkruyhvy.supabase.co").replace(/\/+$/, "");
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZ2p1cWRrd2FheW1rcnV5aHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MDEwODksImV4cCI6MjEwNDI3NzA4OX0.nDpLI0L68tTufHueTKWSixOZicIpDzwwxQR3PmtURS4";

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null; // nur im Browser
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "ppsl_auth" },
    });
  }
  return client;
}

export type Registrierung = { email: string; passwort: string; newsletter: boolean; sprache: string; weiter?: string };

type AuthCtx = {
  bereit: boolean;
  session: Session | null;
  anmelden: (email: string, passwort: string) => Promise<string | null>;
  /** null = fertig angemeldet · "bestaetigen" = Bestätigungsmail unterwegs · sonst Fehlertext */
  registrieren: (r: Registrierung) => Promise<string | null>;
  abmelden: () => Promise<void>;
  passwortVergessen: (email: string) => Promise<string | null>;
  neuesPasswort: (passwort: string) => Promise<string | null>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [bereit, setBereit] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const sb = supabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setBereit(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const wert = useMemo<AuthCtx>(
    () => ({
      bereit,
      session,
      anmelden: async (email, passwort) => {
        const sb = supabase();
        if (!sb) return "offline";
        const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password: passwort });
        return error ? error.message : null;
      },
      registrieren: async ({ email, passwort, newsletter, sprache, weiter }) => {
        const sb = supabase();
        if (!sb) return "offline";
        const { data, error } = await sb.auth.signUp({
          email: email.trim(),
          password: passwort,
          options: {
            emailRedirectTo: `${window.location.origin}${weiter ?? "/"}`,
            data: {
              quelle: "pps-lens",
              sprache,
              newsletter,
              newsletter_at: newsletter ? new Date().toISOString() : null,
            },
          },
        });
        if (error) return error.message;
        return data.session ? null : "bestaetigen";
      },
      abmelden: async () => {
        await supabase()?.auth.signOut();
        setSession(null);
      },
      passwortVergessen: async (email) => {
        const sb = supabase();
        if (!sb) return "offline";
        const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/passwort` });
        return error ? error.message : null;
      },
      neuesPasswort: async (passwort) => {
        const sb = supabase();
        if (!sb) return "offline";
        const { error } = await sb.auth.updateUser({ password: passwort });
        return error ? error.message : null;
      },
    }),
    [bereit, session],
  );

  return <Ctx.Provider value={wert}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth außerhalb von AuthProvider");
  return c;
}
