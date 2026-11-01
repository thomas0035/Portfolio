import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronRight, MapPin } from 'lucide-react'
import { pipeline, type PipelineElement } from '../data/profile'
import { Chip, Section } from './Section'

/* Experience drawn as a GStreamer pipeline. Each stage is an element,
   the current role is a bin with child elements. Click to gst-inspect it. */

export function Pipeline() {
  const [selectedId, setSelectedId] = useState<string>(pipeline[pipeline.length - 1].id)
  const selected = pipeline.find((p) => p.id === selectedId) ?? pipeline[0]

  return (
    <Section
      id="work"
      index="01"
      label="Experience"
      title={
        <>
          One year on software that <span className="text-accent">ships to customers.</span>
        </>
      }
      intro="Laid out the way I think about it: as a pipeline. Click an element to inspect it."
    >
      {/* gst-launch line */}
      <div className="panel mb-6 overflow-x-auto px-4 py-3 font-mono text-xs leading-relaxed whitespace-nowrap">
        <span className="text-faint">$ </span>
        <span className="text-muted">gst-launch-1.0 </span>
        {pipeline.map((p, i) => (
          <span key={p.id}>
            <button
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`rounded px-1 transition-colors ${
                p.id === selectedId ? 'bg-accent-soft text-accent' : 'text-fg hover:text-accent'
              }`}
            >
              {p.element}
            </button>
            {i < pipeline.length - 1 && <span className="text-faint"> ! </span>}
          </span>
        ))}
        <span className="text-faint"> ! </span>
        <span className="text-faint">your_team_sink</span>
      </div>

      {/* Element boxes */}
      <div className="relative grid gap-3 md:grid-cols-4 md:gap-0">
        {pipeline.map((p, i) => (
          <ElementBox
            key={p.id}
            el={p}
            selected={p.id === selectedId}
            last={i === pipeline.length - 1}
            onSelect={() => setSelectedId(p.id)}
          />
        ))}
      </div>

      {/* Inspect panel */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="panel reticle p-6 md:p-8"
          >
            <div className="hud-label mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-accent">gst-inspect {selected.element}</span>
              <span className="hidden h-px w-6 bg-line-strong sm:inline-block" />
              <span>{selected.period}</span>
              {selected.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={11} /> {selected.location}
                </span>
              )}
            </div>
            <div className="grid gap-8 md:grid-cols-[1.1fr_1.4fr]">
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">{selected.role}</h3>
                <p className="mt-1 text-muted">{selected.org}</p>
                <p className="mt-4 leading-relaxed">{selected.summary}</p>
                {selected.stack && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {selected.stack.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <ul className="space-y-3">
                  {selected.bullets.map((b) => (
                    <li key={b} className="flex gap-3 leading-relaxed text-muted">
                      <ChevronRight size={16} className="mt-1 shrink-0 text-accent" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {selected.children && (
                  <div className="mt-6">
                    <div className="hud-label mb-3">Bin children · ThermView</div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {selected.children.map((c) => (
                        <div key={c.element} className="rounded-lg border border-line bg-bg-2 p-3">
                          <div className="font-mono text-[0.7rem] text-accent">{c.element}</div>
                          <div className="mt-1 text-sm font-medium">{c.title}</div>
                          <div className="mt-1 text-xs leading-relaxed text-muted">{c.detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  )
}

function ElementBox({
  el,
  selected,
  last,
  onSelect,
}: {
  el: PipelineElement
  selected: boolean
  last: boolean
  onSelect: () => void
}) {
  const isBin = !!el.children
  return (
    <div className="relative flex items-stretch">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`panel relative w-full p-4 text-left transition-all md:mx-3 ${
          selected ? 'border-accent shadow-[0_0_0_1px_var(--accent),0_0_40px_-10px_var(--glow)]' : ''
        }`}
      >
        {/* pads */}
        <span className="absolute top-1/2 -left-1.5 hidden h-3 w-3 -translate-y-1/2 rounded-sm border border-line-strong bg-bg md:block" />
        {!last && (
          <span className="absolute top-1/2 -right-1.5 hidden h-3 w-3 -translate-y-1/2 rounded-sm border border-line-strong bg-bg md:block" />
        )}
        <div className="flex items-center justify-between gap-2">
          <span className={`font-mono text-xs ${selected ? 'text-accent' : 'text-muted'}`}>
            {isBin ? '[bin] ' : ''}
            {el.element}
          </span>
          {selected && <span className="rec-dot h-1.5 w-1.5 rounded-full bg-accent" />}
        </div>
        <div className="mt-2 text-sm font-medium leading-snug">{el.role}</div>
        <div className="mt-0.5 text-xs text-muted">{el.org}</div>
        <div className="mt-3 font-mono text-[0.68rem] tracking-wide text-faint">{el.period}</div>
      </button>
      {/* connector */}
      {!last && (
        <span className="pointer-events-none absolute top-1/2 -right-3 hidden h-px w-6 bg-line-strong md:block" />
      )}
    </div>
  )
}
