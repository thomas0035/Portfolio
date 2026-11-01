import { useEffect, useState } from 'react'
import { PALETTE_LABEL, type PaletteId } from '../lib/palette'

/* Viewfinder overlay: corners, crosshair, readouts.
   Purely decorative; everything meaningful is also in the DOM below it. */

type Props = {
  palette: PaletteId
  tempC: number
  badFixed: number
  badTotal: number
  onCyclePalette: () => void
  canCyclePalette: boolean
}

export function Hud({ palette, tempC, badFixed, badTotal, onCyclePalette, canCyclePalette }: Props) {
  const [clock, setClock] = useState(() => fmt(new Date()))
  useEffect(() => {
    const id = setInterval(() => setClock(fmt(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  const allFixed = badTotal > 0 && badFixed >= badTotal

  return (
    <div className="hud-layer pointer-events-none absolute inset-0 font-mono text-[0.68rem] tracking-[0.12em] text-hud uppercase">
      {/* Corner brackets */}
      <Corner className="top-16 left-4 border-t border-l" />
      <Corner className="top-16 right-4 border-t border-r" />
      <Corner className="bottom-4 left-4 border-b border-l" />
      <Corner className="right-4 bottom-4 border-b border-r" />

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70">
        <div className="absolute top-1/2 left-1/2 h-px w-10 -translate-x-1/2 bg-hud" />
        <div className="absolute top-1/2 left-1/2 h-10 w-px -translate-y-1/2 bg-hud" />
        <div className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-hud" />
      </div>

      {/* Top-left: REC */}
      <div className="absolute top-[4.5rem] left-8 flex items-center gap-2">
        <span className="rec-dot inline-block h-2 w-2 rounded-full bg-accent" />
        <span>REC</span>
        <span className="opacity-60">· LIVE · 25 FPS</span>
      </div>

      {/* Top-right: palette + clock */}
      <div className="absolute top-[4.5rem] right-8 flex items-center gap-3">
        <button
          type="button"
          onClick={onCyclePalette}
          disabled={!canCyclePalette}
          title={canCyclePalette ? 'Cycle thermal palette' : 'Light theme uses Black Hot'}
          className="pointer-events-auto rounded border border-current/40 px-1.5 py-0.5 uppercase transition hover:bg-accent-soft disabled:cursor-default disabled:opacity-60"
        >
          PAL · {PALETTE_LABEL[palette]}
        </button>
        <span className="hidden sm:inline">{clock}</span>
      </div>

      {/* Bottom-left: spot temperature */}
      <div className="absolute bottom-6 left-8 flex items-end gap-4">
        <div>
          <div className="opacity-60">SPOT</div>
          <div className="font-display text-2xl font-medium tracking-normal normal-case tabular-nums">
            {tempC.toFixed(1)}
            <span className="ml-1 text-sm opacity-70">°C</span>
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="opacity-60">EMISSIVITY</div>
          <div className="tabular-nums">0.95</div>
        </div>
      </div>

      {/* Bottom-right: bad pixel counter */}
      <div className="absolute right-8 bottom-6 text-right">
        <div className="opacity-60">BAD PIXELS</div>
        <div className={`tabular-nums transition-colors ${allFixed ? 'text-accent' : ''}`}>
          {allFixed ? 'CORRECTED' : `${badFixed} / ${badTotal} FIXED`}
        </div>
      </div>
    </div>
  )
}

function Corner({ className }: { className: string }) {
  return <div className={`absolute h-6 w-6 border-hud/70 ${className}`} />
}

function fmt(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}
