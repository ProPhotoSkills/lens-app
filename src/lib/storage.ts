// Kleine Helfer für den Browser-Speicher (Lesestand, Schriftgröße, Farbe).
// In manchen Umgebungen wirft localStorage – deshalb immer mit try/catch.

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Speicher nicht verfügbar – dann eben ohne Merken */
  }
}
