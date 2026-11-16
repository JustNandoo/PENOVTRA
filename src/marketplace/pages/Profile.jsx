import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { cx } from '../../components/ui'
import { DarkBand } from '../components/DotField'
import { Em, Field, Kicker, PillTabs, ProductImg, SecHead, Title, inputCls } from '../components/atoms'
import { useStore } from '../store'
import { ADDRESSES, ORDER_STATUS, lineItems, orderTotal, rupiah } from '../data'

const FILTERS = [
  { id: 'all', label: 'Semua' },
  { id: 'bayar', label: 'Menunggu bayar' },
  { id: 'proses', label: 'Diproses' },
  { id: 'kirim', label: 'Dikirim' },
  { id: 'selesai', label: 'Selesai' },
]

function OrderCard({ o, on, onSelect, delay }) {
  const items = lineItems(o.lines)
  const st = ORDER_STATUS[o.status]
  const nav = useNavigate()
  const summary = items.map(i => `${i.product.short}${i.qty > 1 ? ` × ${i.qty}` : ''}`).join(', ')
  return (
    <article onClick={onSelect}
      className={cx('cursor-pointer rounded-[28px] p-6 bg-white transition-[border-color,box-shadow,translate] duration-400 ease-soft animate-rise max-xs:p-5',
        on ? 'border-[1.5px] border-forest shadow-[0_24px_50px_-34px_rgba(0,72,58,.55)]' : 'border border-ink/12 hover:border-ink/25 hover:-translate-y-0.5')}
      style={{ animationDelay: `${delay}s` }}>
      <header className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <span><b className="block text-[16px] font-semibold tracking-[-.01em] text-forest">{o.id}</b><span className="text-[13px] text-muted">{o.date}</span></span>
        <span className={cx('px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold', st.cls)}>{st.label}</span>
      </header>
      <div className="flex items-center gap-4">
        <div className="flex flex-none">
          {items.slice(0, 3).map((it, i) => (
            <span key={it.key} className={cx('block w-16 h-16 rounded-[18px] overflow-hidden ring-[3px] ring-white max-xs:w-14 max-xs:h-14', i > 0 && '-ml-4')}>
              <ProductImg src={it.product.img} inset="12%" hover={false} className="w-full h-full bg-[radial-gradient(closest-side,#e6f2c8,#f4f5ef_95%)]" />
            </span>
          ))}
        </div>
        <p className="min-w-0 line-clamp-2 text-[14px] leading-[1.5] text-ink-2">{summary}</p>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-ink/10">
        <span className="text-[13.5px] text-muted">Total <b className="ml-1 text-[18px] font-bold tracking-[-.03em] text-forest">{rupiah(orderTotal(o))}</b></span>
        {o.status === 'bayar'
          ? <button type="button" onClick={e => { e.stopPropagation(); nav(`/marketplace/pembayaran/${o.id}`) }} className="h-10 px-5 rounded-full bg-lime text-forest-3 text-[13.5px] font-medium hover:bg-lime-2">Bayar sekarang →</button>
          : o.status === 'selesai'
            ? <button type="button" onClick={e => { e.stopPropagation(); nav(`/marketplace/produk/${items[0].slug}`) }} className="h-10 px-5 rounded-full border border-ink/18 text-[13.5px] font-medium text-forest hover:border-forest">Beli lagi</button>
            : <span className={cx('text-[13.5px] font-medium', on ? 'text-lime' : 'text-forest')}>{on ? 'Ditampilkan →' : 'Lihat perjalanan →'}</span>}
      </footer>
    </article>
  )
}

function Journey({ o }) {
  const [copied, setCopied] = useState(false)
  if (!o) return null
  const copy = () => { navigator.clipboard?.writeText(o.resi).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  return (
    <aside aria-label="Perjalanan pesanan" key={o.id} className="relative isolate overflow-hidden rounded-[32px] bg-forest text-white p-8 lap:sticky lap:top-28 animate-swap max-xs:p-6">
      <p className="mb-1 text-[12px] font-medium tracking-[.18em] uppercase text-white/60">Perjalanan pesanan</p>
      <b className="block mb-1 text-[22px] font-semibold tracking-[-.02em]">{o.id}</b>
      <span className="block mb-5 text-[13.5px] text-white/65">{o.eta}</span>
      {o.resi ? (
        <div className="flex items-center justify-between gap-3 mb-7 pl-5 pr-1.5 h-[52px] rounded-full bg-white/8 border border-white/16">
          <span className="min-w-0 truncate text-[14px]"><span className="text-white/60">Resi </span><b className="font-semibold tracking-[.02em]">{o.resi}</b></span>
          <button type="button" onClick={copy} className={cx('h-10 px-4 rounded-full text-[13px] font-medium transition-colors', copied ? 'bg-lime text-forest-3' : 'border border-white/25 hover:bg-white/10')}>{copied ? 'Tersalin' : 'Salin'}</button>
        </div>
      ) : (
        <p className="mb-7 px-5 py-3.5 rounded-[18px] bg-white/8 text-[13.5px] leading-[1.55] text-white/72">Nomor resi muncul setelah paket diserahkan ke kurir.</p>
      )}
      <ol className="grid">
        {o.events.map(([t, title, place, st], i) => (
          <li key={i} className="relative grid grid-cols-[22px_1fr] gap-4 pb-6 last:pb-0 animate-fade-up" style={{ animationDelay: `${.1 + i * .08}s` }}>
            {i < o.events.length - 1 && <span aria-hidden="true" className={cx('absolute left-[10px] top-[22px] bottom-0 w-px', st === 'next' ? 'bg-white/15' : 'bg-lime-2/50')} />}
            <span className={cx('relative mt-0.5 w-[22px] h-[22px] rounded-full box-border',
              st === 'now' ? 'bg-lime-2 shadow-[0_0_0_6px_rgba(154,205,43,.18)]' : st === 'done' ? 'bg-forest border-[6px] border-lime-2/70' : 'border-[1.5px] border-white/25')}>
              {st === 'now' && <span aria-hidden="true" className="absolute inset-0 rounded-full border border-lime-2 animate-ring" />}
            </span>
            <span>
              <span className="block text-[12.5px] text-white/55">{t}</span>
              <b className={cx('block text-[15.5px] font-semibold', st === 'next' ? 'text-white/55' : 'text-white')}>{title}</b>
              <span className="block text-[13.5px] text-white/60">{place}</span>
            </span>
          </li>
        ))}
      </ol>
      <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="flex items-center justify-between mt-8 px-5 h-[52px] rounded-full bg-white text-forest text-[14px] font-medium hover:bg-lime-soft hover:text-forest">Butuh bantuan? Hubungi kami <span aria-hidden="true">→</span></a>
    </aside>
  )
}

function Orders({ orders }) {
  const [sp, setSp] = useSearchParams()
  const [filter, setFilter] = useState('all')
  const list = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const selId = sp.get('order')
  const sel = list.find(o => o.id === selId) ?? list[0]
  const select = id => setSp(p => { p.set('order', id); return p }, { replace: true, preventScrollReset: true })

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
        <div>
          <SecHead idx="01" className="mb-5">Riwayat pesanan</SecHead>
          <Title className="text-[clamp(32px,4vw,48px)]">Pesanan <Em>saya.</Em></Title>
        </div>
      </div>
      <div className="-mx-4 px-4 mb-7 overflow-x-auto no-scrollbar">
        <PillTabs items={FILTERS.map(f => ({ ...f, label: <>{f.label}<span className="ml-1.5 opacity-60 tabular-nums">{f.id === 'all' ? orders.length : orders.filter(o => o.status === f.id).length}</span></> }))}
          value={filter} onChange={setFilter} label="Status pesanan" className="flex-nowrap whitespace-nowrap" />
      </div>
      {list.length === 0 ? (
        <div className="bg-white border border-ink/12 rounded-[28px] px-6 py-16 text-center animate-rise">
          <p className="mb-1 text-[22px] font-semibold tracking-[-.02em] text-forest">Tidak ada pesanan di sini.</p>
          <p className="text-[14.5px] text-muted">Coba pilih status lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)_400px] gap-5 items-start max-lap:grid-cols-1">
          <div key={filter} className="grid gap-3.5">
            {list.map((o, i) => <OrderCard key={o.id} o={o} on={sel?.id === o.id} onSelect={() => select(o.id)} delay={i * .06} />)}
          </div>
          <Journey o={sel} />
        </div>
      )}
    </>
  )
}

function Units() {
  return (
    <>
      <SecHead idx="02" className="mb-5">Unit &amp; garansi</SecHead>
      <Title className="mb-8 text-[clamp(32px,4vw,48px)]">Unit <Em>terdaftar.</Em></Title>
      <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-8 items-center bg-white border border-ink/12 rounded-[32px] p-7 animate-rise max-tab:grid-cols-1">
        <ProductImg src="/assets/device.webp" inset="8%" className="aspect-square rounded-[24px] overflow-hidden bg-[radial-gradient(closest-side,#e6f2c8,#f4f5ef_95%)]" />
        <div>
          <Kicker className="mb-2">Unit</Kicker>
          <b className="block mb-1 text-[26px] font-semibold tracking-[-.03em] text-forest">PE-NOVTRA 2-in-1</b>
          <span className="block mb-6 text-[14px] text-muted">Nomor seri NVT-24-08812 · terhubung ke Grow Companion</span>
          <dl className="grid grid-cols-3 gap-3 max-xs:grid-cols-1">
            {[['Garansi', 'aktif s.d. Sep 2027'], ['Mode', 'Media + hidroponik'], ['Status', 'Online']].map(([k, v]) => (
              <div key={k} className="px-5 py-4 rounded-[20px] bg-mist"><dt className="text-[12.5px] text-muted">{k}</dt><dd className="text-[15px] font-semibold text-forest">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </>
  )
}

function Addresses() {
  return (
    <>
      <SecHead idx="03" className="mb-5">Alamat</SecHead>
      <Title className="mb-8 text-[clamp(32px,4vw,48px)]">Alamat <Em>pengiriman.</Em></Title>
      <div className="grid grid-cols-3 gap-4 max-lap:grid-cols-2 max-xs:grid-cols-1">
        {ADDRESSES.map((a, i) => (
          <div key={a.id} className="flex flex-col p-6 bg-white border border-ink/12 rounded-[28px] min-h-[200px] animate-rise" style={{ animationDelay: `${i * .07}s` }}>
            <span className="flex items-center justify-between mb-3"><b className="text-[17px] font-semibold text-forest">{a.label}</b>{i === 0 && <span className="px-3 py-1 rounded-full bg-lime-soft text-[12px] font-semibold text-forest">Utama</span>}</span>
            <span className="text-[14px] text-ink-2">{a.name}</span>
            <span className="text-[14px] leading-[1.55] text-muted">{a.addr}</span>
            <span className="mt-auto pt-4 text-[13.5px] font-medium text-forest">Ubah →</span>
          </div>
        ))}
        <button type="button" className="grid place-items-center content-center gap-2 min-h-[200px] rounded-[28px] border border-dashed border-ink/25 text-[14px] font-medium text-forest hover:border-forest hover:bg-white transition-colors animate-rise" style={{ animationDelay: '.14s' }}>
          <span className="grid place-items-center w-10 h-10 rounded-full bg-mist text-[22px] leading-none">+</span>Tambah alamat
        </button>
      </div>
    </>
  )
}

function Account({ user }) {
  return (
    <>
      <SecHead idx="04" className="mb-5">Akun &amp; keamanan</SecHead>
      <Title className="mb-8 text-[clamp(32px,4vw,48px)]">Data <Em>akun.</Em></Title>
      <form onSubmit={e => e.preventDefault()} className="grid grid-cols-2 gap-4 p-8 bg-white border border-ink/12 rounded-[32px] animate-rise max-tab:grid-cols-1 max-xs:p-5">
        <Field label="Nama lengkap"><input defaultValue={user.name} className={inputCls} /></Field>
        <Field label="Email"><input type="email" defaultValue={user.email} className={inputCls} /></Field>
        <Field label="Nomor WhatsApp"><input defaultValue={user.phone} className={inputCls} /></Field>
        <Field label="Kata sandi" right={<Link to="/marketplace/lupa-sandi" className="font-normal">Ganti</Link>}><input type="password" defaultValue="password123" disabled className={cx(inputCls, 'bg-mist')} /></Field>
        <div className="col-span-2 flex justify-end pt-2 max-tab:col-span-1">
          <button type="submit" className="h-[52px] px-7 rounded-full bg-forest text-white text-[15px] font-medium hover:bg-forest-2">Simpan perubahan</button>
        </div>
      </form>
    </>
  )
}

export default function Profile() {
  const { user, orders, logout } = useStore()
  const nav = useNavigate()
  const [tab, setTab] = useState('orders')
  const shipping = orders.filter(o => o.status === 'kirim').length
  const MENU = [['orders', 'Pesanan saya', orders.length], ['units', 'Unit & garansi'], ['addr', 'Alamat'], ['acct', 'Akun & keamanan']]

  return (
    <main className="bg-paper">
      <DarkBand id="mk-hero" word="" className="pt-[150px] pb-[clamp(60px,7vw,80px)] max-xs:pt-28">
        <div className="wrap relative grid grid-cols-[auto_1fr_auto] gap-8 items-center max-lap:grid-cols-[auto_1fr] max-xs:grid-cols-1 max-xs:gap-6">
          <span className="grid place-items-center w-[104px] h-[104px] rounded-full bg-lime text-forest-3 text-[44px] font-bold animate-pop max-xs:w-20 max-xs:h-20 max-xs:text-[34px]">{user.first[0]}</span>
          <div className="min-w-0">
            <h1 className="mb-2 text-[clamp(40px,5vw,64px)] leading-[1.04] tracking-[-.045em] font-semibold">
              <span className="block overflow-hidden"><span className="inline-block animate-line-up" style={{ animationDelay: '.15s' }}>Halo, <Em light>{user.first}.</Em></span></span>
            </h1>
            <p className="text-[15px] text-white/65 animate-fade-up" style={{ animationDelay: '.3s' }}>{user.email} · {user.phone} · bergabung {user.since}</p>
          </div>
          <dl className="grid grid-cols-3 rounded-[26px] bg-forest-3/55 border border-white/14 backdrop-blur-[10px] animate-chip-in max-lap:col-span-2 max-xs:col-span-1" style={{ animationDelay: '.45s' }}>
            {[[orders.length, 'pesanan'], [1, 'unit terdaftar'], [shipping, 'sedang dikirim']].map(([n, l], i) => (
              <div key={l} className={cx('px-7 py-5 max-xs:px-4', i < 2 && 'border-r border-white/12')}>
                <dt className="sr-only">{l}</dt>
                <dd><b className="block text-[34px] font-semibold tracking-[-.04em] text-lime-2 leading-none max-xs:text-[28px]">{n}</b><span className="block mt-1.5 text-[13px] text-white/65">{l}</span></dd>
              </div>
            ))}
          </dl>
        </div>
      </DarkBand>

      <section className="wrap grid grid-cols-[250px_minmax(0,1fr)] gap-10 items-start pt-[clamp(50px,6vw,72px)] pb-[clamp(90px,10vw,120px)] max-lap:grid-cols-1 max-lap:gap-8">
        <nav aria-label="Menu akun" className="grid gap-1 p-2 bg-white border border-ink/12 rounded-[28px] lap:sticky lap:top-28 max-lap:flex max-lap:overflow-x-auto max-lap:no-scrollbar max-lap:rounded-full max-lap:p-[5px] animate-fade-up">
          {MENU.map(([id, l, n]) => (
            <button key={id} type="button" onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}
              className={cx('flex items-center justify-between gap-3 h-12 px-5 rounded-full text-[14.5px] font-medium text-left whitespace-nowrap transition-colors duration-300 max-lap:h-10 max-lap:px-4 max-lap:text-[13.5px]',
                tab === id ? 'bg-forest text-white' : 'text-ink-2 hover:bg-mist')}>
              {l}{n != null && <span className={cx('grid place-items-center min-w-6 h-6 px-1.5 rounded-full text-[12px] font-semibold', tab === id ? 'bg-lime text-forest-3' : 'bg-mist text-forest')}>{n}</span>}
            </button>
          ))}
          <span aria-hidden="true" className="h-px my-1 mx-4 bg-ink/10 max-lap:hidden" />
          <button type="button" onClick={() => { logout(); nav('/marketplace') }} className="h-12 px-5 rounded-full text-left text-[14.5px] font-medium text-warn hover:bg-[#fdeceb] whitespace-nowrap max-lap:h-10 max-lap:px-4 max-lap:text-[13.5px]">Keluar</button>
        </nav>
        <div key={tab} className="min-w-0 animate-swap">
          {tab === 'orders' && <Orders orders={orders} />}
          {tab === 'units' && <Units />}
          {tab === 'addr' && <Addresses />}
          {tab === 'acct' && <Account user={user} />}
        </div>
      </section>
    </main>
  )
}
