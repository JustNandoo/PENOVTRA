import { useRef, useState } from 'react'
import { prefersReducedMotion } from '../hooks/useInView'
import { useScrollFrame } from '../hooks/useScrollFrame'
import { CountUp, H2, Icon, Reveal, SecHead, cx } from './ui'

const STEPS = [
  {
    t: 'Choose', d: 'Pilih media tanam atau hidroponik sesuai tanaman yang ingin dibudidayakan.',
    icon: <><path d="M24 42V24" /><path d="M24 28c0-9 7-14 15-14 0 9-7 14-15 14Z" /><path d="M24 32c0-7-6-11-13-11 0 7 6 11 13 11Z" /></>,
  },
  {
    t: 'Sense', d: 'Sensor membaca suhu, kelembapan, dan intensitas cahaya di sekitar tanaman.',
    icon: <><rect x="13" y="13" width="22" height="22" rx="3" /><rect x="19" y="19" width="10" height="10" rx="1" /><path d="M19 7v6M29 7v6M19 35v6M29 35v6M7 19h6M7 29h6M35 19h6M35 29h6" /></>,
  },
  {
    t: 'Adapt', d: 'Naungan dan kipas ventilasi menyesuaikan kondisi agar tanaman tetap nyaman.',
    icon: <><circle cx="24" cy="24" r="17" /><circle cx="24" cy="24" r="3" /><path d="M24 21c-2-6 2-10 6-9-1 4-3 7-6 9ZM27 25c6-1 9 3 8 7-4-1-7-3-8-7ZM21 26c-4 5-9 4-10 0 4-2 7-1 10 0Z" /></>,
  },
  {
    t: 'Grow', d: 'Pantau dan rawat tanaman dari aplikasi, lalu nikmati panen yang lebih konsisten.',
    icon: <><rect x="14" y="5" width="20" height="38" rx="4" /><path d="M20 9h8" /><path d="M19 30l4-5 3 3 4-6" /></>,
  },
]

const IMPACT = [
  { b: <><CountUp to={90} />%</>, s: 'potensi penurunan serangan hama' },
  { b: 'Lebih stabil', s: 'pertumbuhan tanaman di cuaca ekstrem' },
  { b: 'Panen lebih mudah', s: 'perawatan minim, hasil lebih konsisten' },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const [prog, setProg] = useState(0)

  // the connecting line draws and each step lights up as the row scrolls in
  useScrollFrame(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setProg(Math.min(1, Math.max(0, (innerHeight * .75 - r.top) / (innerHeight * .5))))
  })
  const reduced = prefersReducedMotion()

  return (
    <section id="cara-kerja" className={cx(
      'relative overflow-hidden bg-forest-2 text-white py-[clamp(90px,10vw,150px)]',
      'before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(rgba(255,255,255,.07)_1.2px,transparent_1.4px)] before:bg-size-[34px_34px]',
      'before:[mask-image:linear-gradient(180deg,transparent,#000_30%,#000_70%,transparent)]'
    )}>
      <div className="wrap">
        <div className="relative flex flex-col mb-[clamp(50px,7vw,90px)]">
          <SecHead idx="03" light>Cara kerja</SecHead>
          <H2 light>Empat langkah dari bibit <em>sampai panen.</em></H2>
        </div>

        <ol
          ref={ref}
          style={{ '--prog': prog }}
          className={cx(
            'relative grid grid-cols-4 max-tab:grid-cols-2 max-tab:gap-x-5 max-tab:gap-y-[50px] max-xs:grid-cols-1',
            'before:absolute before:inset-x-0 before:top-9 before:h-px before:bg-forest-line max-tab:before:hidden',
            'after:absolute after:left-0 after:top-9 after:h-px after:w-[calc(var(--prog,0)_*_100%)] after:bg-lime-2 after:transition-[width] after:duration-200 after:ease-linear max-tab:after:hidden'
          )}
        >
          {STEPS.map((s, i) => {
            const on = reduced || prog >= i / STEPS.length + .02
            return (
              <li key={s.t} className="relative pr-[30px]">
                <div className={cx(
                  'relative z-1 w-[72px] h-[72px] rounded-full grid place-items-center border transition-[background-color,border-color] duration-500',
                  on ? 'bg-lime border-lime' : 'bg-forest-2 border-forest-line'
                )}>
                  <Icon className={cx('w-[34px] h-[34px] [stroke-width:1.6] transition-[stroke] duration-500', on ? 'stroke-forest-3' : 'stroke-white/70')}>
                    {s.icon}
                  </Icon>
                </div>
                <span className="block mt-[30px] mb-1.5 text-[12px] text-white/45 tabular-nums tracking-[.1em]">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={cx('text-[clamp(28px,3vw,40px)] italic font-bold tracking-[-.035em] mb-3 transition-colors duration-500', on ? 'text-white' : 'text-white/35')}>{s.t}</h3>
                <p className="text-white/62 text-[14.5px] font-light max-w-[26ch]">{s.d}</p>
              </li>
            )
          })}
        </ol>

        <div className="relative mt-[clamp(70px,9vw,120px)] grid grid-cols-3 border-t border-forest-line max-tab:grid-cols-1">
          {IMPACT.map((it, i) => (
            <Reveal key={i} className={cx(
              'grid gap-1.5 pt-[30px] pr-[30px]',
              i > 0 && 'pl-[30px] border-l border-forest-line max-tab:pl-0 max-tab:border-l-0 max-tab:border-t max-tab:mt-6'
            )}>
              <b className="text-[clamp(28px,3vw,44px)] font-semibold tracking-[-.035em] text-lime-2 leading-[1.05]">{it.b}</b>
              <span className="text-white/62 text-[14px]">{it.s}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
