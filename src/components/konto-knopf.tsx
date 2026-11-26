import { Link } from "@tanstack/react-router";
import { LogIn, LogOut } from "lucide-react";

import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

// Rechts in der Kopfzeile: „Anmelden“ bzw. E-Mail + „Abmelden“ (wie PPS Books)
export function KontoKnopf() {
  const { t } = useI18n();
  const { bereit, session, abmelden } = useAuth();
  if (!bereit) return null;
  if (!session) {
    return (
      <Link
        to="/anmelden"
        search={{ weiter: undefined }}
        className="inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white hover:bg-black"
      >
        <LogIn className="h-3.5 w-3.5" /> {t("auth.login")}
      </Link>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <span className="hidden max-w-[180px] truncate text-xs font-medium text-stone-800 lg:inline">{session.user.email}</span>
      <button
        type="button"
        onClick={() => void abmelden()}
        title={t("auth.logout")}
        className="inline-flex items-center gap-1.5 rounded-full border border-black/20 bg-white/60 px-3 py-1 text-xs font-semibold text-stone-800 hover:bg-white"
      >
        <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{t("auth.logout")}</span>
      </button>
    </span>
  );
}
