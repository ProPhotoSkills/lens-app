// Histogramm im Browser berechnen – das Foto verlässt dafür das Gerät nicht.
// Quelle: jedes Bild, das die Seite schon hat (das vorbereitete Foto oder das kleine Vorschaubild aus dem Verlauf).

export const FAECHER = 64;

export type Histogramm = {
  l: number[]; r: number[]; g: number[]; b: number[]; // je FAECHER Fächer, 0–1 normiert (höchster Wert = 1)
  lichter: number; // Anteil fast weißer Pixel (≥ 250), 0–1
  tiefen: number; // Anteil fast schwarzer Pixel (≤ 5), 0–1
  mittel: number; // mittlere Helligkeit 0–1
};

export async function berechneHistogramm(src: string): Promise<Histogramm> {
  const img = new Image();
  img.src = src;
  await img.decode();
  const f = Math.min(1, 400 / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * f));
  const h = Math.max(1, Math.round(img.naturalHeight * f));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("kein Canvas");
  ctx.drawImage(img, 0, 0, w, h);
  const d = ctx.getImageData(0, 0, w, h).data;
  const l = new Array(FAECHER).fill(0), r = new Array(FAECHER).fill(0), g = new Array(FAECHER).fill(0), b = new Array(FAECHER).fill(0);
  let hi = 0, lo = 0, sum = 0;
  const n = d.length / 4;
  for (let i = 0; i < d.length; i += 4) {
    const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    sum += lum;
    if (lum >= 250) hi++;
    if (lum <= 5) lo++;
    l[Math.min(FAECHER - 1, (lum * FAECHER) >> 8)]++;
    r[(d[i] * FAECHER) >> 8]++;
    g[(d[i + 1] * FAECHER) >> 8]++;
    b[(d[i + 2] * FAECHER) >> 8]++;
  }
  const norm = (a: number[]) => {
    const m = Math.max(...a) || 1;
    return a.map((v) => v / m);
  };
  return { l: norm(l), r: norm(r), g: norm(g), b: norm(b), lichter: hi / n, tiefen: lo / n, mittel: sum / n / 255 };
}

/** Maske für die genauen Stellen: ausgefressene Lichter rot, abgesoffene Tiefen blau, sonst durchsichtig.
 *  (Die KI-Markierungen sind nur ungefähr – diese hier sind pixelgenau.) */
export async function clippingMaske(src: string): Promise<string> {
  const img = new Image();
  img.src = src;
  await img.decode();
  const f = Math.min(1, 800 / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * f));
  const h = Math.max(1, Math.round(img.naturalHeight * f));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("kein Canvas");
  ctx.drawImage(img, 0, 0, w, h);
  const bild = ctx.getImageData(0, 0, w, h);
  const d = bild.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    if (lum >= 250) { d[i] = 244; d[i + 1] = 63; d[i + 2] = 94; d[i + 3] = 220; }
    else if (lum <= 5) { d[i] = 59; d[i + 1] = 130; d[i + 2] = 246; d[i + 3] = 220; }
    else d[i + 3] = 0;
  }
  ctx.putImageData(bild, 0, 0);
  return c.toDataURL("image/png");
}
