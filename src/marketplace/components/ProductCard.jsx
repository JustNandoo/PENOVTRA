import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../components/ui'
import { useStore } from '../store'
import { categoryLabel, rupiah } from '../data'
import { Kicker, ProductImg } from './atoms'

/* Catalog card. Fixed square photo, 2-line name and blurb so every card in a row lines up. */
export default function ProductCard({ p, style, className }) {
  const { addToCart } = useStore()
  const [done, setDone] = useState(false)
  const [notify, setNotify] = useState(false)
  const href = `/marketplace/produk/${p.slug}`

  const add = () => {
    addToCart(p.slug, 1, p.variants?.[0].id)
    setDone(true)
    setTimeout(() => setDone(false), 1400)
  }

  return (
    <article style={style} className={cx(
      'group flex flex-col bg-white border border-ink/12 rounded-[28px] overflow-hidden',
      'transition-[translate,box-shadow] duration-600 ease-soft hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,72,58,.4)]',
      className
    )}>
      <Link to={href} className="relative block" tabIndex={-1} aria-hidden="true">
        <ProductImg src={p.img} />
        {p.soon
          ? <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white border border-ink/15 text-[11.5px] font-medium text-ink-2">Segera hadir</span>
          : p.tag && <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-forest text-white text-[11.5px] font-medium">{p.tag}</span>}
      </Link>
      <div className="flex flex-col gap-1.5 px-[22px] pt-1 pb-[22px] flex-1 max-xs:px-3.5 max-xs:pb-4">
        <Kicker className="max-xs:text-[10px]">{categoryLabel(p.cat)}</Kicker>
        <Link to={href} className="line-clamp-2 min-h-[2.6em] text-[17px] font-semibold leading-[1.3] tracking-[-.01em] text-forest hover:underline underline-offset-4 max-xs:text-[14px]">{p.name}</Link>
        <p className="line-clamp-2 min-h-[3.1em] text-[13.5px] leading-[1.55] text-muted max-xs:hidden">{p.blurb}</p>
        <div className="mt-auto pt-4 flex items-center justify-between gap-2.5 max-xs:pt-2">
          {p.soon ? (
            <>
              <span className="text-[13px] text-muted max-xs:hidden">Harga diumumkan saat rilis</span>
              <button type="button" onClick={() => setNotify(n => !n)} aria-pressed={notify}
                className={cx('flex-none px-4 py-2.5 rounded-full text-[13px] font-medium transition-colors duration-300 max-xs:w-full',
                  notify ? 'bg-forest text-white' : 'border border-ink/20 text-forest hover:border-forest')}>
                {notify ? 'Diingatkan ✓' : 'Ingatkan saya'}
              </button>
            </>
          ) : (
            <>
              <span className="flex flex-col">
                <span className="text-[21px] font-bold tracking-[-.03em] text-forest max-xs:text-[15px]">{rupiah(p.price)}</span>
                <span className="text-[12px] text-muted max-xs:hidden">{p.unit}</span>
              </span>
              <button type="button" onClick={add} aria-label={`Tambah ${p.name} ke keranjang`}
                className={cx('flex-none w-12 h-12 rounded-full grid place-items-center text-[22px] leading-none transition-[background-color,scale] duration-300 active:scale-90 max-xs:w-9 max-xs:h-9 max-xs:text-[18px]',
                  done ? 'bg-forest text-white' : 'bg-lime text-forest-3 hover:bg-lime-2')}>
                {done ? '✓' : '+'}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
