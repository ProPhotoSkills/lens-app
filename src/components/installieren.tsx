import { Download, Share } from "lucide-react";

import { ANDROID_OHNE } from "@/lib/android-schalter";
import { useNurImBrowser } from "@/lib/app-umgebung";
import { useI18n } from "@/lib/i18n";
import { useInstallation } from "@/lib/pwa";

/** Kleiner Hinweis „Lens als App“: Android/Chrome/Edge mit Knopf, iPhone/iPad mit Anleitung. Installiert → nichts. */
export function Installieren() {
  const { t } = useI18n();
  const { art, installieren } = useInstallation();
  const browser = useNurImBrowser();
  // v6: in der Android-App nie (Schalter appInstallieren) – erst zeigen, wenn sicher Browser
  if (!browser && ANDROID_OHNE.appInstallieren) return null;
  if (art === "keins") return null;
  if (art === "knopf") {
    return (
      <button
        type="button"
        onClick={() => void installieren()}
        className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white/90 px-3 py-1 text-[11px] font-semibold text-stone-800 shadow-sm hover:bg-white"
      >
        <Download className="h-3.5 w-3.5" /> {t("install.button")}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white/90 px-3 py-1 text-[11px] text-stone-700 shadow-sm">
      <Share className="h-3.5 w-3.5 shrink-0" /> {t("install.ios")}
    </span>
  );
}
