import { useEffect, useRef } from 'react'
import { buildLut, type PaletteId } from '../lib/palette'

/* A small heat-diffusion simulation rendered through a thermal LUT.
   The pointer is a heat source. Heat spreads and cools each frame.
   A few "bad pixels" flicker; clicking one corrects it (see ThermView). */

type Props = {
  palette: PaletteId
  reducedMotion: boolean
  badPixelsTotal: number
  onBadPixelFixed: (fixed: number) => void
  onSample?: (tempC: number) => void
  className?: string
}

const CELL = 6 // simulation cell size in CSS px
const BAD_PIXEL_RADIUS = 3 // click tolerance in cells

type Blob = { x: number; y: number; vx: number; vy: number; r: number; p: number }

export function ThermalCanvas({
  palette,
  reducedMotion,
  badPixelsTotal,
  onBadPixelFixed,
  onSample,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lutRef = useRef(buildLut(palette))
  const pointer = useRef<{ x: number; y: number; active: boolean; down: boolean }>({
    x: -1,
    y: -1,
    active: false,
    down: false,
  })
  const badRef = useRef<{ cells: { x: number; y: number }[]; fixed: Set<number> }>({
    cells: [],
    fixed: new Set(),
  })
  const callbacks = useRef({ onBadPixelFixed, onSample })
  useEffect(() => {
    callbacks.current = { onBadPixelFixed, onSample }
  }, [onBadPixelFixed, onSample])

  useEffect(() => {
    lutRef.current = buildLut(palette)
  }, [palette])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let gw = 0
    let gh = 0
    let heat = new Float32Array(0)
    let next = new Float32Array(0)
    let img: ImageData | null = null
    const off = document.createElement('canvas')
    const offCtx = off.getContext('2d')!
    let raf = 0
    let frame = 0
    let lastSample = 0
    let blobs: Blob[] = []

    const seedBadPixels = () => {
      const cells: { x: number; y: number }[] = []
      let tries = 0
      while (cells.length < badPixelsTotal && tries < 200) {
        tries++
        // Keep them in the upper half: the caption gradient covers the lower part of the viewfinder.
        const x = 6 + Math.floor(Math.random() * Math.max(1, gw - 12))
        const y = 12 + Math.floor(Math.random() * Math.max(1, Math.floor(gh * 0.45) - 12))
        if (cells.every((c) => Math.abs(c.x - x) > 8 || Math.abs(c.y - y) > 8)) cells.push({ x, y })
      }
      badRef.current = { cells, fixed: new Set() }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      const ngw = Math.max(8, Math.ceil(rect.width / CELL))
      const ngh = Math.max(8, Math.ceil(rect.height / CELL))
      if (ngw !== gw || ngh !== gh) {
        gw = ngw
        gh = ngh
        heat = new Float32Array(gw * gh)
        next = new Float32Array(gw * gh)
        off.width = gw
        off.height = gh
        img = offCtx.createImageData(gw, gh)
        blobs = Array.from({ length: 4 }, (_, i) => ({
          x: Math.random() * gw,
          y: Math.random() * gh,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 10 + i * 4,
          p: 0.028 + i * 0.006,
        }))
        if (badRef.current.cells.length === 0) seedBadPixels()
      }
    }

    const addHeat = (cx: number, cy: number, radius: number, power: number, max = 1) => {
      const r2 = radius * radius
      const x0 = Math.max(0, Math.floor(cx - radius))
      const x1 = Math.min(gw - 1, Math.ceil(cx + radius))
      const y0 = Math.max(0, Math.floor(cy - radius))
      const y1 = Math.min(gh - 1, Math.ceil(cy + radius))
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const dx = x - cx
          const dy = y - cy
          const d2 = dx * dx + dy * dy
          if (d2 < r2) {
            const i = y * gw + x
            heat[i] = Math.min(max, heat[i] + power * (1 - d2 / r2))
          }
        }
      }
    }

    const step = () => {
      frame++
      // Pointer heat
      const p = pointer.current
      if (p.active) addHeat(p.x / CELL, p.y / CELL, p.down ? 9 : 5.5, p.down ? 0.2 : 0.1)

      // Ambient blobs keep the view alive without a pointer
      if (!reducedMotion) {
        for (const b of blobs) {
          b.x += b.vx
          b.y += b.vy
          if (b.x < 2 || b.x > gw - 2) b.vx *= -1
          if (b.y < 2 || b.y > gh - 2) b.vy *= -1
          addHeat(b.x, b.y, b.r, b.p, 0.82)
        }
      }

      // Diffuse + cool
      const decay = reducedMotion ? 0.995 : 0.982
      for (let y = 0; y < gh; y++) {
        const up = y > 0 ? y - 1 : y
        const dn = y < gh - 1 ? y + 1 : y
        for (let x = 0; x < gw; x++) {
          const i = y * gw + x
          const l = x > 0 ? i - 1 : i
          const r = x < gw - 1 ? i + 1 : i
          const v = heat[i] * 0.6 + (heat[l] + heat[r] + heat[up * gw + x] + heat[dn * gw + x]) * 0.1
          next[i] = v * decay
        }
      }
      const tmp = heat
      heat = next
      next = tmp
    }

    const draw = () => {
      if (!img) return
      const lut = lutRef.current
      const d = img.data
      const n = gw * gh
      for (let i = 0; i < n; i++) {
        // sensor grain
        const noise = ((Math.random() - 0.5) * 10) | 0
        let v = (heat[i] * 255 + 10 + noise) | 0
        if (v < 0) v = 0
        else if (v > 255) v = 255
        const k = v * 3
        const o = i * 4
        d[o] = lut[k]
        d[o + 1] = lut[k + 1]
        d[o + 2] = lut[k + 2]
        d[o + 3] = 255
      }
      // Bad pixels: flicker between saturated and dead, until fixed
      const { cells, fixed } = badRef.current
      cells.forEach((c, idx) => {
        if (fixed.has(idx)) return
        const on = ((frame >> 2) + idx) % 2 === 0
        const k = (on ? 255 : 0) * 3
        // 2x2 cell cluster so it reads as a stuck pixel at any DPI
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            const o = ((c.y + dy) * gw + (c.x + dx)) * 4
            d[o] = lut[k]
            d[o + 1] = lut[k + 1]
            d[o + 2] = lut[k + 2]
          }
        }
      })
      offCtx.putImageData(img, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(off, 0, 0, canvas.width, canvas.height)
    }

    const loop = (t: number) => {
      step()
      draw()
      if (onSampleThrottle(t)) {
        const p = pointer.current
        let v = 0
        if (p.active) {
          const i = Math.min(gh - 1, Math.floor(p.y / CELL)) * gw + Math.min(gw - 1, Math.floor(p.x / CELL))
          v = heat[i] || 0
        } else {
          // average of the frame
          let s = 0
          for (let i = 0; i < heat.length; i += 7) s += heat[i]
          v = s / (heat.length / 7)
        }
        callbacks.current.onSample?.(18 + v * 46)
      }
      raf = requestAnimationFrame(loop)
    }
    const onSampleThrottle = (t: number) => {
      if (t - lastSample > 120) {
        lastSample = t
        return true
      }
      return false
    }

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e)
      pointer.current = { ...pointer.current, x, y, active: true }
    }
    const onLeave = () => {
      pointer.current = { ...pointer.current, active: false, down: false }
    }
    const onDown = (e: PointerEvent) => {
      const { x, y } = toLocal(e)
      pointer.current = { x, y, active: true, down: true }
      addHeat(x / CELL, y / CELL, 10, 0.5)
      // Bad pixel correction
      const cx = Math.floor(x / CELL)
      const cy = Math.floor(y / CELL)
      const { cells, fixed } = badRef.current
      cells.forEach((c, idx) => {
        if (fixed.has(idx)) return
        if (Math.abs(c.x - cx) <= BAD_PIXEL_RADIUS && Math.abs(c.y - cy) <= BAD_PIXEL_RADIUS) {
          fixed.add(idx)
          callbacks.current.onBadPixelFixed(fixed.size)
        }
      })
    }
    const onUp = () => {
      pointer.current = { ...pointer.current, down: false }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [reducedMotion, badPixelsTotal])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full cursor-crosshair touch-none select-none ${className}`}
    />
  )
}
