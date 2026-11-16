import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../components/ui'
import { useStore } from '../store'

/* Section head with numbered circle, as on penovtra.com */
export function SecHead({ idx, light, children, className }) {
  return (
    <div className={cx('flex items-center gap-3.5', className ?? 'mb-7')}>
      <span className={cx('w-[34px] h-[34px] rounded-full border grid place-items-center text-[12px] font-semibold tabular-nums',
        light ? 'text-lime-2 border-forest-line' : 'text-forest border-line')}>{idx}</span>
      <p className={cx('text-[12px] font-medium tracking-[.18em] uppercase', light ? 'text-white/60' : 'text-muted')}>{children}</p>
    </div>
  )
}

/* Big heading with the italic lime word */
export const Title = ({ as: T = 'h2', light, className, children }) => (
  <T className={cx('font-semibold tracking-[-.035em] leading-[1.06]', light ? 'text-white' : 'text-forest', className ?? 'text-[clamp(34px,4.4vw,60px)]')}>{children}</T>
)
export const Em = ({ light, children }) => <em className={cx('italic font-bold', light ? 'text-lime-2' : 'text-lime')}>{children}</em>

export const Kicker = ({ className, children }) => (
  <span className={cx('block text-[11px] font-semibold tracking-[.14em] uppercase text-lime', className)}>{children}</span>
)

/* Product photo locked to a fixed box so every card is the same size */
export function ProductImg({ src, alt = '', inset = '14%', className, hover = true }) {
  return (
    <span className={cx('relative block bg-[radial-gradient(closest-side,#e6f2c8,#ffffff_95%)]', className ?? 'aspect-square')}>
      <img src={src} alt={alt} loading="lazy" draggable="false"
        className={cx('absolute object-contain transition-[scale] duration-700 ease-soft', hover && 'group-hover:scale-105')}
        style={{ top: inset, left: inset, width: `calc(100% - 2 * ${inset})`, height: `calc(100% - 2 * ${inset})` }} />
    </span>
  )
}

export function QtyStepper({ value, onChange, size = 'md', label = 'jumlah' }) {
  const h = size === 'lg' ? 'h-[54px]' : size === 'sm' ? 'h-10' : 'h-11'
  const w = size === 'lg' ? 'w-[50px]' : 'w-11'
  return (
    <div className={cx('inline-flex items-center rounded-full bg-white border border-ink/15', h)}>
      <button type="button" aria-label={`Kurangi ${label}`} onClick={() => onChange(value - 1)} disabled={value <= 1}
        className={cx(w, 'h-full grid place-items-center text-[19px] text-forest rounded-full disabled:opacity-35 hover:bg-forest/6')}>−</button>
      <span aria-live="polite" className="min-w-7 text-center text-[15px] font-semibold tabular-nums">{value}</span>
      <button type="button" aria-label={`Tambah ${label}`} onClick={() => onChange(value + 1)} disabled={value >= 10}
        className={cx(w, 'h-full grid place-items-center text-[19px] text-forest rounded-full disabled:opacity-35 hover:bg-forest/6')}>+</button>
    </div>
  )
}

/* Radio-style option card: pressed state = forest border, lime-tinted fill, filled dot */
export function Option({ on, onClick, className, children, dot = true }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick}
      className={cx('w-full text-left transition-[border-color,background-color,box-shadow] duration-300 ease-soft',
        on ? 'border-[1.5px] border-forest bg-[#f1f6e6] shadow-[0_10px_30px_-22px_rgba(0,72,58,.5)]' : 'border border-ink/12 bg-white hover:border-ink/25', className)}>
      {dot ? (
        <span className="flex items-start gap-3.5">
          <span aria-hidden="true" className={cx('flex-none mt-[3px] w-[18px] h-[18px] rounded-full box-border transition-[border] duration-300', on ? 'border-[5px] border-forest' : 'border-[1.5px] border-ink/30')} />
          <span className="flex-1 min-w-0">{children}</span>
        </span>
      ) : children}
    </button>
  )
}

/* Pill tabs, active = forest */
export function PillTabs({ items, value, onChange, label, className, itemClass }) {
  return (
    <div role="tablist" aria-label={label} className={cx('inline-flex flex-wrap gap-0.5 p-[5px] rounded-full bg-white border border-ink/12', className)}>
      {items.map(it => (
        <button key={it.id} type="button" role="tab" aria-selected={value === it.id} onClick={() => onChange(it.id)}
          className={cx('rounded-full text-[13.5px] font-medium transition-colors duration-300', itemClass ?? 'px-4 py-[9px]',
            value === it.id ? 'bg-forest text-white' : 'text-muted hover:text-forest')}>
          {it.label}
        </button>
      ))}
    </div>
  )
}

export function Field({ label, hint, right, children }) {
  return (
    <label className="grid gap-2 text-[13.5px] font-medium text-forest">
      {right ? <span className="flex justify-between gap-3"><span>{label}</span>{right}</span> : label}
      {children}
      {hint && <span className="px-2 text-[12.5px] font-normal text-muted">{hint}</span>}
    </label>
  )
}
export const inputCls = 'w-full box-border h-[54px] px-[22px] rounded-full border border-ink/18 bg-white text-[15px] font-normal text-ink placeholder:text-muted/80 transition-[border-color] focus:border-forest focus:outline-2 focus:outline-lime focus:outline-offset-1'

/* Checkout progress: 01 Keranjang → 04 Pembayaran, the line fills to the current step */
const STEP_LABELS = ['Keranjang', 'Masuk', 'Checkout', 'Pembayaran']
export function Steps({ current = 0 }) {
  const [fill, setFill] = useState(0)
  useEffect(() => { const id = requestAnimationFrame(() => setFill(current)); return () => cancelAnimationFrame(id) }, [current])
  return (
    <ol aria-label="Langkah belanja" className="relative grid grid-cols-4 mb-14 max-tab:mb-10">
      <li aria-hidden="true" className="absolute left-[22px] right-[25%] top-[21px] h-px bg-ink/15" />
      <li aria-hidden="true" className="absolute left-[22px] top-[21px] h-px bg-lime transition-[width] duration-[1.2s] ease-soft" style={{ width: `${fill * 25}%` }} />
      {STEP_LABELS.map((s, i) => (
        <li key={s} aria-current={i === current ? 'step' : undefined} className="relative flex items-center gap-3 max-tab:flex-col max-tab:items-start max-tab:gap-2">
          <span className={cx('w-11 h-11 rounded-full grid place-items-center text-[13px] font-bold transition-colors duration-500 box-border',
            i < current ? 'bg-forest text-white' : i === current ? 'bg-lime text-forest-3' : 'bg-paper border border-ink/18 text-muted font-semibold')}>
            {i < current ? '✓' : `0${i + 1}`}
          </span>
          <span className={cx('text-[15px] bg-paper pr-2.5 max-tab:text-[12.5px]', i === current ? 'font-semibold text-forest' : i < current ? 'text-forest' : 'text-muted')}>{s}</span>
        </li>
      ))}
    </ol>
  )
}

/* "Added to cart" toast, bottom center */
export function CartToast() {
  const { toast, clearToast, productBySlug } = useStore()
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(clearToast, 3200)
    return () => clearTimeout(id)
  }, [toast, clearToast])
  const p = toast && productBySlug(toast.slug)
  if (!p) return null
  return (
    <div role="status" key={toast.at} className="fixed z-50 left-1/2 bottom-6 -translate-x-1/2 w-[min(calc(100%_-_32px),520px)] animate-toast-in">
      <div className="flex items-center gap-3 p-2 pl-2 rounded-full bg-forest text-white shadow-[0_24px_50px_-24px_rgba(0,40,30,.7)]">
        <span className="relative w-11 h-11 flex-none rounded-full bg-white/10 overflow-hidden"><img src={p.img} alt="" className="absolute inset-1.5 w-8 h-8 object-contain" /></span>
        <span className="flex-1 min-w-0 text-[14px] truncate"><b className="font-semibold">{p.short}</b> masuk ke keranjang</span>
        <Link to="/marketplace/keranjang" onClick={clearToast} className="flex-none px-4 py-2.5 rounded-full bg-lime text-forest-3 text-[13.5px] font-medium hover:bg-lime-2">Lihat →</Link>
      </div>
    </div>
  )
}

export const Spinner = ({ className }) => (
  <span aria-hidden="true" className={cx('inline-block w-4 h-4 rounded-full border-2 border-current/25 border-t-current animate-spin', className)} />
)

/* Inline error under a form or button */
export function FormError({ children, className }) {
  if (!children) return null
  return (
    <p role="alert" className={cx('flex gap-2.5 px-[18px] py-3.5 rounded-[18px] bg-[#fdeceb] text-[13.5px] leading-[1.55] text-[#9b1c13] animate-swap', className)}>
      <span aria-hidden="true" className="flex-none grid place-items-center w-5 h-5 mt-px rounded-full bg-[#b42318] text-white text-[11px] font-bold">!</span>
      <span>{children}</span>
    </p>
  )
}

/* Full-height placeholder while a page waits for the API */
export function PageLoader({ dark, label = 'Memuat…' }) {
  return (
    <div role="status" className={cx('min-h-[70vh] grid place-items-center', dark ? 'bg-forest-2 text-white/70' : 'bg-paper text-muted')}>
      <span className="flex items-center gap-3 text-[14px]"><Spinner />{label}</span>
    </div>
  )
}

/* Shown when a request for page data fails */
export function LoadError({ onRetry, children = 'Data belum bisa dimuat.' }) {
  return (
    <div className="min-h-[60vh] grid place-items-center bg-paper px-5">
      <div className="max-w-[420px] text-center">
        <h2 className="mb-2 text-[28px] font-semibold tracking-[-.03em] text-forest">Ada <Em>gangguan.</Em></h2>
        <p className="mb-6 text-[15px] text-muted">{children} Periksa koneksi lalu coba lagi.</p>
        {onRetry && <button type="button" onClick={onRetry} className="h-12 px-6 rounded-full bg-forest text-white text-[14.5px] font-medium hover:bg-forest-2">Coba lagi</button>}
      </div>
    </div>
  )
}
