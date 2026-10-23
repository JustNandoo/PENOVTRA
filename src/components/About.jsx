import { useMemo, useRef, useState } from 'react'
import { useInView, prefersReducedMotion } from '../hooks/useInView'
import { useScrollFrame } from '../hooks/useScrollFrame'
import { CountUp, Icon, Reveal, SecHead, cx } from './ui'

/* ============ PROBLEM ============ */
const STATS = [
  { v: 66.7, text: 'responden pernah mengalami gagal panen dan tanaman rusak.' },
  { v: 55.6, text: 'menyebut hama & penyakit sebagai penyebab utama.' },
  { v: 51.9, text: 'terkendala cuaca ekstrem: panas terik dan hujan lebat.', warn: true },
]

function Stat({ v, text, warn }) {
  const [ref, inView] = useInView()
  return (
    <article
      ref={ref}
      className={cx(
        'grid grid-cols-[auto_1fr] gap-x-7 gap-y-1.5 items-end py-[30px] border-t border-line last:border-b max-xs:grid-cols-1',
        'transition-[opacity,translate] duration-1000 ease-soft',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
      )}
    >
      <div className="row-span-2 text-[clamp(56px,7vw,100px)] font-semibold tracking-[-.05em] leading-[.9] text-forest tabular-nums max-xs:row-auto">
        <CountUp to={v} dec={1} />
        <sup className={cx('text-[.38em] font-medium align-top relative top-[.25em] ml-1 [line-height:inherit]', warn ? 'text-warn' : 'text-lime')}>%</sup>
      </div>
      <div className="h-1 bg-mist rounded overflow-hidden">
        <i
          className={cx('block h-full rounded transition-[width] duration-[1.6s] ease-soft delay-300', warn ? 'bg-warn' : 'bg-forest')}
          style={{ width: inView ? `${v}%` : 0 }}
        />
      </div>
      <p className="text-ink-2 text-[15px] max-w-[30ch]">{text}</p>
    </article>
  )
}

export function Problem() {
  return (
    <section id="tentang" className="wrap pt-[clamp(90px,12vw,160px)] pb-10">
      <SecHead idx="01">Latar belakang</SecHead>
      <div className="grid grid-cols-[1fr_1.1fr] gap-[clamp(40px,6vw,100px)] items-start max-tab:grid-cols-1">
        <Reveal as="h2" className="text-[clamp(30px,3.6vw,50px)] text-forest sticky top-[120px] max-tab:static">
          Berkebun di rumah makin diminati. Tapi banyak yang berakhir <em className="text-warn">gagal panen.</em>
        </Reveal>
        <div className="grid">
          {STATS.map(s => <Stat key={s.v} {...s} />)}
        </div>
      </div>
      <p className="mt-7 text-[12px] text-muted max-w-[80ch]">
        Sumber: BPS, Statistik Hortikultura 2024 (2025); Akbar et al. (2025), <i>The Journal of Indonesia Sustainable Development Planning</i> 6(2), 328–346; social listening TikTok PE-NOVTRA (2026).
      </p>
    </section>
  )
}

/* ============ STATEMENT + PILLARS ============ */
const STATEMENT = 'adalah smart home growing system modular yang menggabungkan media tanam dan hidroponik dalam satu desain. Dirancang untuk melindungi tanaman dari hama dan cuaca, supaya budidaya di rumah jadi praktis dengan bantuan teknologi digital.'
const HIGHLIGHT = ['media', 'tanam', 'hidroponik', 'satu', 'desain.']

/* Words fill in as the paragraph scrolls through the viewport. */
function Statement() {
  const ref = useRef(null)
  const words = useMemo(() => STATEMENT.split(/\s+/), [])
  const total = words.length + 1 // + brand word
  const [n, setN] = useState(0)

  useScrollFrame(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) { setN(total); return }
    const r = el.getBoundingClientRect()
    const k = Math.min(1, Math.max(0, (innerHeight * .82 - r.top) / (r.height + innerHeight * .35)))
    setN(Math.round(k * total))
  })

  const w = (on, hl) => cx('transition-colors duration-400', on ? (hl ? 'text-lime' : 'text-forest') : 'text-ink/14')

  return (
    <p ref={ref} className="text-[clamp(26px,3.3vw,46px)] leading-[1.28] tracking-[-.025em] font-medium max-w-[1100px]">
      <span className="italic font-extrabold text-forest"><span className={w(n > 0, true)}>PE-NOVTRA</span></span>{' '}
      {words.map((word, i) => (
        <span key={i}>
          <span className={w(i + 1 < n, HIGHLIGHT.includes(word))}>{word}</span>{i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}

const PILLARS = [
  {
    t: '2-in-1 Cultivation', d: 'Media tanam dan hidroponik berdampingan dalam satu bak. Pilih sesuai jenis tanaman.',
    icon: <><path d="M24 40V22" /><path d="M24 26c0-8 6-12 14-12 0 8-6 12-14 12Z" /><path d="M24 30c0-6-5-10-12-10 0 6 5 10 12 10Z" /><path d="M8 40h32" /></>,
  },
  {
    t: 'Protected Growing', d: 'Naungan insect net melindungi tanaman dari hama dan cuaca ekstrem.',
    icon: <><path d="M6 34c0-12 8-22 18-22s18 10 18 22" /><path d="M12 34c0-9 5-16 12-16s12 7 12 16" /><path d="M4 34h40" /><path d="M18 14l-2-4M30 14l2-4" /></>,
  },
  {
    t: 'Smart Environment', d: 'Sensor membaca kondisi lingkungan, kipas dan lampu bisa diatur otomatis lewat aplikasi.',
    icon: <><rect x="14" y="6" width="20" height="36" rx="4" /><path d="M19 30l4-5 3 3 4-6" /><circle cx="24" cy="37" r="1" /></>,
  },
  {
    t: 'Modular Estetik', d: 'Mudah dipasang dan tampil rapi di teras, balkon, atau halaman rumah modern.',
    icon: <><rect x="5" y="18" width="18" height="12" rx="2" /><rect x="25" y="18" width="18" height="12" rx="2" /><path d="M9 30v10M39 30v10M19 30v6M29 30v6" /></>,
  },
]
const ROMAN = ['i.', 'ii.', 'iii.', 'iv.']

export function About() {
  return (
    <section className="pt-[clamp(90px,10vw,140px)] pb-[clamp(90px,10vw,150px)]">
      <div className="wrap">
        <Statement />

        <div className="mt-[clamp(60px,8vw,110px)] grid grid-cols-4 border-t border-line max-lap:grid-cols-2 max-xs:grid-cols-1">
          {PILLARS.map((p, i) => (
            <Reveal
              as="article"
              key={p.t}
              delay={i * .08}
              className={cx(
                'group relative pt-[34px] pr-7 pb-2.5',
                i > 0 && 'pl-7 border-l border-line',
                i === 2 && 'max-lap:border-l-0 max-lap:pl-0',
                i >= 2 && 'max-lap:border-t',
                i > 0 && 'max-xs:border-l-0 max-xs:pl-0 max-xs:border-t'
              )}
            >
              <span className="absolute right-[22px] top-[30px] italic text-muted text-[14px]">{ROMAN[i]}</span>
              <Icon className="inline align-baseline w-11 h-11 stroke-forest [stroke-width:1.6] mb-10 transition-[stroke,translate] duration-[.3s,.6s] ease-soft group-hover:stroke-lime group-hover:-translate-y-1">
                {p.icon}
              </Icon>
              <h3 className="text-[20px] text-forest mb-2.5">{p.t}</h3>
              <p className="text-[14.5px] text-muted">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
