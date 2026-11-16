import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, cx } from '../../components/ui'
import { DarkBand, DotField } from '../components/DotField'
import ProductCard from '../components/ProductCard'
import { Em, Kicker, PillTabs, SecHead, Title } from '../components/atoms'
import { useStore } from '../store'
import { api, qs } from '../api'
import { METHODS, PRICE_RANGES, SORTS, rupiah } from '../data'

const scrollToCatalog = () => document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

function Hero({ q, setQ }) {
  const { productBySlug } = useStore()
  const unit = productBySlug('pe-novtra-2-in-1')
  const [draft, setDraft] = useState(q)
  const submit = e => { e.preventDefault(); setQ(draft); scrollToCatalog() }
  const quick = v => { setDraft(v); setQ(v); scrollToCatalog() }

  return (
    <DarkBand id="mk-hero" word="MARKET" className="pt-[clamp(120px,15vh,150px)]">
      <div className="wrap relative z-3 lap:grid lap:grid-cols-[minmax(0,1fr)_380px] lap:items-end lap:gap-10">
        <div>
          <p className="inline-flex items-center gap-2.5 mb-6 px-4 py-2 rounded-full text-[13px] font-medium bg-white/6 border border-white/16 animate-fade-up" style={{ animationDelay: '.1s' }}>
            <span className="w-2 h-2 rounded-full bg-lime-2 animate-pulse-dot" />Marketplace resmi PE-NOVTRA
          </p>
          <h1 className="text-[clamp(40px,5.2vw,78px)] font-semibold tracking-[-.04em] leading-[1.02]">
            <span className="block overflow-hidden pb-[.06em]"><span className="inline-block animate-line-up" style={{ animationDelay: '.18s' }}>Semua untuk kebunmu,</span></span>{' '}
            <span className="block overflow-hidden pb-[.06em]"><span className="inline-block animate-line-up" style={{ animationDelay: '.3s' }}><em className="italic font-bold text-lime-2">dari satu tempat.</em></span></span>
          </h1>
        </div>
        <div className="pb-1 max-lap:mt-7 max-w-[440px] animate-fade-up" style={{ animationDelay: '.5s' }}>
          <p className="mb-5 text-[16px] leading-[1.6] font-light text-white/75">Unit PE-NOVTRA, media tanam, benih, dan nutrisi NovGrow, sampai suku cadang resmi. Dikirim dari Surabaya.</p>
          <form role="search" onSubmit={submit} className="flex items-center gap-2.5 h-[54px] pl-5 pr-2 rounded-full bg-white/8 border border-white/20 focus-within:border-lime-2 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <label className="sr-only" htmlFor="hero-q">Cari produk</label>
            <input id="hero-q" type="search" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Cari nutrisi, grow kit, unit…"
              className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[15px] text-white placeholder:text-white/50" />
            <button type="submit" className="h-10 px-[18px] rounded-full bg-lime text-forest-3 text-[14px] font-medium hover:bg-lime-2 transition-colors">Cari</button>
          </form>
          <div className="flex flex-wrap items-center gap-2 mt-3.5 text-[12.5px] text-white/60">
            Populer:
            {['Grow kit', 'Nutrisi AB', 'Media tanam'].map(v => (
              <button key={v} type="button" onClick={() => quick(v)} className="px-3 py-1 rounded-full border border-white/20 text-white hover:border-lime-2 hover:text-lime-2 transition-colors">{v}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex justify-center pt-[clamp(28px,5vh,48px)] pb-[clamp(100px,13vh,130px)] max-tab:pt-24">
        <div className="relative w-[min(560px,80vw)] animate-device-in">
          <img src="/assets/device.webp" alt="Unit PE-NOVTRA 2-in-1" width="1600" height="1306" className="w-full h-auto drop-shadow-[0_40px_50px_rgba(0,0,0,.45)]" />
          {[[73.6, 13.8], [24, 58]].map(([x, y]) => (
            <span key={x} aria-hidden="true" style={{ left: `${x}%`, top: `${y}%` }} className="absolute w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-lime-2 shadow-[0_0_0_4px_rgba(154,205,43,.25)] animate-pop after:absolute after:-inset-1.5 after:rounded-full after:border after:border-lime-2 after:animate-ring-late" />
          ))}
          <div className="absolute right-[104%] top-[18%] whitespace-nowrap px-4 py-3 rounded-[14px] bg-forest-3/55 border border-white/14 backdrop-blur-[10px] animate-chip-in max-lap:right-[92%] max-tab:right-auto max-tab:left-0 max-tab:top-[-22%] max-tab:min-w-0" style={{ animationDelay: '1.3s' }}>
            <small className="block text-[11px] tracking-[.06em] text-white/60">Unit unggulan</small>
            <b className="text-[17px] font-semibold max-tab:text-[14px]">PE-NOVTRA 2-in-1</b>
          </div>
          <div className="absolute left-[104%] top-[4%] whitespace-nowrap px-4 py-3 rounded-[14px] bg-forest-3/55 border border-white/14 backdrop-blur-[10px] animate-chip-in max-lap:left-[92%] max-tab:left-auto max-tab:right-0 max-tab:top-[-22%] max-tab:min-w-0" style={{ animationDelay: '1.5s' }}>
            <small className="block text-[11px] tracking-[.06em] text-white/60">Mulai dari</small>
            <b className="text-[20px] font-semibold max-tab:text-[15px]">{unit ? rupiah(unit.price) : '—'}</b>
          </div>
          <div className="absolute left-[106%] top-[46%] grid gap-2 whitespace-nowrap px-4 py-3 rounded-[14px] bg-forest-3/55 border border-white/14 backdrop-blur-[10px] animate-chip-in max-lap:left-[94%] max-tab:hidden" style={{ animationDelay: '1.7s' }}>
            <small className="text-[11px] tracking-[.06em] text-white/60">Garansi resmi 1 tahun</small>
            <Link to="/marketplace/produk/pe-novtra-2-in-1" className="px-3.5 py-2 rounded-full bg-lime text-forest-3 text-[13px] font-medium text-center hover:bg-lime-2 transition-colors">Lihat unit →</Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-3 border-t border-forest-line bg-[linear-gradient(transparent,rgba(2,42,33,.5))]">
        <ul className="wrap flex justify-end gap-[clamp(20px,5vw,56px)] pt-4 pb-[22px] text-[13px] text-white/60 max-tab:justify-start max-xs:text-[12px]">
          <li><b className="text-white font-semibold mr-2">2-in-1</b>media + hidroponik</li>
          <li><b className="text-white font-semibold mr-2">NovGrow</b>media, benih, nutrisi</li>
          <li className="max-xs:hidden"><b className="text-white font-semibold mr-2">Surabaya</b>gudang pengiriman</li>
        </ul>
      </div>
    </DarkBand>
  )
}

function Categories({ onPick }) {
  const { categories, catalogState } = useStore()
  const list = catalogState === 'loading' ? Array.from({ length: 6 }, (_, i) => ({ id: `s${i}`, skeleton: true })) : categories
  return (
    <section className="wrap pt-[clamp(90px,10vw,120px)] pb-[clamp(70px,8vw,100px)]">
      <SecHead idx="01">Kategori</SecHead>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 mb-12 max-tab:mb-8">
        <Reveal><Title className="text-[clamp(34px,4.4vw,60px)] max-w-[15ch]">Belanja sesuai <Em>kebutuhan.</Em></Title></Reveal>
        <Reveal delay={.1}><p className="max-w-[40ch] text-[15px] leading-[1.6] text-muted">Mulai dari unit, lalu isi ulang media, benih, dan nutrisi tiap siklus tanam.</p></Reveal>
      </div>
      <div className="grid grid-cols-3 gap-5 max-lap:grid-cols-2 max-xs:grid-cols-1 max-xs:gap-3">
        {list.map((c, i) => c.skeleton ? (
          <div key={c.id} aria-hidden="true" className="min-h-[168px] rounded-[28px] bg-white/70 border border-ink/8 animate-pulse max-xs:min-h-[128px]" />
        ) : (
          <Reveal key={c.id} delay={i * .06} tx="transition-[opacity,translate] duration-1000 ease-soft">
            <button type="button" onClick={() => onPick(c.id)}
              className="group w-full grid grid-cols-[minmax(0,1fr)_140px] items-center gap-4 min-h-[168px] p-[26px] pr-[22px] text-left bg-white border border-ink/12 rounded-[28px] transition-[box-shadow,border-color] duration-500 hover:border-ink/25 hover:shadow-[0_24px_50px_-30px_rgba(0,72,58,.4)] max-xs:min-h-0 max-xs:grid-cols-[minmax(0,1fr)_96px] max-xs:p-4">
              <span className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold tracking-[.14em] uppercase text-lime">0{i + 1}</span>
                <span className="text-[22px] font-semibold tracking-[-.02em] text-forest max-xs:text-[19px]">{c.label}</span>
                <span className="text-[13.5px] text-muted">{c.count} produk <span aria-hidden="true" className="inline-block transition-[translate] duration-500 group-hover:translate-x-1">→</span></span>
              </span>
              <span className="relative h-[120px] rounded-[20px] bg-[radial-gradient(closest-side,#e6f2c8,#f4f5ef_90%)] overflow-hidden max-xs:h-24">
                <img src={c.img} alt="" loading="lazy" className="absolute top-3.5 left-3.5 w-[calc(100%-28px)] h-[calc(100%-28px)] object-contain transition-[scale] duration-700 ease-soft group-hover:scale-110" />
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function OptList({ items, value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-1.5">
      {items.map(it => {
        const on = value === it.id
        return (
          <button key={it.id} type="button" role="radio" aria-checked={on} onClick={() => onChange(it.id)}
            className={cx('flex justify-between items-center px-3.5 py-[11px] rounded-[14px] text-left text-[14px] transition-colors duration-300',
              on ? 'border-[1.5px] border-forest bg-[#f1f6e6] font-medium text-forest' : 'border border-ink/12 bg-white text-ink-2 hover:border-ink/25')}>
            {it.label}
            <span aria-hidden="true" className={cx('w-4 h-4 rounded-full box-border transition-[border] duration-300', on ? 'border-[5px] border-forest' : 'border-[1.5px] border-ink/30')} />
          </button>
        )
      })}
    </div>
  )
}

function Filters({ f, set, reset }) {
  return (
    <div className="grid gap-5">
      <label className="flex items-center gap-2.5 h-[46px] px-4 rounded-full border border-ink/12 focus-within:border-forest transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#66746c" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span className="sr-only">Cari di katalog</span>
        <input type="search" value={f.q} onChange={e => set({ q: e.target.value })} placeholder="Cari produk" className="flex-1 min-w-0 border-0 outline-none text-[14px] bg-transparent" />
      </label>
      <div>
        <Kicker className="mb-2.5">Metode tanam</Kicker>
        <OptList label="Metode tanam" items={METHODS} value={f.method} onChange={v => set({ method: v })} />
      </div>
      <div>
        <Kicker className="mb-2.5">Harga</Kicker>
        <OptList label="Rentang harga" items={PRICE_RANGES} value={f.price} onChange={v => set({ price: v })} />
      </div>
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-ink/10">
        <span className="text-[14px] font-medium text-forest">Hanya yang tersedia</span>
        <button type="button" role="switch" aria-checked={f.ready} aria-label="Hanya yang tersedia" onClick={() => set({ ready: !f.ready })}
          className={cx('relative w-12 h-7 rounded-full transition-colors duration-300', f.ready ? 'bg-forest' : 'bg-ink/18')}>
          <span className={cx('absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow transition-[left] duration-300 ease-soft', f.ready ? 'left-[23px]' : 'left-[3px]')} />
        </button>
      </div>
      <button type="button" onClick={reset} className="justify-self-start text-[13px] text-forest underline underline-offset-4">Atur ulang filter</button>
    </div>
  )
}

const DEFAULT = { q: '', cat: 'all', method: 'all', price: 'all', ready: false, sort: 'relevan' }

/* Filtering, search and sorting run in the API; typing is debounced */
function useProducts(f) {
  const [state, setState] = useState({ list: [], status: 'loading', sig: '' })
  const [retry, setRetry] = useState(0)
  const query = qs({ q: f.q.trim(), cat: f.cat, method: f.method, price: f.price, ready: f.ready ? 1 : '', sort: f.sort })
  useEffect(() => {
    const ctrl = new AbortController()
    setState(s => ({ ...s, status: 'loading' }))
    const t = setTimeout(() => {
      api(`/products${query}`, { signal: ctrl.signal })
        .then(d => setState({ list: d.products, status: 'ready', sig: query || 'all' }))
        .catch(e => { if (e.name !== 'AbortError') setState(s => ({ ...s, status: 'error' })) })
    }, 220)
    return () => { clearTimeout(t); ctrl.abort() }
  }, [query, retry])
  return { ...state, retry: () => setRetry(r => r + 1) }
}

const CardSkeleton = () => (
  <div aria-hidden="true" className="flex flex-col bg-white border border-ink/10 rounded-[28px] overflow-hidden">
    <span className="block aspect-square bg-[radial-gradient(closest-side,#eef3e2,#ffffff_95%)] animate-pulse" />
    <span className="grid gap-2.5 px-[22px] pt-1 pb-[22px] max-xs:px-3.5">
      <span className="h-3 w-20 rounded-full bg-mist" />
      <span className="h-4 w-4/5 rounded-full bg-mist" />
      <span className="h-4 w-3/5 rounded-full bg-mist" />
      <span className="mt-4 h-9 w-full rounded-full bg-mist/70" />
    </span>
  </div>
)

function CatalogSection({ f, setF }) {
  const [sheet, setSheet] = useState(false)
  const { categories, categoryLabel } = useStore()
  const set = patch => setF(s => ({ ...s, ...patch }))
  const reset = () => setF(DEFAULT)
  const { list, status, sig, retry } = useProducts(f)
  const loading = status === 'loading' && !sig

  const active = [
    f.cat !== 'all' && { label: categoryLabel(f.cat), clear: () => set({ cat: 'all' }) },
    f.method !== 'all' && { label: METHODS.find(m => m.id === f.method).label, clear: () => set({ method: 'all' }) },
    f.price !== 'all' && { label: PRICE_RANGES.find(p => p.id === f.price).label, clear: () => set({ price: 'all' }) },
    f.ready && { label: 'Tersedia', clear: () => set({ ready: false }) },
    f.q.trim() && { label: `“${f.q.trim()}”`, clear: () => set({ q: '' }) },
  ].filter(Boolean)
  const filterCount = active.length

  return (
    <section id="katalog" className="bg-mist py-[clamp(90px,10vw,120px)] scroll-mt-4">
      <div className="wrap">
        <SecHead idx="02">Katalog</SecHead>
        <Reveal><Title className="mb-9 text-[clamp(34px,4.4vw,60px)]">Pilih, bandingkan, <Em>tanam.</Em></Title></Reveal>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="max-tab:w-full max-tab:overflow-x-auto no-scrollbar">
            <PillTabs label="Kategori" className="max-tab:flex-nowrap" itemClass="px-4 py-[9px] whitespace-nowrap"
              items={[{ id: 'all', label: 'Semua' }, ...categories]} value={f.cat} onChange={v => set({ cat: v })} />
          </div>
          <button type="button" onClick={() => setSheet(true)}
            className="tab:hidden inline-flex items-center gap-2 h-12 px-5 rounded-full bg-white border border-ink/12 text-[14px] font-medium text-forest">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
            Filter{filterCount > 0 && <span className="min-w-5 h-5 px-1.5 rounded-full bg-forest text-white text-[11px] grid place-items-center">{filterCount}</span>}
          </button>
          <label className="ml-auto flex items-center gap-2 h-12 px-4 rounded-full bg-white border border-ink/12 text-[13px] text-muted">
            Urutkan
            <select value={f.sort} onChange={e => set({ sort: e.target.value })} className="bg-transparent border-0 outline-none text-[14px] font-medium text-ink cursor-pointer">
              {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-[290px_minmax(0,1fr)] gap-5 items-start max-tab:grid-cols-1">
          <aside aria-label="Filter produk" className="bg-white border border-ink/12 rounded-[28px] p-6 max-tab:hidden">
            <h3 className="mb-[18px] text-[18px] font-semibold text-forest">Filter</h3>
            <Filters f={f} set={set} reset={reset} />
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-[18px] min-h-9">
              <p className="mr-1 text-[14px] text-ink-2" aria-live="polite">
                <strong className="font-semibold text-forest">{loading ? '…' : list.length}</strong> produk
              </p>
              {active.map(a => (
                <button key={a.label} type="button" onClick={a.clear} aria-label={`Hapus filter ${a.label}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest text-white text-[12.5px] animate-swap hover:bg-forest-2">
                  {a.label} <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>

            {status === 'error' ? (
              <div className="bg-white border border-ink/12 rounded-[28px] px-6 py-16 text-center animate-rise">
                <h3 className="mb-2 text-[26px] font-semibold text-forest">Katalog belum <Em>termuat.</Em></h3>
                <p className="mb-6 text-[14.5px] text-muted">Periksa koneksi internetmu lalu coba lagi.</p>
                <button type="button" onClick={retry} className="px-6 py-3.5 rounded-full bg-forest text-white text-[14.5px] font-medium hover:bg-forest-2">Coba lagi</button>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-3 auto-rows-fr gap-[18px] max-lap:grid-cols-2 max-xs:gap-2.5">
                {Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : list.length === 0 ? (
              <div className="bg-white border border-ink/12 rounded-[28px] px-6 py-16 text-center animate-rise">
                <h3 className="mb-2 text-[26px] font-semibold text-forest">Belum ketemu <Em>yang dicari.</Em></h3>
                <p className="mb-6 text-[14.5px] text-muted">Coba kata lain atau longgarkan filter.</p>
                <button type="button" onClick={reset} className="px-6 py-3.5 rounded-full bg-forest text-white text-[14.5px] font-medium hover:bg-forest-2">Atur ulang filter</button>
              </div>
            ) : (
              <div key={sig} className={cx('grid grid-cols-3 auto-rows-fr gap-[18px] transition-opacity duration-300 max-lap:grid-cols-2 max-xs:gap-2.5', status === 'loading' && 'opacity-60')}>
                {list.map((p, i) => <ProductCard key={p.slug} p={p} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile filter sheet */}
      {sheet && (
        <div className="fixed inset-0 z-[60] tab:hidden">
          <button type="button" aria-label="Tutup filter" onClick={() => setSheet(false)} className="absolute inset-0 bg-forest-3/60 backdrop-blur-[2px] animate-[fade-up_.3s_ease]" />
          <div role="dialog" aria-modal="true" aria-label="Filter produk" className="absolute inset-x-0 bottom-0 max-h-[88vh] flex flex-col bg-paper rounded-t-[32px] animate-toast-in">
            <span aria-hidden="true" className="self-center w-11 h-[5px] mt-2.5 rounded-full bg-ink/20" />
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="text-[28px] font-semibold tracking-[-.03em] text-forest">Filter <Em>produk.</Em></h2>
              <button type="button" onClick={() => setSheet(false)} aria-label="Tutup" className="w-[42px] h-[42px] rounded-full bg-white border border-ink/12 text-[18px] text-forest">×</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-2">
              <Kicker className="mb-2.5">Kategori</Kicker>
              <div className="flex flex-wrap gap-2 mb-5">
                {[{ id: 'all', label: 'Semua' }, ...categories].map(c => (
                  <button key={c.id} type="button" onClick={() => set({ cat: c.id })}
                    className={cx('px-4 py-[9px] rounded-full text-[13.5px] transition-colors', f.cat === c.id ? 'bg-forest text-white' : 'bg-white border border-ink/15 text-ink-2')}>{c.label}</button>
                ))}
              </div>
              <Filters f={f} set={set} reset={reset} />
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-2.5 px-5 pt-3.5 pb-6 bg-white border-t border-ink/10">
              <button type="button" onClick={reset} className="h-[54px] px-5 rounded-full border border-ink/20 text-[14.5px] font-medium text-forest">Atur ulang</button>
              <button type="button" onClick={() => setSheet(false)} className="h-[54px] rounded-full bg-lime text-forest-3 text-[15px] font-medium">Tampilkan {list.length} produk</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function RefillBand() {
  const { addToCart, productBySlug } = useStore()
  const kit = productBySlug('grow-kit-refill')
  if (!kit) return null
  return (
    <section className="relative isolate overflow-hidden bg-forest-2 text-white py-[clamp(90px,10vw,120px)]">
      <DotField density={.6} />
      <div className="wrap grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-14 items-center max-tab:grid-cols-1 max-tab:gap-10">
        <div>
          <SecHead idx="03" light>Isi ulang</SecHead>
          <Reveal><Title light className="mb-5 text-[clamp(34px,4.2vw,56px)]">Satu paket untuk <Em light>satu siklus tanam.</Em></Title></Reveal>
          <Reveal delay={.1}><p className="mb-8 max-w-[46ch] text-[15.5px] leading-[1.65] font-light text-white/72">{kit.desc}</p></Reveal>
          <Reveal delay={.2} className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => addToCart(kit.slug)} className="group px-[26px] py-[15px] rounded-full bg-lime text-forest-3 text-[15px] font-medium hover:bg-lime-2 transition-colors">
              Tambah ke keranjang <span aria-hidden="true" className="inline-block transition-[translate] duration-400 group-hover:translate-x-1">→</span>
            </button>
            <span className="text-[26px] font-bold tracking-[-.03em] text-lime-2">{rupiah(kit.price)}</span>
          </Reveal>
        </div>
        <Reveal delay={.15} className="relative rounded-[32px] bg-[radial-gradient(closest-side,rgba(154,205,43,.28),transparent)] p-[30px]">
          <img src={kit.img} alt="Isi Grow Kit Refill NovGrow" loading="lazy" className="w-full h-auto transition-[scale,rotate] duration-[1.2s] ease-soft hover:scale-[1.03] hover:-rotate-1" />
        </Reveal>
      </div>
    </section>
  )
}

function Help() {
  return (
    <section className="relative isolate overflow-hidden py-[clamp(100px,12vw,130px)] text-center bg-paper before:absolute before:inset-0 before:-z-1 before:bg-[radial-gradient(ellipse_at_center,rgba(244,245,239,.82),rgba(244,245,239,.95)_70%),linear-gradient(180deg,var(--color-paper),transparent_20%,transparent_80%,var(--color-paper))]">
      <img src="/assets/greenhouse.webp" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-2 opacity-50 saturate-60" />
      <div className="wrap flex flex-col items-center">
        <Reveal><Title className="mb-[18px] max-w-[16ch] text-[clamp(38px,5.2vw,68px)] tracking-[-.045em]">Bingung pilih yang mana? <Em>Tanya kami.</Em></Title></Reveal>
        <Reveal delay={.1}><p className="mb-10 max-w-[46ch] text-[17px] text-ink-2">Ceritakan ruang dan tanaman yang ingin kamu budidayakan, tim kami bantu pilihkan.</p></Reveal>
        <Reveal delay={.2} className="flex flex-wrap justify-center gap-3">
          <a href="/#kontak" className="group flex items-center gap-3.5 text-left py-3.5 pr-[22px] pl-4 rounded-full bg-white/88 border border-ink/12 transition-[background-color,translate] duration-400 hover:bg-forest hover:-translate-y-[3px]">
            <span className="w-[38px] h-[38px] rounded-full bg-lime-soft grid place-items-center group-hover:bg-lime transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00483a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8L4 20Z" /></svg></span>
            <span className="grid text-[15px] font-medium text-forest leading-[1.3] group-hover:text-white"><small className="text-[11px] tracking-[.12em] uppercase text-muted group-hover:text-white/70">WhatsApp</small>Konsultasi &amp; order</span>
          </a>
          <a href="mailto:penovtraid@gmail.com" className="group flex items-center gap-3.5 text-left py-3.5 pr-[22px] pl-4 rounded-full bg-white/88 border border-ink/12 transition-[background-color,translate] duration-400 hover:bg-forest hover:-translate-y-[3px]">
            <span className="w-[38px] h-[38px] rounded-full bg-lime-soft grid place-items-center group-hover:bg-lime transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00483a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></span>
            <span className="grid text-[15px] font-medium text-forest leading-[1.3] group-hover:text-white"><small className="text-[11px] tracking-[.12em] uppercase text-muted group-hover:text-white/70">Email</small>penovtraid@gmail.com</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export default function Catalog() {
  const [f, setF] = useState(DEFAULT)
  return (
    <main>
      <Hero q={f.q} setQ={q => setF(s => ({ ...s, q }))} />
      <Categories onPick={cat => { setF(s => ({ ...s, cat })); scrollToCatalog() }} />
      <CatalogSection f={f} setF={setF} />
      <RefillBand />
      <Help />
    </main>
  )
}
