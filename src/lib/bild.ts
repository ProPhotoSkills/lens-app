// Foto vorbereiten – passiert KOMPLETT im Browser, bevor irgendetwas das Gerät verlässt
// (Datenschutz-Konzept, Abschnitt 1 + 5):
//   1. EXIF lokal lesen (nur Kamera, Brennweite, Blende, Zeit, ISO – kein GPS, keine Seriennummer)
//   2. Foto auf max. 1600 px neu zeichnen → das neue JPEG hat KEINE Metadaten mehr (GPS, Seriennummer, XMP …)
//   3. kleines Vorschaubild (96 px) – wird nur gespeichert, wenn der Nutzer es ankreuzt
// Hochgeladen wird erst beim Klick auf „Bewerten“ (lens.ts → bewerte).
// EXIF-Leser übernommen aus DUMMY_pps-lens_v2.html (ImageLab.readExif/formatExif).

import type { Exif } from "@/lib/lens";

export const MAX_KANTE = 1600;
const THUMB_BREITE = 96;
const MAX_ZEICHEN = 5_800_000; // Tor nimmt bis 6 000 000

type Roh = { make?: string; model?: string; exposure?: number; fnumber?: number; iso?: number; focal?: number; exifPtr?: number };

export function leseExif(buf: ArrayBuffer): Roh | null {
  try {
    const v = new DataView(buf);
    if (v.getUint16(0) !== 0xffd8) return null;
    let o = 2;
    while (o < v.byteLength - 4) {
      const marker = v.getUint16(o);
      const len = v.getUint16(o + 2);
      if (marker === 0xffe1 && v.getUint32(o + 4) === 0x45786966) {
        const t = o + 10;
        const le = v.getUint16(t) === 0x4949;
        const u16 = (p: number) => v.getUint16(p, le);
        const u32 = (p: number) => v.getUint32(p, le);
        const out: Roh = {};
        const readIfd = (ifd: number) => {
          const n = u16(t + ifd);
          for (let i = 0; i < n; i++) {
            const e = t + ifd + 2 + i * 12;
            const tag = u16(e);
            const type = u16(e + 2);
            const cnt = u32(e + 4);
            const vo = e + 8;
            const size = ({ 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1 } as Record<number, number>)[type] || 1;
            const ptr = cnt * size > 4 ? t + u32(vo) : vo;
            const str = () => {
              let s = "";
              for (let k = 0; k < cnt - 1; k++) s += String.fromCharCode(v.getUint8(ptr + k));
              return s.trim();
            };
            const rat = () => u32(ptr) / (u32(ptr + 4) || 1);
            if (tag === 0x010f) out.make = str();
            else if (tag === 0x0110) out.model = str();
            else if (tag === 0x8769) out.exifPtr = u32(vo);
            else if (tag === 0x829a) out.exposure = rat();
            else if (tag === 0x829d) out.fnumber = rat();
            else if (tag === 0x8827) out.iso = type === 3 ? u16(vo) : u32(vo);
            else if (tag === 0x920a) out.focal = rat();
          }
        };
        readIfd(u32(t + 4));
        if (out.exifPtr) readIfd(out.exifPtr);
        return out;
      }
      if ((marker & 0xff00) !== 0xff00) break;
      o += 2 + len;
    }
  } catch {
    /* kaputte EXIF ignorieren */
  }
  return null;
}

export function formatExif(x: Roh | null): Exif | null {
  if (!x) return null;
  const cam = [x.make, x.model].filter(Boolean).join(" ").replace(/^(\w+)\s+\1/i, "$1");
  const e: Exif = {
    camera: cam || "–",
    focal: x.focal ? `${Math.round(x.focal)} mm` : "–",
    aperture: x.fnumber ? `f/${+x.fnumber.toFixed(1)}` : "–",
    shutter: x.exposure ? (x.exposure >= 1 ? `${x.exposure.toFixed(1)} s` : `1/${Math.round(1 / x.exposure)} s`) : "–",
    iso: x.iso ? `ISO ${x.iso}` : "–",
  };
  return Object.values(e).every((w) => w === "–") ? null : e;
}

export type Vorbereitet = {
  name: string;
  bild: string; // data:image/jpeg;base64 – ohne Metadaten, max. 1600 px
  thumb: string; // 96 px
  exif: Exif | null;
  breite: number;
  hoehe: number;
};

export function istBild(f: File): boolean {
  return f.type.startsWith("image/") || /\.(jpe?g|png|webp|heic|heif|avif)$/i.test(f.name);
}

async function dekodieren(file: File): Promise<CanvasImageSource & { width: number; height: number }> {
  // createImageBitmap dreht nach der EXIF-Ausrichtung (Standard „from-image“)
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* z. B. HEIC in Chrome → Fallback */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return Object.assign(img, { width: img.naturalWidth, height: img.naturalHeight });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function zeichne(quelle: CanvasImageSource, w: number, h: number, qualitaet: number): string {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("kein Canvas");
  ctx.fillStyle = "#fff"; // transparente PNGs bekommen weißen Grund
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(quelle, 0, 0, w, h);
  return c.toDataURL("image/jpeg", qualitaet);
}

/** wirft "format", wenn der Browser das Bild nicht lesen kann (z. B. HEIC in Chrome) */
export async function vorbereiten(file: File): Promise<Vorbereitet> {
  const buf = await file.arrayBuffer();
  const exif = formatExif(leseExif(buf));
  let src: Awaited<ReturnType<typeof dekodieren>>;
  try {
    src = await dekodieren(file);
  } catch {
    throw new Error("format");
  }
  const f = Math.min(1, MAX_KANTE / Math.max(src.width, src.height));
  const w = Math.max(1, Math.round(src.width * f));
  const h = Math.max(1, Math.round(src.height * f));
  let bild = zeichne(src, w, h, 0.86);
  if (bild.length > MAX_ZEICHEN) bild = zeichne(src, w, h, 0.7);
  const th = Math.max(1, Math.round((THUMB_BREITE * h) / w));
  const thumb = zeichne(src, THUMB_BREITE, th, 0.7);
  if ("close" in src && typeof (src as ImageBitmap).close === "function") (src as ImageBitmap).close();
  return { name: file.name, bild, thumb, exif, breite: w, hoehe: h };
}
