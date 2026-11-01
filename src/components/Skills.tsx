import { useState } from 'react'
import { pipeline, projects, skillGroups } from '../data/profile'
import { Section } from './Section'

/* Skills as a sensor array. Hover or focus a skill and it "heats up"
   along with every project and role it was used in. No made-up percentages. */

const NAMES: Record<string, string> = {
  ...Object.fromEntries(pipeline.map((p) => [p.id, p.id === 'thermview' ? 'ThermView' : p.org])),
  ...Object.fromEntries(projects.map((p) => [p.id, p.name])),
}

export function Skills() {
  const [hot, setHot] = useState<string | null>(null) // skill name
  const hotSkill = skillGroups.flatMap((g) => g.skills).find((s) => s.name === hot)
  const hotTargets = new Set(hotSkill?.usedIn ?? [])

  return (
    <Section
      id="skills"
      index="03"
      label="Skills"
      title={
        <>
          The sensor array. <span className="text-muted">Hover a skill to see where it was used.</span>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          {skillGroups.map((g) => (
            <div key={g.id} className="panel p-5">
              <div className="hud-label mb-3">{g.label}</div>
              <div className="flex flex-wrap gap-2">
                {g.skills.map((s) => {
                  const isHot = hot === s.name
                  const related = hot && !isHot && s.usedIn.some((u) => hotTargets.has(u))
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onMouseEnter={() => setHot(s.name)}
                      onMouseLeave={() => setHot(null)}
                      onFocus={() => setHot(s.name)}
                      onBlur={() => setHot(null)}
                      className={`rounded-md border px-3 py-1.5 text-sm transition-all duration-200 ${
                        isHot
                          ? 'border-accent bg-accent text-bg shadow-[0_0_24px_-6px_var(--glow)]'
                          : related
                            ? 'border-accent/60 bg-accent-soft text-fg'
                            : hot
                              ? 'border-line text-faint'
                              : 'border-line text-fg hover:border-line-strong'
                      }`}
                    >
                      {s.name}
                      {s.note && <span className="ml-1.5 font-mono text-[0.65rem] opacity-70">{s.note}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Readout */}
        <aside className="panel reticle h-fit p-5 lg:sticky lg:top-20">
          <div className="hud-label mb-3">Readout</div>
          {hotSkill ? (
            <>
              <div className="font-display text-xl font-semibold">{hotSkill.name}</div>
              {hotSkill.usedIn.length > 0 ? (
                <>
                  <div className="mt-3 text-sm text-muted">Used in</div>
                  <ul className="mt-2 space-y-1.5">
                    {hotSkill.usedIn.map((id) => (
                      <li key={id} className="flex items-center gap-2 text-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {NAMES[id] ?? id}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  Coursework and personal practice; not yet shipped in a project.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              Hover any skill. The chips that light up share a project or role with it, and this panel lists
              where it was used. No percentages here; where something shipped is the honest signal.
            </p>
          )}

          <div className="mt-6 border-t border-line pt-4">
            <div className="hud-label mb-2">Cross-reference</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(NAMES).map(([id, name]) => (
                <span
                  key={id}
                  className={`rounded border px-2 py-0.5 font-mono text-[0.68rem] transition-colors ${
                    hotTargets.has(id) ? 'border-accent bg-accent-soft text-fg' : 'border-line text-faint'
                  }`}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </Section>
  )
}
