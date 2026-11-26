import { createFileRoute } from "@tanstack/react-router";

import { Rechtsseite } from "@/components/rechtsseite";
import { NUTZUNG } from "@/lib/rechtstexte";

// Nutzungsbedingungen PPS Lens (lens-app v5) – Entwurf, Anwalt prüft
export const Route = createFileRoute("/nutzungsbedingungen")({
  head: () => ({ meta: [{ title: "PPS Lens – Nutzungsbedingungen" }] }),
  component: () => <Rechtsseite texte={NUTZUNG} />,
});
