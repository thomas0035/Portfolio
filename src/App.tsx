import { useCallback, useEffect, useState } from 'react'
import { ThemeContext, useThemeState } from './lib/theme'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Pipeline } from './components/Pipeline'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { CommandPalette } from './components/CommandPalette'
import { profile } from './data/profile'

export default function App() {
  const themeState = useThemeState()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const closePalette = useCallback(() => setPaletteOpen(false), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <ThemeContext.Provider value={themeState}>
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <main>
        <Hero />
        <div className="relative">
          <div className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-60" />
          <Pipeline />
          <Projects />
          <Skills />
          <About />
          <Contact />
        </div>
      </main>
      <footer className="border-t border-line px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 font-mono text-[0.68rem] tracking-[0.12em] text-faint uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {profile.name}</span>
          <span>React · Vite · Tailwind · Canvas 2D heat map · No tracking</span>
        </div>
      </footer>
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </ThemeContext.Provider>
  )
}
