import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const PPS_YELLOW = "#f8e800";

/**
 * Kopfzeile im Stil des KI-Coachs (gelber Balken).
 * Wie PPS Books: Logo ist kein Link nach draußen (Google-Play-Regel für eine spätere Android-Hülle).
 */
export function Header({ right }: { right?: ReactNode }) {
  return (
    <header style={{ backgroundColor: PPS_YELLOW }} className="border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/assets/photoskills-logo.png"
            alt="ProPhotoSkills"
            className="h-6 sm:h-8 w-auto max-w-[130px] sm:max-w-[220px] object-contain"
          />
        </Link>
        <div className="flex items-center gap-2 shrink-0">{right}</div>
      </div>
    </header>
  );
}
