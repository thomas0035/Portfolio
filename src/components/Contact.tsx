import { useState } from 'react'
import { Check, Copy, Download, Mail } from 'lucide-react'
import { Github, Linkedin } from './BrandIcons'
import { profile } from '../data/profile'
import { Section } from './Section'

export function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(profile.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <Section
      id="contact"
      index="05"
      label="Contact"
      title={
        <>
          Hiring for C++ desktop, imaging, or full-stack? <span className="text-accent">Let's talk.</span>
        </>
      }
      intro="Email is fastest. I reply within a day. Based in Kochi, open to relocation anywhere in India."
      className="pb-28"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href={`mailto:${profile.email}`}
          className="panel reticle group flex flex-col gap-3 p-5 transition hover:border-accent"
        >
          <Mail className="text-accent" size={20} />
          <div>
            <div className="font-medium">Email</div>
            <div className="mt-0.5 text-sm break-all text-muted">{profile.email}</div>
          </div>
        </a>
        <button
          type="button"
          onClick={copy}
          className="panel group flex flex-col gap-3 p-5 text-left transition hover:border-accent"
        >
          {copied ? <Check className="text-accent" size={20} /> : <Copy className="text-accent" size={20} />}
          <div>
            <div className="font-medium">{copied ? 'Copied' : 'Copy address'}</div>
            <div className="mt-0.5 text-sm text-muted">To the clipboard</div>
          </div>
        </button>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="panel group flex flex-col gap-3 p-5 transition hover:border-accent"
        >
          <Linkedin className="text-accent" size={20} />
          <div>
            <div className="font-medium">LinkedIn</div>
            <div className="mt-0.5 text-sm text-muted">thomas-biju-kavukatt</div>
          </div>
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="panel group flex flex-col gap-3 p-5 transition hover:border-accent"
        >
          <Github className="text-accent" size={20} />
          <div>
            <div className="font-medium">GitHub</div>
            <div className="mt-0.5 text-sm text-muted">thomas0035</div>
          </div>
        </a>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={profile.resumePdf}
          download
          className="inline-flex items-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-bg transition hover:opacity-90"
        >
          <Download size={15} /> Download resume (PDF)
        </a>
        <span className="hud-label">Notice period · {profile.notice}</span>
      </div>
    </Section>
  )
}
