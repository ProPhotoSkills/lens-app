import { Link } from "@tanstack/react-router";

import { cookieEinstellungenOeffnen } from "@/components/cookie-banner";
import { useI18n } from "@/lib/i18n";
import { WEB_VERSION, useAppVersion } from "@/lib/version";

/**
 * Schlichte Fußzeile. Bewusst NICHT die große PPS-Fußzeile aus dem KI-Coach:
 * die verlinkt auf Next Level, OnLocation, MemberAbo und den Shop – das ist in
 * einer späteren Android-Hülle laut Google-Play-Regel nicht erlaubt (wie bei PPS Books).
 * Erlaubt: Impressum, Datenschutz, Hilfe/Kontakt.
 */
export function Footer() {
  const { lang, t } = useI18n();
  const de = lang === "de";
  const app = useAppVersion(); // nur in der Android-App, sonst null
  return (
    <footer className="border-t border-border bg-sidebar text-sm text-muted-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-3">
        <span>
          © 2026 ProPhotoSkills · PPS Lens
          <span className="ml-2 text-xs opacity-60">
            {app ? `${app} · ` : ""}Lens v{WEB_VERSION}
          </span>
        </span>
        <nav className="flex flex-wrap gap-4">
          <a className="hover:text-foreground" href={de ? "https://prophotoskills.com/impressum/" : "https://prophotoskills.com/site-notice/"} target="_blank" rel="noreferrer">
            {t("footer.imprint")}
          </a>
          {/* v5: Datenschutz-Hinweise und Nutzungsbedingungen von PPS Lens als eigene Seiten (verlinken weiter auf die PPS-Datenschutzerklärung) */}
          <Link className="hover:text-foreground" to="/datenschutz">
            {t("footer.privacy")}
          </Link>
          <Link className="hover:text-foreground" to="/nutzungsbedingungen">
            {t("legal.terms")}
          </Link>
          <button type="button" className="hover:text-foreground" onClick={cookieEinstellungenOeffnen}>
            {t("cookie.settings")}
          </button>
          <Link className="hover:text-foreground" to="/konto-loeschen">
            {t("footer.deleteAccount")}
          </Link>
          <a className="hover:text-foreground" href="mailto:support@prophotoskills.com">
            {t("footer.help")}
          </a>
        </nav>
      </div>
    </footer>
  );
}
