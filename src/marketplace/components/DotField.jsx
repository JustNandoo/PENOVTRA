import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../hooks/useInView'
import { cx } from '../../components/ui'

/* The "planting field" from the Home hero, reusable for any dark band:
   a grid of net-pot dots that sprout where the pointer passes. */
export function DotField({ density = 1 }) {
  const cvRef = useRef(null)

  useEffect(() => {
    const cv = cvRef.current, host = cv.parentElement
    const ctx = cv.getContext('2d')
    const reduced = prefersReducedMotion()
    const GAP = 34
    let pts = [], W = 0, H = 0, running = false, raf = 0
    const mouse = { x: -999, y: -999 }
    const t0 = performance.now()

    function sprout(p, g) {
      const s = g * 9
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.strokeStyle = `rgba(154,205,43,${.35 + g * .55})`
      ctx.fillStyle = `rgba(154,205,43,${.25 + g * .6})`
      ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s); ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, -s)
      ctx.quadraticCurveTo(s * .9, -s * 1.5, s * 1.1, -s * .7)
      ctx.quadraticCurveTo(s * .45, -s * .55, 0, -s)
      ctx.moveTo(0, -s * .8)
      ctx.quadraticCurveTo(-s * .8, -s * 1.25, -s * .95, -s * .5)
      ctx.quadraticCurveTo(-s * .4, -s * .4, 0, -s * .8)
      ctx.fill()
      ctx.restore()
    }

    function frame(now) {
      ctx.clearRect(0, 0, W, H)
      let active = false
      for (const p of pts) {
        if (p.delay !== undefined && now - t0 > p.delay) { p.tg = Math.max(p.tg, .55 + p.seed * 2); delete p.delay }
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        if (d < 130) p.tg = Math.max(p.tg, 1 - d / 130)
        p.g += (p.tg - p.g) * .08
        p.tg *= .996
        if (p.tg < .002) p.tg = 0
        if (p.delay !== undefined || p.g > .002 || p.tg > .002) active = true
        if (p.g < .06) {
          ctx.fillStyle = 'rgba(255,255,255,.10)'
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.283); ctx.fill()
        } else {
          ctx.strokeStyle = 'rgba(255,255,255,.12)'
          ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 6.283); ctx.stroke()
          sprout(p, Math.min(p.g, 1))
        }
      }
      if (active) raf = requestAnimationFrame(frame); else running = false
    }
    const kick = () => { if (!running) { running = true; raf = requestAnimationFrame(frame) } }

    function layout() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = host.clientWidth; H = host.clientHeight
      cv.width = W * dpr; cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      pts = []
      const ox = (W % GAP) / 2 + GAP / 2, oy = (H % GAP) / 2 + GAP / 2
      for (let y = oy; y < H; y += GAP)
        for (let x = ox; x < W; x += GAP)
          pts.push({ x, y, g: 0, tg: 0, rot: (Math.random() - .5) * .5, seed: Math.random() })
      if (!reduced) pts.forEach(p => {
        const d = Math.hypot(p.x, H - p.y) / Math.hypot(W, H)
        if (p.seed < .16 * density) p.delay = 300 + d * 1800
      })
      kick()
    }

    const onMove = e => { const r = host.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; kick() }
    const onLeave = () => { mouse.x = mouse.y = -999 }
    const ro = new ResizeObserver(() => layout())
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    ro.observe(host)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [density])

  return <canvas ref={cvRef} aria-hidden="true" className="absolute inset-0 w-full h-full -z-1" />
}

/* Dark forest band used for heroes: dot field, lime glow and a giant faint wordmark. */
export function DarkBand({ id, word = 'NOVTRA', className, children, glow = true }) {
  return (
    <section id={id} className={cx('relative isolate overflow-hidden bg-forest-2 text-white', className)}>
      <DotField />
      {glow && <div aria-hidden="true" className="pointer-events-none absolute -z-1 left-1/2 -bottom-[40%] w-[120vw] h-[80vh] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(128,178,20,.22),rgba(128,178,20,.06)_55%,transparent)]" />}
      {word && (
        <div aria-hidden="true" className="pointer-events-none absolute -z-1 inset-x-0 bottom-[clamp(16px,4vh,40px)] flex justify-center whitespace-nowrap text-[clamp(90px,20vw,300px)] font-extrabold italic tracking-[-.055em] leading-[.8] text-white/[.045] animate-word-in">
          <span className="text-lime/20">PE-</span><span>{word}</span>
        </div>
      )}
      {children}
    </section>
  )
}
