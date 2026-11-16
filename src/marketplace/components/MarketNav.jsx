import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useScrollFrame } from '../../hooks/useScrollFrame'
import { cx } from '../../components/ui'
import { useStore } from '../store'

export function Brand({ className }) {
  return (
    <span className={cx('inline-flex items-center gap-2.5 font-extrabold italic text-[18px] tracking-[-.02em]', className)}>
      <img src="/assets/leaf.png" alt="" width="22" height="24" />
      <span><i className="text-lime">PE-</i>NOVTRA</span>
    </span>
  )
}

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20.5 8H6" /><circle cx="10" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" />
  </svg>
)

/* Same links as the Home navbar (its sections) plus Marketplace.
   Dark glass while over a dark hero (#mk-hero), light glass everywhere else. */
const HOME_LINKS = [
  ['/#tentang', 'Tentang'],
  ['/#alat', 'Alat'],
  ['/#cara-kerja', 'Cara Kerja'],
  ['/#ekosistem', 'Ekosistem'],
  ['/#perjalanan', 'Perjalanan'],
]

export default function MarketNav() {
  const { count, user } = useStore()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(false)

  const measure = () => {
    const hero = document.getElementById('mk-hero')
    setLight(!hero || hero.getBoundingClientRect().bottom < 80)
  }
  useScrollFrame(measure)
  // a new page may or may not start with a dark hero, so re-check after it renders
  useEffect(() => {
    setOpen(false)
    const id = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(id)
  }, [pathname])

  const onMarket = !pathname.startsWith('/marketplace/profil')
  const dark = !light && !open
  const link = 'px-3.5 py-2 rounded-full text-[14px] transition-[opacity,background-color] duration-200 hover:opacity-100 hover:bg-[rgba(127,127,127,.14)]'
  const active = dark ? 'opacity-100 font-semibold bg-white/12' : 'opacity-100 font-semibold bg-forest/8 text-forest'

  return (
    <header className={cx(
      'fixed z-50 top-4 left-1/2 -translate-x-1/2 w-[min(calc(100%_-_32px),1180px)] animate-nav-in',
      'border backdrop-blur-[14px] backdrop-saturate-[1.4] transition-[background-color,color,border-color,border-radius] duration-400',
      open ? 'rounded-[28px]' : 'rounded-full',
      dark ? 'bg-forest-3/55 text-white border-white/14' : 'bg-paper/90 text-ink border-line'
    )}>
      <div className="h-16 flex items-center justify-between gap-4 pl-[22px] pr-2.5 max-xs:pl-4">
        <Link to="/" aria-label="PE-NOVTRA, ke Home"><Brand /></Link>

        <nav aria-label="Navigasi utama" className="flex gap-0.5 max-lap:hidden">
          {HOME_LINKS.map(([to, l]) => <Link key={to} to={to} className={cx(link, 'opacity-80')}>{l}</Link>)}
          <Link to="/marketplace" aria-current={onMarket ? 'page' : undefined} className={cx(link, 'inline-flex items-center gap-2', onMarket ? active : 'opacity-80')}>
            Marketplace <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-lime-2" />
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/marketplace/keranjang" aria-label={`Keranjang, ${count} produk`}
            className={cx('relative w-11 h-11 rounded-full grid place-items-center border transition-colors duration-300',
              pathname === '/marketplace/keranjang' ? 'bg-forest text-white border-forest' : dark ? 'border-white/20 hover:bg-white/10' : 'border-ink/15 hover:bg-forest/8')}>
            <CartIcon />
            {count > 0 && (
              <span key={count} className={cx('absolute -top-1 -right-1 min-w-[19px] h-[19px] px-[5px] box-border rounded-full grid place-items-center text-[11px] font-bold animate-bump',
                dark || pathname === '/marketplace/keranjang' ? 'bg-lime-2 text-forest-3' : 'bg-forest text-white')}>{count}</span>
            )}
          </Link>

          {user ? (
            <Link to="/marketplace/profil" aria-label={`Profil ${user.first}`}
              className={cx('inline-flex items-center gap-2 pl-1 pr-3.5 py-1 rounded-full text-[14px] font-medium transition-colors duration-300 max-xs:pr-1',
                pathname.startsWith('/marketplace/profil') ? 'bg-lime text-forest-3' : dark ? 'bg-white/10' : 'bg-forest text-white')}>
              <span className="w-9 h-9 rounded-full bg-lime-2 text-forest-3 grid place-items-center font-bold">{user.first[0]}</span>
              <span className="max-xs:hidden">{user.first}</span>
            </Link>
          ) : (
            <Link to="/marketplace/masuk" className="px-5 py-2.5 rounded-full bg-lime text-forest-3 text-[14px] font-medium transition-colors hover:bg-lime-2 max-xs:px-4">Masuk</Link>
          )}

          <button type="button" aria-label="Buka menu" aria-expanded={open} onClick={() => setOpen(o => !o)}
            className="lap:hidden relative w-11 h-11 rounded-full border-0 bg-lime">
            <span className={cx('absolute left-[13px] right-[13px] top-[18px] h-0.5 bg-forest-3 transition-[translate,rotate] duration-300', open && 'translate-y-[3px] rotate-45')} />
            <span className={cx('absolute left-[13px] right-[13px] top-[24px] h-0.5 bg-forest-3 transition-[translate,rotate] duration-300', open && '-translate-y-[3px] -rotate-45')} />
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Menu" className="lap:hidden grid gap-1 px-4 pb-4 animate-swap">
          {HOME_LINKS.map(([to, l]) => <Link key={to} to={to} className="px-3 py-3 rounded-2xl text-[18px] hover:bg-forest/8">{l}</Link>)}
          <Link to="/marketplace" className="px-3 py-3 rounded-2xl text-[18px] font-semibold text-forest bg-forest/8">Marketplace</Link>
          <Link to={user ? '/marketplace/profil' : '/marketplace/masuk'} className="px-3 py-3 rounded-2xl text-[18px] hover:bg-forest/8">{user ? 'Profil & pesanan' : 'Masuk / Daftar'}</Link>
        </nav>
      )}
    </header>
  )
}
