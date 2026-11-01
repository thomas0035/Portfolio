import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Minus, Plus } from 'lucide-react'
import { projects, type Project } from '../data/profile'
import { Chip, Section } from './Section'
import { CardWalletIllo, ChoreWarsIllo, VeinChainIllo } from './illustrations'

/* Each project is a lens. Zoom 1x = summary, 2x = features, 4x = architecture. */

const ZOOMS = [1, 2, 4] as const
type Zoom = (typeof ZOOMS)[number]

export function Projects() {
  return (
    <Section
      id="projects"
      index="02"
      label="Projects"
      title={
        <>
          Side projects that are <span className="text-accent">actually in use.</span>
        </>
      }
      intro="Zoom in on any project. 1x is the pitch, 2x is what it does, 4x is how it is built and why."
    >
      <div className="space-y-6">
        {projects.map((p, i) => (
          <ProjectLens key={p.id} project={p} flip={i % 2 === 1} />
        ))}
      </div>
    </Section>
  )
}

function ProjectLens({ project, flip }: { project: Project; flip: boolean }) {
  const [zoom, setZoom] = useState<Zoom>(1)
  const [shot, setShot] = useState(0)
  const image = project.images[shot] ?? project.images[0]
  const zi = ZOOMS.indexOf(zoom)
  const zoomIn = () => setZoom(ZOOMS[Math.min(ZOOMS.length - 1, zi + 1)])
  const zoomOut = () => setZoom(ZOOMS[Math.max(0, zi - 1)])

  const Illo = { chorewars: ChoreWarsIllo, cardwallet: CardWalletIllo, veinchain: VeinChainIllo }[
    project.illustration
  ]

  return (
    <motion.article
      id={`project-${project.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="panel reticle scroll-mt-24 overflow-hidden"
    >
      <div className={`grid gap-0 md:grid-cols-[1fr_1.4fr] ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}>
        {/* Viewfinder with illustration; scales with zoom */}
        <div className="relative min-h-80 overflow-hidden border-b border-line bg-bg-2 md:min-h-[26rem] md:border-r md:border-b-0">
          <div className="scanlines absolute inset-0 z-10" />
          <motion.div
            animate={{ scale: 1 + zi * 0.08 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className={image ? 'absolute inset-0' : 'absolute inset-6'}
          >
            {image ? (
              <>
                <img
                  src={image.src}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                />
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="relative h-full w-full object-contain p-6 pb-10"
                />
              </>
            ) : (
              <Illo />
            )}
          </motion.div>
          {project.images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {project.images.map((im, i) => (
                <button
                  key={im.src}
                  type="button"
                  onClick={() => setShot(i)}
                  aria-label={`Show screenshot ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === shot ? 'w-6 bg-accent' : 'w-1.5 bg-fg/40 hover:bg-fg/70'
                  }`}
                />
              ))}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 z-10 font-mono text-[0.62rem] tracking-[0.12em] text-hud uppercase">
            <span className="absolute top-3 left-3">{project.kind}</span>
            <span className="absolute top-3 right-3">{project.year}</span>
            <span className="absolute bottom-3 left-3">ZOOM {zoom}x</span>
            <span className="absolute right-3 bottom-3 flex items-center gap-1">
              <span className="rec-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" /> AF
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                {project.name}
              </h3>
              <p className="mt-2 leading-relaxed text-muted">{project.tagline}</p>
            </div>
            <ZoomControl zoom={zoom} onIn={zoomIn} onOut={zoomOut} onSet={setZoom} />
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {zi >= 1 && (
              <motion.div
                key="features"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="hud-label mt-6 mb-2">2x · What it does</div>
                <ul className="space-y-2 text-sm leading-relaxed text-muted">
                  {project.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
            {zi >= 2 && (
              <motion.div
                key="arch"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="hud-label mt-6 mb-2">4x · How it is built</div>
                <ul className="space-y-2 text-sm leading-relaxed text-muted">
                  {project.architecture.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-2" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {zi < 2 && (
              <button
                type="button"
                onClick={zoomIn}
                className="inline-flex items-center gap-1.5 rounded-md bg-accent-soft px-3 py-1.5 text-sm text-fg transition hover:brightness-110"
              >
                <Plus size={14} /> Zoom in
              </button>
            )}
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted underline-offset-4 transition hover:text-fg hover:underline"
              >
                {l.label} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function ZoomControl({
  zoom,
  onIn,
  onOut,
  onSet,
}: {
  zoom: Zoom
  onIn: () => void
  onOut: () => void
  onSet: (z: Zoom) => void
}) {
  return (
    <div
      className="flex shrink-0 flex-col items-center gap-1 rounded-lg border border-line bg-bg-2 p-1"
      aria-label="Zoom level"
    >
      <button
        type="button"
        onClick={onIn}
        aria-label="Zoom in"
        className="rounded p-1 text-muted hover:text-fg"
      >
        <Plus size={14} />
      </button>
      <div className="flex flex-col gap-1">
        {[...ZOOMS].reverse().map((z) => (
          <button
            key={z}
            type="button"
            onClick={() => onSet(z)}
            aria-pressed={zoom === z}
            className={`rounded px-1.5 py-0.5 font-mono text-[0.65rem] transition-colors ${
              zoom === z ? 'bg-accent text-bg' : 'text-faint hover:text-fg'
            }`}
          >
            {z}x
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onOut}
        aria-label="Zoom out"
        className="rounded p-1 text-muted hover:text-fg"
      >
        <Minus size={14} />
      </button>
    </div>
  )
}
