import { useEffect, useState } from 'react'
import { Command, Download, Menu, Moon, Sun } from 'lucide-react'
import { navSections, profile } from '../data/profile'
import { useTheme } from '../lib/theme'

type Props = { onOpenPalette: () => void }

export function Nav({ onOpenPalette }: Props) {
  const { theme, toggleTheme } = useTheme()
  const [active, setActive] = useState<string>('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const els = navSections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -50% 0px' },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? 'border-b border-line bg-bg/80 backdrop-blur-md' : 'bg-bg/30 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2 font-mono text-xs tracking-[0.14em] uppercase">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="text-fg">TBK</span>
          <span className="hidden text-faint sm:inline">· C++ / DESKTOP / IMAGING</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navSections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active === s.id ? 'bg-accent-soft text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenPalette}
            className="inline-flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-xs text-muted transition hover:border-line-strong hover:text-fg"
            aria-label="Open menu and command palette"
          >
            <Menu size={14} className="md:hidden" />
            <Command size={13} className="hidden md:block" />
            <span className="kbd hidden md:inline">Ctrl K</span>
          </button>
          <a
            href={profile.resumePdf}
            download
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-muted transition hover:border-line-strong hover:text-fg"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Resume</span>
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark' ? 'Switch to light theme (Black Hot)' : 'Switch to dark theme (Ironbow)'
            }
            title={theme === 'dark' ? 'Palette: Black Hot' : 'Palette: Ironbow'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line text-muted transition hover:border-line-strong hover:text-fg"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </nav>
    </header>
  )
}
