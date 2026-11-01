import { createContext, useContext, useEffect, useState } from 'react'
import type { PaletteId } from './palette'
import { DARK_PALETTES } from './palette'

export type Theme = 'dark' | 'light'

type ThemeCtx = {
  theme: Theme
  palette: PaletteId
  toggleTheme: () => void
  cyclePalette: () => void
}

export const ThemeContext = createContext<ThemeCtx | null>(null)

export function useTheme(): ThemeCtx {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme outside ThemeProvider')
  return ctx
}

function readTheme(): Theme {
  // The inline script in index.html already resolved ?theme= / storage / OS preference.
  const boot = document.documentElement.dataset.theme
  if (boot === 'light' || boot === 'dark') return boot
  try {
    const t = localStorage.getItem('tv-theme')
    if (t === 'light' || t === 'dark') return t
  } catch {
    /* ignore */
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function readPalette(): PaletteId {
  try {
    const p = localStorage.getItem('tv-palette') as PaletteId | null
    if (p && DARK_PALETTES.includes(p)) return p
  } catch {
    /* ignore */
  }
  return 'ironbow'
}

/* State + persistence; the provider component lives in App.tsx. */
export function useThemeState(): ThemeCtx {
  const [theme, setTheme] = useState<Theme>(readTheme)
  const [darkPalette, setDarkPalette] = useState<PaletteId>(readPalette)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('tv-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem('tv-palette', darkPalette)
    } catch {
      /* ignore */
    }
  }, [darkPalette])

  return {
    theme,
    palette: theme === 'light' ? 'blackhot' : darkPalette,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    cyclePalette: () =>
      setDarkPalette((p) => DARK_PALETTES[(DARK_PALETTES.indexOf(p) + 1) % DARK_PALETTES.length]),
  }
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}
