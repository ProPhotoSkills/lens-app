import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { I18nProvider } from "../lib/i18n";
import { AuthProvider } from "../lib/auth";
import { StandProvider } from "../lib/stand";
import { CookieBanner } from "../components/cookie-banner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">Diese Seite gibt es nicht. / This page does not exist.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            PPS Lens
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      // v15: ohne viewport-fit=cover (wie KI-Coach) – sonst legt Android/Capacitor 8 die Seite unter die
      // Statusleiste und Anmelden/Sprachen sind auf dem Handy nicht antippbar (Eric 15.11.)
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PPS Lens" },
      { name: "description", content: "PPS Lens – der KI-Foto-Coach von ProPhotoSkills: Foto hochladen, ehrliche Bewertung und konkrete Tipps bekommen." },
      { name: "author", content: "ProPhotoSkills" },
      // lens v1: noch nicht für Suchmaschinen freigegeben, bis Eric live geht
      { name: "robots", content: "noindex, nofollow" },
      { name: "theme-color", content: "#f8e800" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: () => (
    <I18nProvider>
      <AuthProvider>
        <StandProvider>
          <Outlet />
          <CookieBanner />
        </StandProvider>
      </AuthProvider>
    </I18nProvider>
  ),
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
