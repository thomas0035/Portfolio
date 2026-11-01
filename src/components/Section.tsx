import type { ReactNode } from 'react'
import { motion } from 'motion/react'

type Props = {
  id: string
  index: string
  label: string
  title: ReactNode
  intro?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({ id, index, label, title, intro, children, className = '' }: Props) {
  return (
    <section id={id} className={`relative scroll-mt-20 px-5 py-20 sm:px-8 md:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-10 md:mb-14"
        >
          <div className="hud-label mb-3 flex items-center gap-3">
            <span className="text-accent">{index}</span>
            <span className="h-px w-8 bg-line-strong" />
            <span>{label}</span>
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {intro && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{intro}</p>}
        </motion.header>
        {children}
      </div>
    </section>
  )
}

/* Small mono chip used for tech stacks */
export function Chip({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[0.7rem] tracking-wide transition-colors ${
        active ? 'border-accent bg-accent-soft text-fg' : 'border-line text-muted'
      }`}
    >
      {children}
    </span>
  )
}
