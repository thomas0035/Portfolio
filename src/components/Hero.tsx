import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowDown, Mail } from 'lucide-react'
import { Github, Linkedin } from './BrandIcons'
import { ThermalCanvas } from './ThermalCanvas'
import { Hud } from './Hud'
import { profile } from '../data/profile'
import { useReducedMotion, useTheme } from '../lib/theme'

const BAD_PIXELS = 5

export function Hero() {
  const { theme, palette, cyclePalette } = useTheme()
  const reduced = useReducedMotion()
  const [temp, setTemp] = useState(21.4)
  const [fixed, setFixed] = useState(0)

  return (
    <section id="top" className="relative flex min-h-svh flex-col">
      {/* Viewfinder */}
      <div className="relative flex-1 overflow-hidden">
        <ThermalCanvas
          palette={palette}
          reducedMotion={reduced}
          badPixelsTotal={BAD_PIXELS}
          onBadPixelFixed={setFixed}
          onSample={setTemp}
          className="absolute inset-0"
        />
        <div className="scanlines absolute inset-0" />
        {/* soft fade into the page at the bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-bg via-bg/80 via-35% to-transparent" />

        <Hud
          palette={palette}
          tempC={temp}
          badFixed={fixed}
          badTotal={BAD_PIXELS}
          onCyclePalette={cyclePalette}
          canCyclePalette={theme === 'dark'}
        />

        {/* Headline sits inside the viewfinder, bottom-left, like a caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-24 sm:px-8 sm:pb-28">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              className="pointer-events-auto max-w-3xl"
            >
              <p className="hud-label mb-4 text-hud">
                {profile.location} · {profile.relocation}
              </p>
              <h1 className="font-display text-4xl leading-[1.02] font-semibold tracking-tight text-balance drop-shadow-sm sm:text-6xl md:text-7xl">
                {profile.name}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty sm:text-xl">
                <span className="text-fg">{profile.title}.</span>{' '}
                <span className="text-muted">{profile.tagline}</span>
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-md bg-fg px-4 py-2 text-sm font-medium text-bg transition hover:opacity-90"
                >
                  See the work <ArrowDown size={14} />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 rounded-md border border-line-strong px-4 py-2 text-sm transition hover:bg-accent-soft"
                >
                  <Mail size={14} /> Email
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-strong transition hover:bg-accent-soft"
                  aria-label="GitHub"
                >
                  <Github size={15} />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-strong transition hover:bg-accent-soft"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={15} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hint + easter-egg feedback */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-5">
          <AnimatePresence mode="wait">
            {fixed >= BAD_PIXELS ? (
              <motion.p
                key="done"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-full border border-accent bg-bg/70 px-3 py-1 font-mono text-[0.68rem] tracking-[0.12em] text-accent uppercase backdrop-blur"
              >
                All bad pixels corrected. You would make a decent ThermView operator.
              </motion.p>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.2 }}
                className="hidden rounded-full border border-line bg-bg/60 px-3 py-1 font-mono text-[0.68rem] tracking-[0.12em] text-muted uppercase backdrop-blur sm:block"
              >
                Move the cursor to heat the sensor · click the flickering pixels to correct them
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
