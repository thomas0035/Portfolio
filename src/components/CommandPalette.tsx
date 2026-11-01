import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Copy, Download, FolderGit2, Hash, Moon, Sun } from 'lucide-react'
import { navSections, profile, projects } from '../data/profile'
import { useTheme } from '../lib/theme'

type Item = {
  id: string
  label: string
  hint?: string
  icon: React.ReactNode
  run: () => void
}

type Props = { open: boolean; onClose: () => void }

export function CommandPalette({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-bg/60 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <PaletteBody onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PaletteBody({ onClose }: { onClose: () => void }) {
  const { theme, toggleTheme } = useTheme()
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState(false)

  const items = useMemo<Item[]>(() => {
    const go = (id: string) => () => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      onClose()
    }
    return [
      ...navSections.map((s) => ({
        id: `go-${s.id}`,
        label: `Go to ${s.label}`,
        hint: 'Section',
        icon: <Hash size={14} />,
        run: go(s.id),
      })),
      ...projects.map((p) => ({
        id: `proj-${p.id}`,
        label: p.name,
        hint: 'Project',
        icon: <FolderGit2 size={14} />,
        run: go(`project-${p.id}`),
      })),
      {
        id: 'theme',
        label: theme === 'dark' ? 'Switch to Black Hot (light)' : 'Switch to Ironbow (dark)',
        hint: 'Theme',
        icon: theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />,
        run: () => {
          toggleTheme()
          onClose()
        },
      },
      {
        id: 'resume',
        label: 'Download resume (PDF)',
        hint: 'File',
        icon: <Download size={14} />,
        run: () => {
          const a = document.createElement('a')
          a.href = profile.resumePdf
          a.download = ''
          a.click()
          onClose()
        },
      },
      {
        id: 'email',
        label: copied ? 'Copied!' : `Copy email · ${profile.email}`,
        hint: 'Contact',
        icon: <Copy size={14} />,
        run: () => {
          navigator.clipboard?.writeText(profile.email).then(() => {
            setCopied(true)
            setTimeout(() => {
              setCopied(false)
              onClose()
            }, 700)
          })
        },
      },
      {
        id: 'github',
        label: 'Open GitHub',
        hint: 'Link',
        icon: <ArrowUpRight size={14} />,
        run: () => {
          window.open(profile.github, '_blank', 'noreferrer')
          onClose()
        },
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        hint: 'Link',
        icon: <ArrowUpRight size={14} />,
        run: () => {
          window.open(profile.linkedin, '_blank', 'noreferrer')
          onClose()
        },
      },
    ]
  }, [theme, toggleTheme, onClose, copied])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((i) => i.label.toLowerCase().includes(s) || i.hint?.toLowerCase().includes(s))
  }, [items, q])

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 10)
    return () => clearTimeout(id)
  }, [])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(filtered.length - 1, c + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(0, c - 1))
    } else if (e.key === 'Enter') {
      filtered[cursor]?.run()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <motion.div
      role="dialog"
      aria-label="Command palette"
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.16 }}
      onClick={(e) => e.stopPropagation()}
      className="panel reticle w-full max-w-lg overflow-hidden shadow-2xl"
    >
      <div className="flex items-center gap-2 border-b border-line px-3 transition-colors focus-within:border-accent">
        <span className="font-mono text-xs text-accent">&gt;</span>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setCursor(0)
          }}
          onKeyDown={onKey}
          placeholder="Type a command or jump to a section…"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-faint"
        />
        <span className="kbd">esc</span>
      </div>
      <ul className="max-h-80 overflow-y-auto p-1.5">
        {filtered.length === 0 && (
          <li className="px-3 py-6 text-center font-mono text-xs text-faint">
            No matches. Try “projects” or “theme”.
          </li>
        )}
        {filtered.map((it, i) => (
          <li key={it.id}>
            <button
              type="button"
              onMouseEnter={() => setCursor(i)}
              onClick={it.run}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                i === cursor ? 'bg-accent-soft text-fg' : 'text-muted'
              }`}
            >
              <span className="text-accent">{it.icon}</span>
              <span className="flex-1">{it.label}</span>
              {it.hint && <span className="hud-label">{it.hint}</span>}
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
