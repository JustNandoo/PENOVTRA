import { useEffect, useState } from 'react'
import { useInView, prefersReducedMotion } from '../hooks/useInView'

const cx = (...c) => c.filter(Boolean).join(' ')
export { cx }

/* Fades + rises into place when scrolled into view. `tx` swaps the transition when an
   element also has its own hover motion (that transition wins, as in the original CSS). */
export function Reveal({ as: Tag = 'div', className, delay = 0, tx, style, children, ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={cx(
        tx ?? 'transition-[opacity,translate] duration-1000 ease-soft',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7',
        'motion-reduce:opacity-100 motion-reduce:translate-y-0',
        className
      )}
      style={{ transitionDelay: delay ? `${delay}s` : undefined, ...style }}
      data-in={inView || undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* Counts from 0 to `to` once visible. Indonesian decimal comma. */
export function CountUp({ to, dec = 0 }) {
  const [ref, inView] = useInView()
  const fmt = v => v.toFixed(dec).replace('.', ',')
  const [val, setVal] = useState(fmt(0))

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion()) { setVal(fmt(to)); return }
    let raf
    const t = performance.now(), dur = 1600
    const tick = now => {
      const k = Math.min(1, (now - t) / dur), e = 1 - Math.pow(1 - k, 4)
      setVal(fmt(to * e))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to, dec])

  return <span ref={ref}>{val}</span>
}

export const Eyebrow = ({ className, children }) => (
  <p className={cx('text-[12px] font-medium tracking-[.18em] uppercase', className ?? 'text-muted')}>{children}</p>
)

export function SecHead({ idx, children, light, className }) {
  return (
    <div className={cx('flex items-center gap-3.5', className ?? 'mb-7')}>
      <span className={cx(
        'w-[34px] h-[34px] rounded-full border grid place-items-center text-[12px] font-semibold tabular-nums',
        light ? 'text-lime border-forest-line' : 'text-forest border-line'
      )}>{idx}</span>
      <Eyebrow className={light ? 'text-white/60' : 'text-muted'}>{children}</Eyebrow>
    </div>
  )
}

/* Section heading; pass the max width per section (default 16ch). */
export const H2 = ({ light, className = 'max-w-[16ch]', children }) => (
  <Reveal as="h2" className={cx('text-[clamp(32px,4.6vw,64px)]', light ? 'text-white' : 'text-forest', className)}>
    {children}
  </Reveal>
)

const pillTone = {
  glass: 'text-white bg-white/6 border border-white/16 backdrop-blur-[8px]',
  dark: 'bg-forest text-white',
  lime: 'bg-lime text-white',
}
export const Pill = ({ tone = 'dark', className, style, children }) => (
  <p className={cx('inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap', pillTone[tone], className)} style={style}>
    {children}
  </p>
)

export const PulseDot = () => <span className="w-2 h-2 rounded-full bg-lime-2 animate-pulse-dot" />

const btnTone = {
  lime: 'bg-lime text-forest-3 hover:bg-lime-2',
  ghost: 'text-white border-white/25 hover:border-white',
  dark: 'bg-forest text-white hover:bg-forest-2',
}
export function Btn({ href, tone = 'lime', arrow, className, children }) {
  return (
    <a href={href} className={cx(
      'group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full font-medium text-[15px] border border-transparent',
      'transition-[translate,background-color,color,border-color] duration-[.4s,.3s,.3s,.3s] ease-soft',
      btnTone[tone], className
    )}>
      {children}
      {arrow && <span aria-hidden="true" className="transition-[translate] duration-400 ease-soft group-hover:translate-x-1">{arrow}</span>}
    </a>
  )
}

export const Tag = ({ children }) => (
  <span className="inline-block text-[11px] font-semibold tracking-[.14em] uppercase text-lime mb-2.5">{children}</span>
)

/* Line icon wrapper — every icon on the site shares this stroke style. */
export const Icon = ({ className, children, viewBox = '0 0 48 48' }) => (
  <svg viewBox={viewBox} aria-hidden="true" className={cx('fill-none [stroke-linecap:round] [stroke-linejoin:round]', className)}>
    {children}
  </svg>
)
