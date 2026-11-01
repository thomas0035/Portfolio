/* Thermal colour lookup tables.
   Each palette is a list of [position 0..1, r, g, b] stops that gets
   expanded into a 256-entry Uint8 LUT for the canvas. */

export type PaletteId = 'ironbow' | 'arctic' | 'rainbow' | 'blackhot'

type Stop = [number, number, number, number]

const STOPS: Record<PaletteId, Stop[]> = {
  // Classic FLIR-style ironbow: black → purple → magenta → orange → yellow → white
  ironbow: [
    [0.0, 7, 7, 11],
    [0.12, 28, 8, 64],
    [0.3, 120, 10, 130],
    [0.48, 200, 30, 100],
    [0.64, 240, 110, 20],
    [0.8, 255, 190, 40],
    [0.92, 255, 240, 160],
    [1.0, 255, 255, 255],
  ],
  // Cold blues into cyan/white
  arctic: [
    [0.0, 7, 7, 11],
    [0.2, 10, 30, 90],
    [0.45, 20, 110, 200],
    [0.7, 60, 210, 240],
    [0.88, 190, 245, 255],
    [1.0, 255, 255, 255],
  ],
  // Lab rainbow
  rainbow: [
    [0.0, 7, 7, 11],
    [0.15, 20, 20, 160],
    [0.35, 0, 160, 220],
    [0.55, 20, 200, 60],
    [0.72, 240, 220, 30],
    [0.88, 240, 60, 20],
    [1.0, 255, 255, 255],
  ],
  // Black Hot (light theme): paper → ink. Hot things are dark.
  blackhot: [
    [0.0, 244, 243, 239],
    [0.3, 205, 203, 196],
    [0.6, 120, 118, 112],
    [0.85, 40, 40, 44],
    [1.0, 10, 10, 12],
  ],
}

export const PALETTE_LABEL: Record<PaletteId, string> = {
  ironbow: 'IRONBOW',
  arctic: 'ARCTIC',
  rainbow: 'RAINBOW',
  blackhot: 'BLACK HOT',
}

export const DARK_PALETTES: PaletteId[] = ['ironbow', 'arctic', 'rainbow']

const cache = new Map<PaletteId, Uint8ClampedArray>()

export function buildLut(id: PaletteId): Uint8ClampedArray {
  const hit = cache.get(id)
  if (hit) return hit
  const stops = STOPS[id]
  const lut = new Uint8ClampedArray(256 * 3)
  for (let i = 0; i < 256; i++) {
    const t = i / 255
    let a = stops[0]
    let b = stops[stops.length - 1]
    for (let s = 0; s < stops.length - 1; s++) {
      if (t >= stops[s][0] && t <= stops[s + 1][0]) {
        a = stops[s]
        b = stops[s + 1]
        break
      }
    }
    const span = b[0] - a[0] || 1
    const k = (t - a[0]) / span
    lut[i * 3] = a[1] + (b[1] - a[1]) * k
    lut[i * 3 + 1] = a[2] + (b[2] - a[2]) * k
    lut[i * 3 + 2] = a[3] + (b[3] - a[3]) * k
  }
  cache.set(id, lut)
  return lut
}

/* CSS gradient string for a palette, used in legends and skill chips. */
export function paletteGradient(id: PaletteId): string {
  return `linear-gradient(90deg, ${STOPS[id]
    .map(([p, r, g, b]) => `rgb(${r} ${g} ${b}) ${Math.round(p * 100)}%`)
    .join(', ')})`
}
