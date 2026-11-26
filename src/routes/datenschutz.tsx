import { createFileRoute } from "@tanstack/react-router";

import { Rechtsseite } from "@/components/rechtsseite";
import { DATENSCHUTZ } from "@/lib/rechtstexte";

// Datenschutz-Hinweise PPS Lens (lens-app v5) – Entwurf, Anwalt prüft
export const Route = createFileRoute("/datenschutz")({
  head: () => ({ meta: [{ title: "PPS Lens – Datenschutz" }] }),
  component: () => <Rechtsseite texte={DATENSCHUTZ} />,
});
