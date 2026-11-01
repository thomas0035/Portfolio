/* Stylised CSS/SVG illustrations for the project lenses.
   They are representations, not screenshots. Swap for real images
   by dropping files into /public and rendering <img> in ProjectLens. */

export function ChoreWarsIllo() {
  const rows = [
    { name: 'Vinil', pts: 184, w: 92 },
    { name: 'Thomas', pts: 171, w: 85 },
    { name: 'Akshay', pts: 150, w: 75 },
    { name: 'Stebin', pts: 132, w: 66 },
  ]
  return (
    <div className="h-full w-full rounded-lg border border-line bg-bg-2 p-3 font-mono text-[0.6rem]">
      <div className="flex items-center gap-1.5 border-b border-line pb-2">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="text-muted">chorewars · week 44 · league</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {['Kitchen', 'Sink', 'Hall'].map((a, i) => (
          <div key={a} className="rounded border border-line bg-panel p-2">
            <div className="text-faint">{a}</div>
            <div className={`mt-1 text-[0.62rem] ${i === 1 ? 'text-accent' : 'text-fg'}`}>
              {i === 1 ? 'DUE' : 'done'}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-2">
            <span className="w-12 text-muted">{r.name}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <span className="block h-full rounded-full bg-accent" style={{ width: `${r.w}%` }} />
            </span>
            <span className="w-7 text-right tabular-nums">{r.pts}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardWalletIllo() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-full max-h-56 w-28 rounded-[1.1rem] border border-line-strong bg-bg-2 p-2 shadow-inner">
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-line-strong" />
        <div className="relative h-[calc(100%-1rem)] overflow-hidden rounded-lg">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-x-0 rounded-md border border-line p-2 font-mono text-[0.5rem] text-muted"
              style={{
                top: `${i * 34}%`,
                height: '44%',
                background: i === 1 ? 'var(--accent)' : i === 0 ? 'var(--panel)' : 'var(--fg)',
                color: i === 1 || i === 2 ? 'var(--bg)' : undefined,
                zIndex: i,
              }}
            >
              <div className="flex justify-between">
                <span>{['DEBIT', 'CREDIT', 'ID'][i]}</span>
                <span>●●●</span>
              </div>
              <div className="mt-2 tracking-widest">•••• {['4821', '0093', '7710'][i]}</div>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          <span className="rounded-full border border-line bg-bg px-1.5 py-0.5 font-mono text-[0.5rem] text-muted">
            🔒 biometric
          </span>
        </div>
      </div>
    </div>
  )
}

export function VeinChainIllo() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-line bg-[#15161a]">
      <svg viewBox="0 0 200 140" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="nir" cx="50%" cy="50%" r="60%">
            <stop offset="0" stopColor="#9a9a9a" />
            <stop offset="0.7" stopColor="#4a4a4a" />
            <stop offset="1" stopColor="#15161a" />
          </radialGradient>
        </defs>
        <rect x="55" y="8" width="90" height="124" rx="40" fill="url(#nir)" />
        <g fill="none" stroke="#1d1d22" strokeWidth="3" strokeLinecap="round" opacity="0.9">
          <path d="M80 20c10 20 2 40 12 60s-4 30 6 50" />
          <path d="M100 14c-6 24 8 36 2 62s8 32 0 56" />
          <path d="M120 22c6 18-6 36 2 58s-6 28 2 48" />
          <path d="M84 60c10 4 20 2 32-4" />
          <path d="M86 96c12-4 22-2 30 4" />
        </g>
        <g stroke="#ff7a00" strokeWidth="1" fill="none" opacity="0.8">
          <rect x="60" y="14" width="80" height="112" rx="2" strokeDasharray="4 3" />
        </g>
        <text x="8" y="130" fontFamily="monospace" fontSize="7" fill="#9a9a9a">
          NIR 850nm · ResNet-50 · match 0.97
        </text>
      </svg>
    </div>
  )
}
