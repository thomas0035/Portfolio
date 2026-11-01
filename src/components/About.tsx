import { profile } from '../data/profile'
import { Section } from './Section'

export function About() {
  const spec: [string, string][] = [
    ['Location', profile.location],
    ['Relocation', profile.relocation],
    ['Notice period', profile.notice],
    ['Education', 'B.Tech CSE, Rajagiri School of Engineering & Technology, 2025 · CGPA 7.88'],
    ['Current', 'Software Engineer, Digital Core Technologies (ThermView)'],
    ['Looking for', profile.lookingFor],
  ]
  return (
    <Section
      id="about"
      index="04"
      label="About"
      title={
        <>
          Spec sheet. <span className="text-muted">The short version of me.</span>
        </>
      }
    >
      <div className="grid gap-8 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4 text-lg leading-relaxed text-pretty">
          {profile.summary.map((p) => (
            <p key={p} className="text-muted first:text-fg">
              {p}
            </p>
          ))}
          <p className="text-muted">
            The thing I like most about desktop work on hardware is that the feedback is immediate and honest.
            The frame either arrives on time or it does not. A control either moves the lens or it does not.
            That is the kind of software I want to keep building.
          </p>
        </div>
        <dl className="panel reticle divide-y divide-line">
          {spec.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[7rem_1fr] gap-3 px-5 py-3.5">
              <dt className="hud-label pt-0.5">{k}</dt>
              <dd className="text-sm leading-relaxed">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
