# Portfolio · Thomas Biju Kavukatt

Personal portfolio built as a thermal camera viewfinder. The hero is a live
heat-diffusion simulation on a Canvas 2D element, rendered through real
thermal palettes (Ironbow, Arctic, Rainbow in dark mode; Black Hot in light
mode). Experience is drawn as a GStreamer pipeline, projects are "lenses"
with 1x / 2x / 4x zoom, and skills light up the projects they were used in.

**Stack:** React 19 · TypeScript · Vite · Tailwind v4 · Motion · lucide-react.
Static site, no backend, no tracking.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build locally
```

## Edit content

Everything on the page comes from one file: `src/data/profile.ts`
(name, links, summary, skills, experience pipeline, projects, nav).
Components read from it; you should rarely need to touch them.

Resume PDF: replace `public/Thomas_Biju_Kavukatt_Resume.pdf` (export from
Word with the same name, or update `profile.resumePdf`).

Project images: the lenses currently use stylised CSS/SVG illustrations in
`src/components/illustrations/index.tsx`. To use real screenshots, drop a
PNG into `public/` and render an `<img>` in place of the illustration in
`src/components/Projects.tsx`.

## Theme and palettes

- Toggle in the nav, or `Ctrl+K` → "Switch to …". Persisted in `localStorage`.
- `?theme=light` / `?theme=dark` in the URL forces a theme (handy for sharing).
- The `PAL` button in the HUD cycles Ironbow / Arctic / Rainbow in dark mode.
- Colour tokens live in `src/index.css` (`:root` and `[data-theme='dark']`).

## Easter egg

Five "bad pixels" flicker on the hero. Click them to correct them. The
counter in the bottom-right HUD tracks progress.

## Deploy (Vercel)

1. Push to GitHub.
2. Vercel → New Project → import. Framework preset: Vite. No env vars needed.
3. `vercel.json` rewrites all routes to `index.html`.
