import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../hooks/useInView'
import { Btn, Pill, PulseDot, cx } from './ui'

/* ---------- planting field ----------
   A grid of net-pot holes. Sprouts grow where the cursor passes
   and slowly settle back, so visitors "plant" the hero. */
function usePlantingField(heroRef, canvasRef) {
  useEffect(() => {
    const hero = heroRef.current, cv = canvasRef.current
    const ctx = cv.getContext('2d')
    const reduced = prefersReducedMotion()
    const GAP = 34
    let pts = [], W = 0, H = 0, dpr = 1, running = false, raf = 0
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
      // two leaves
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
      const R = 130
      for (const p of pts) {
        if (p.delay !== undefined && now - t0 > p.delay) { p.tg = Math.max(p.tg, .55 + p.seed * 2); delete p.delay }
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        if (d < R) p.tg = Math.max(p.tg, 1 - d / R)
        p.g += (p.tg - p.g) * .08
        p.tg *= .996                       // slowly wilt back
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
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = hero.clientWidth; H = hero.clientHeight
      cv.width = W * dpr; cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      pts = []
      const ox = (W % GAP) / 2 + GAP / 2, oy = (H % GAP) / 2 + GAP / 2
      for (let y = oy; y < H; y += GAP)
        for (let x = ox; x < W; x += GAP)
          pts.push({ x, y, g: 0, tg: 0, rot: (Math.random() - .5) * .5, seed: Math.random() })
      // an opening wave of sprouts rising from the bottom-left corner
      if (!reduced) pts.forEach(p => {
        const d = Math.hypot(p.x, H - p.y) / Math.hypot(W, H)
        if (p.seed < .16) p.delay = 300 + d * 1800
      })
      kick()
    }

    const onMove = e => {
      const r = hero.getBoundingClientRect()
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top
      kick()
    }
    const onLeave = () => { mouse.x = mouse.y = -999 }
    let rz
    const onResize = () => { clearTimeout(rz); rz = setTimeout(layout, 120) }

    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    layout()
    return () => {
      cancelAnimationFrame(raf)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [heroRef, canvasRef])
}

/* ---------- live telemetry ---------- */
const TELE = {
  temp: { v: 28.4, min: 27.6, max: 29.4, step: .3, dec: 1 },
  hum: { v: 67, min: 63, max: 71, step: 1.5, dec: 0 },
  lux: { v: 865, min: 820, max: 910, step: 14, dec: 0 },
}
function useTelemetry() {
  const [vals, setVals] = useState(() => Object.fromEntries(Object.entries(TELE).map(([k, s]) => [k, s.v])))
  useEffect(() => {
    const id = setInterval(() => {
      setVals(prev => {
        const next = {}
        for (const k in TELE) {
          const s = TELE[k]
          next[k] = Math.min(s.max, Math.max(s.min, prev[k] + (Math.random() - .5) * 2 * s.step))
        }
        return next
      })
    }, 2200)
    return () => clearInterval(id)
  }, [])
  return {
    temp: vals.temp.toFixed(TELE.temp.dec),
    hum: vals.hum.toFixed(TELE.hum.dec),
    lux: vals.lux.toFixed(TELE.lux.dec),
  }
}

/* sensor points on the device render, in % of the image */
const ANCHORS = [[73.6, 13.8], [35, 17], [20, 59], [76, 53]]
const LEADS = ['73.6,13.8 86,4 104,4', '35,17 22,6 -6,6', '20,59 8,48 -10,48', '76,53 92,40 108,40']

function Chip({ label, delay, className, children }) {
  return (
    <div
      className={cx(
        'absolute grid gap-0.5 px-3.5 py-2.5 rounded-[14px] min-w-[150px] -translate-y-1/2',
        'bg-forest-3/55 border border-white/14 backdrop-blur-[10px] animate-chip-in',
        'max-tab:min-w-0 max-tab:px-[11px] max-tab:py-2',
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <small className="whitespace-nowrap text-[11px] tracking-[.06em] text-white/60 max-tab:text-[10px]">{label}</small>
      <b className="text-[18px] font-semibold tracking-[-.01em] tabular-nums flex items-center gap-2 max-tab:text-[15px]">{children}</b>
    </div>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const canvasRef = useRef(null)
  const deviceRef = useRef(null)
  const t = useTelemetry()
  usePlantingField(heroRef, canvasRef)

  // device parallax
  useEffect(() => {
    if (prefersReducedMotion()) return
    const hero = heroRef.current
    const onMove = e => {
      const nx = e.clientX / window.innerWidth - .5, ny = e.clientY / window.innerHeight - .5
      deviceRef.current.style.translate = `${nx * -14}px ${ny * -8}px`
    }
    hero.addEventListener('pointermove', onMove)
    return () => hero.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <section id="hero" ref={heroRef} className="relative isolate flex flex-col min-h-[max(100svh,760px)] overflow-hidden bg-forest-2 text-white">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full -z-1" />
      <div aria-hidden="true" className="pointer-events-none absolute -z-1 left-1/2 -bottom-[30%] w-[120vw] h-[90vh] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(128,178,20,.22),rgba(128,178,20,.06)_55%,transparent)]" />

      <div className="wrap relative z-3 pt-[clamp(104px,13vh,136px)]">
        <div>
          <Pill tone="glass" className="mb-[22px] animate-fade-up" style={{ animationDelay: '.1s' }}>
            <PulseDot />2-in-1 Smart Modular Growing System
          </Pill>
          <h1 className="text-[clamp(40px,4.9vw,80px)] font-semibold tracking-[-.04em] leading-[1.02]">
            <span className="sr-only">PE-NOVTRA, alat berkebun 2-in-1 media tanam dan hidroponik: </span>
            <span className="block overflow-hidden pb-[.06em]">
              <span className="inline-block animate-line-up" style={{ animationDelay: '.18s' }}>Menanam tanpa batas,</span>
            </span>{' '}
            <span className="block overflow-hidden pb-[.06em]">
              <span className="inline-block animate-line-up" style={{ animationDelay: '.3s' }}><em className="text-lime-2 font-bold">tanpa cemas.</em></span>
            </span>
          </h1>
        </div>
        <div className="absolute right-[var(--gutter)] bottom-1 max-w-[380px] animate-fade-up max-tab:static max-tab:mt-[22px]" style={{ animationDelay: '.55s' }}>
          <p className="text-white/72 text-[16px] font-light mb-6">
            Media tanam dan hidroponik dalam satu bak modular, terlindung dari hama dan cuaca ekstrem, dan bisa dipantau langsung dari ponsel.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Btn href="#alat" tone="lime" arrow="→">Jelajahi alatnya</Btn>
            <Btn href="#kontak" tone="ghost">Konsultasi</Btn>
          </div>
        </div>
      </div>

      <div className="relative flex flex-[1_0_auto] items-end justify-center">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[clamp(30px,6vh,70px)] flex justify-center whitespace-nowrap text-[clamp(90px,21vw,340px)] font-extrabold italic tracking-[-.055em] leading-[.8] text-white/[.045] animate-word-in">
          <span className="text-lime/20">PE-</span><span>NOVTRA</span>
        </div>

        <div
          ref={deviceRef}
          className={cx(
            'relative z-2 w-[min(58vw,820px,calc((100svh_-_390px)_*_1.22))] min-w-[440px] mb-[clamp(60px,8vh,84px)] animate-device-in',
            "after:content-[''] after:absolute after:-z-1 after:left-[8%] after:right-[4%] after:-bottom-3.5 after:h-[34px] after:bg-[radial-gradient(closest-side,rgba(0,0,0,.55),transparent)] after:blur-[6px]",
            'max-tab:w-[min(92vw,640px)] max-tab:min-w-0 max-tab:mt-[90px]'
          )}
        >
          <img
            src="/assets/device.webp" width="1600" height="1306" fetchpriority="high"
            alt="Unit PE-NOVTRA: bak modular berkaki dengan naungan insect net terbuka, sisi kiri media tanam dan sisi kanan hidroponik"
            className="w-full h-auto drop-shadow-[0_40px_50px_rgba(0,0,0,.45)]"
          />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full overflow-visible max-tab:hidden">
            {LEADS.map(pts => (
              <polyline key={pts} points={pts} className="fill-none stroke-lime-2/75 [stroke-width:1] [vector-effect:non-scaling-stroke] [stroke-dasharray:400] [stroke-dashoffset:400] animate-draw" />
            ))}
          </svg>
          {ANCHORS.map(([x, y]) => (
            <span key={x} style={{ left: `${x}%`, top: `${y}%` }} className="absolute w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-lime-2 shadow-[0_0_0_4px_rgba(154,205,43,.25)] animate-pop after:absolute after:-inset-1.5 after:rounded-full after:border after:border-lime-2 after:animate-ring-late" />
          ))}

          <Chip label="Kipas sirkulasi" delay={1.5} className="left-[104%] top-[4%] max-lap:left-[96%] max-tab:left-auto max-tab:right-0 max-tab:top-[-14%]">
            <span className="w-2 h-2 rounded-full bg-lime-2 shadow-[0_0_10px_var(--color-lime-2)]" />ON · Auto
          </Chip>
          <Chip label="Suhu dalam naungan" delay={1.35} className="right-[106%] top-[6%] max-lap:right-[96%] max-tab:right-auto max-tab:left-0 max-tab:top-[-6%]">
            <span>{t.temp}</span>°C
          </Chip>
          <Chip label="Kelembapan" delay={1.65} className="right-[110%] top-[48%] max-lap:right-[96%] max-tab:hidden">
            <span>{t.hum}</span>%
          </Chip>
          <Chip label="Intensitas cahaya" delay={1.8} className="left-[108%] top-[40%] max-lap:left-[96%] max-tab:hidden">
            <span>{t.lux}</span> lux
          </Chip>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-3 flex items-center justify-between px-[var(--gutter)] pt-4 pb-[22px] border-t border-forest-line bg-[linear-gradient(transparent,rgba(2,42,33,.5))]">
        <span aria-hidden="true" className="relative w-[22px] h-[34px] rounded-xl border border-white/35 max-tab:hidden">
          <i className="absolute left-1/2 top-[7px] w-[3px] h-[7px] -ml-[1.5px] rounded-[2px] bg-lime-2 animate-cue" />
        </span>
        <ul className="flex gap-[clamp(20px,5vw,64px)] text-[13px] text-white/60 max-xs:gap-4 max-xs:text-[12px]">
          <li><b className="text-white font-semibold mr-2">2-in-1</b>media tanam + hidroponik</li>
          <li><b className="text-white font-semibold mr-2">IoT</b>sensor &amp; kontrol via aplikasi</li>
          <li className="max-tab:hidden"><b className="text-white font-semibold mr-2">1 tahun</b>garansi produk</li>
        </ul>
      </div>
    </section>
  )
}
