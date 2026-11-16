import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Reveal, cx } from '../../components/ui'
import { DotField } from '../components/DotField'
import ProductCard from '../components/ProductCard'
import { Em, Kicker, Option, QtyStepper, SecHead, Title } from '../components/atoms'
import { useStore } from '../store'
import { PARTS, PRODUCTS, categoryLabel, productBySlug, rupiah } from '../data'

const pad = i => String(i + 1).padStart(2, '0')

function Gallery({ p }) {
  const imgs = p.gallery ?? [p.img]
  const [i, setI] = useState(0)
  return (
    <div className="grid gap-3.5">
      <div className="relative aspect-[1/0.86] rounded-[32px] bg-white border border-ink/12 overflow-hidden">
        <div aria-hidden="true" className="absolute -inset-x-[20%] top-[14%] h-[70%] bg-[radial-gradient(closest-side,#e6f2c8,transparent)]" />
        <img key={imgs[i]} src={imgs[i]} alt={p.name} className="absolute top-[9%] left-[8%] w-[84%] h-[82%] object-contain animate-swap" />
        {p.tag && !p.soon && <span className="absolute top-5 left-5 px-3.5 py-[7px] rounded-full bg-forest text-white text-[12px] font-medium">{p.tag}</span>}
        {p.soon && <span className="absolute top-5 left-5 px-3.5 py-[7px] rounded-full bg-white border border-ink/15 text-[12px] font-medium">Segera hadir</span>}
      </div>
      {imgs.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {imgs.map((src, k) => (
            <button key={src} type="button" onClick={() => setI(k)} aria-label={`Foto ${k + 1}`} aria-pressed={i === k}
              className={cx('relative aspect-square rounded-[20px] bg-white overflow-hidden transition-[border-color,box-shadow] duration-300',
                i === k ? 'border-2 border-forest shadow-[0_10px_24px_-16px_rgba(0,72,58,.6)]' : 'border border-ink/12 hover:border-ink/30')}>
              <img src={src} alt="" className="absolute top-3 left-3 w-[calc(100%-24px)] h-[calc(100%-24px)] object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function BuyBox({ p }) {
  const { addToCart } = useStore()
  const nav = useNavigate()
  const [variant, setVariant] = useState(p.variants?.[0].id)
  const [qty, setQty] = useState(1)
  const [city, setCity] = useState('')
  const [checked, setChecked] = useState(false)
  const [notify, setNotify] = useState(false)
  const v = p.variants?.find(x => x.id === variant)
  const price = v?.price ?? p.price
  const words = p.short.split(' ')
  const tail = words.length > 1 ? words.pop() : ''

  return (
    <div className="grid gap-[22px] pt-1.5">
      <div>
        <Kicker className="mb-3">{categoryLabel(p.cat)} · {p.method === 'hydro' ? 'Hidroponik' : p.method === 'soil' ? 'Media tanam' : 'Media tanam + hidroponik'}</Kicker>
        <h1 className="mb-2 text-[clamp(36px,4vw,52px)] font-semibold leading-[1.04] tracking-[-.04em] text-forest">{words.join(' ')} {tail && <Em>{tail}</Em>}</h1>
        <p className="text-[16px] text-ink-2">{p.name}</p>
      </div>

      {p.soon ? (
        <div className="py-5 border-y border-ink/12">
          <p className="mb-4 text-[15px] text-ink-2">{p.desc}</p>
          <button type="button" onClick={() => setNotify(n => !n)} className={cx('h-[54px] px-7 rounded-full text-[15.5px] font-medium transition-colors', notify ? 'bg-forest text-white' : 'bg-lime text-forest-3 hover:bg-lime-2')}>
            {notify ? 'Kami akan mengabarimu ✓' : 'Ingatkan saat rilis'}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-3 py-[18px] border-y border-ink/12">
            <span key={price * qty} className="text-[clamp(32px,3.4vw,42px)] font-bold tracking-[-.045em] text-forest animate-swap">{rupiah(price * qty)}</span>
            <span className="text-[14px] text-muted">{qty > 1 ? `untuk ${qty} × ${p.unit.replace('per ', '')}` : p.unit}</span>
          </div>

          {p.variants && (
            <fieldset className="grid gap-2.5">
              <legend className="mb-2.5"><Kicker>Pilih paket</Kicker></legend>
              {p.variants.map(x => (
                <Option key={x.id} on={variant === x.id} onClick={() => setVariant(x.id)} className="px-[18px] py-4 rounded-[20px]">
                  <span className="flex justify-between gap-3 text-[15.5px] font-semibold text-forest"><span>{x.name}</span><span>{rupiah(x.price)}</span></span>
                  <span className="block mt-1 text-[13.5px] leading-[1.5] text-muted">{x.desc}</span>
                </Option>
              ))}
            </fieldset>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <QtyStepper size="lg" value={qty} onChange={setQty} />
            <button type="button" onClick={() => { addToCart(p.slug, qty, variant); nav('/marketplace/keranjang') }}
              className="group flex-1 min-w-[180px] h-[54px] inline-flex items-center justify-center gap-2.5 rounded-full bg-lime text-forest-3 text-[15.5px] font-medium hover:bg-lime-2 transition-colors">
              Beli sekarang <span aria-hidden="true" className="transition-[translate] duration-400 group-hover:translate-x-1">→</span>
            </button>
            <button type="button" onClick={() => addToCart(p.slug, qty, variant)}
              className="flex-1 min-w-[180px] h-[54px] rounded-full bg-forest text-white text-[15.5px] font-medium hover:bg-forest-2 transition-colors active:scale-[.98]">
              Tambah ke keranjang
            </button>
          </div>

          <div className="grid gap-3.5 p-5 px-[22px] rounded-[24px] bg-mist">
            <div className="flex justify-between gap-3 items-baseline">
              <b className="text-[15px] font-semibold text-forest">Dikirim dari Surabaya</b>
              <span className="text-[13px] text-muted">ongkir final di checkout</span>
            </div>
            <form onSubmit={e => { e.preventDefault(); setChecked(!!city.trim()) }} className="flex items-center gap-2 h-12 pl-[18px] pr-1.5 rounded-full bg-white border border-ink/12 focus-within:border-forest transition-colors">
              <label htmlFor="city" className="sr-only">Kota tujuan</label>
              <input id="city" value={city} onChange={e => { setCity(e.target.value); setChecked(false) }} placeholder="Kota tujuan, mis. Sidoarjo" className="flex-1 min-w-0 border-0 outline-none text-[14px] bg-transparent" />
              <button type="submit" className="h-9 px-4 rounded-full bg-forest text-white text-[13px] font-medium hover:bg-forest-2">Cek ongkir</button>
            </form>
            {checked && (
              <ul className="grid gap-1.5 text-[13.5px] text-ink-2 animate-swap">
                <li className="flex justify-between"><span>Reguler · 2–3 hari</span><b className="text-forest">Rp38.000</b></li>
                <li className="flex justify-between"><span>Kargo · 3–5 hari</span><b className="text-forest">Rp52.000</b></li>
              </ul>
            )}
            <p className="text-[13.5px] text-ink-2">Ragu memilih? <a href="/#kontak" className="font-semibold">Konsultasi lewat WhatsApp</a></p>
          </div>
        </>
      )}
    </div>
  )
}

function PartsExplorer() {
  const [cur, setCur] = useState(1)
  const part = PARTS[cur]
  return (
    <section className="relative isolate overflow-hidden bg-forest-2 text-white py-[clamp(90px,10vw,110px)]">
      <DotField density={.5} />
      <div className="wrap">
        <SecHead idx="01" light>Lihat lebih dekat</SecHead>
        <Reveal><Title light className="mb-12 max-w-[18ch] text-[clamp(34px,4.2vw,56px)]">Enam bagian, <Em light>satu unit.</Em></Title></Reveal>
        <div className="grid grid-cols-[300px_minmax(0,1fr)] gap-6 max-lap:grid-cols-1">
          <ol className="grid gap-1.5 content-start max-lap:flex max-lap:overflow-x-auto no-scrollbar max-lap:gap-2">
            {PARTS.map((p, i) => (
              <li key={p.t} className="max-lap:flex-none">
                <button type="button" aria-pressed={cur === i} onClick={() => setCur(i)}
                  className={cx('w-full grid grid-cols-[30px_1fr] gap-x-3 gap-y-0.5 text-left px-[18px] py-3.5 rounded-[14px] transition-colors duration-300 max-lap:rounded-full max-lap:py-2.5 max-lap:grid-cols-[auto_auto]',
                    cur === i ? 'bg-white/10' : 'hover:bg-white/6')}>
                  <span className={cx('text-[12px] font-semibold', cur === i ? 'text-lime-2' : 'text-white/45')}>{pad(i)}</span>
                  <span className="text-[15.5px] font-semibold">{p.t}</span>
                  <span className="col-start-2 text-[12.5px] text-white/55 max-lap:hidden">{p.s}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="relative min-h-[540px] rounded-[32px] border border-white/12 bg-[radial-gradient(120%_90%_at_50%_100%,rgba(154,205,43,.18),rgba(255,255,255,.03)_60%)] overflow-hidden max-tab:min-h-[520px]">
            <div className="absolute left-1/2 top-10 w-[min(560px,90%)] -translate-x-1/2">
              <img src="/assets/device.webp" alt="Unit PE-NOVTRA dengan penanda bagian" className="w-full h-auto drop-shadow-[0_30px_40px_rgba(0,0,0,.4)]" />
              {PARTS.map((p, i) => (
                <button key={p.t} type="button" aria-label={p.t} onClick={() => setCur(i)} style={{ left: `${p.x}%`, top: `${p.y}%`, '--dl': `${i * .35}s` }}
                  className={cx('absolute w-[30px] h-[30px] -ml-[15px] -mt-[15px] rounded-full grid place-items-center text-[11px] font-semibold shadow-[0_0_0_4px_rgba(255,255,255,.85)] transition-colors duration-300',
                    'before:absolute before:-inset-2 before:rounded-full before:border-[1.5px] before:border-lime before:animate-ring before:[animation-delay:var(--dl)]',
                    cur === i ? 'bg-lime-2 text-forest-3' : 'bg-forest text-white hover:bg-lime')}>{i + 1}</button>
              ))}
            </div>
            <div aria-live="polite" className="absolute inset-x-5 bottom-5 grid grid-cols-[auto_1fr] gap-x-7 gap-y-1 items-center px-[22px] py-5 rounded-[20px] bg-white/92 text-ink max-tab:grid-cols-1">
              <span key={'t' + cur} className="col-span-full text-[11px] font-semibold tracking-[.14em] uppercase text-lime animate-swap">{pad(cur)} / 06 · {part.s}</span>
              <h3 key={'h' + cur} className="min-w-[200px] text-[22px] font-semibold text-forest animate-swap">{part.t}</h3>
              <p key={'d' + cur} className="text-[14.5px] leading-[1.55] text-ink-2 animate-swap">{part.d}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SpecsAndBox({ p, idx }) {
  return (
    <section className="wrap py-[clamp(90px,10vw,110px)]">
      <SecHead idx={idx}>{p.specs ? 'Spesifikasi' : 'Detail produk'}</SecHead>
      <Reveal><Title className="mb-11 text-[clamp(34px,4.2vw,56px)]">Yang kamu dapat <Em>{p.box ? 'di dalam kotak.' : 'dari produk ini.'}</Em></Title></Reveal>
      <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-5 max-tab:grid-cols-1">
        <Reveal className="bg-white border border-ink/12 rounded-[32px] px-8 py-3.5 max-xs:px-5">
          {p.specs ? (
            <dl className="grid grid-cols-[200px_1fr] text-[15px] max-xs:grid-cols-[130px_1fr] max-xs:text-[14px]">
              {p.specs.map(([k, v], i) => (
                <div key={k} className="contents">
                  <dt className={cx('py-4 text-muted', i < p.specs.length - 1 && 'border-b border-ink/10')}>{k}</dt>
                  <dd className={cx('py-4 font-medium', i < p.specs.length - 1 && 'border-b border-ink/10')}>{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="py-5 text-[15.5px] leading-[1.7] text-ink-2">{p.desc}</p>
          )}
        </Reveal>
        <Reveal delay={.1} className="relative overflow-hidden bg-white border border-ink/12 rounded-[32px] p-8 max-xs:p-6">
          <div aria-hidden="true" className="absolute -inset-x-[20%] -bottom-[30%] h-[70%] bg-[radial-gradient(closest-side,#e6f2c8,transparent)]" />
          <div className="relative flex gap-1.5 mb-[22px]">
            <span className="px-4 py-2 rounded-full bg-forest text-white text-[13px] font-medium">Resmi PE-NOVTRA</span>
            {p.cat === 'unit' && <span className="px-4 py-2 rounded-full bg-lime text-white text-[13px] font-medium">1 Year Warranty</span>}
          </div>
          <ul className="relative grid gap-4 text-[15.5px] text-ink-2">
            {(p.box ?? [p.blurb, `Dikirim dari Surabaya`, 'Bisa dikonsultasikan lewat WhatsApp']).map(t => (
              <li key={t} className="flex gap-3 items-center"><span aria-hidden="true" className="flex-none w-[22px] h-[22px] rounded-full bg-lime text-white grid place-items-center text-[13px] font-bold">✓</span>{t}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

function AppSection() {
  return (
    <section className="bg-mist py-[clamp(80px,9vw,100px)]">
      <div className="wrap grid grid-cols-[minmax(0,1fr)_420px] gap-14 items-center max-tab:grid-cols-1">
        <div>
          <SecHead idx="03">Aplikasi</SecHead>
          <Reveal><Title className="mb-[22px] text-[clamp(34px,4.2vw,56px)]">Didampingi sampai <Em>panen.</Em></Title></Reveal>
          <Reveal delay={.1}><p className="mb-7 max-w-[46ch] text-[15.5px] leading-[1.65] text-ink-2">Pindai QR di kemasan untuk menghubungkan unit ke NOVTRA Grow Companion. Aplikasi menyusun tugas harian, jadwal, dan panduan per tanaman.</p></Reveal>
          <div className="grid grid-cols-3 border-t border-ink/12 max-xs:grid-cols-1">
            {[['Tugas harian', 'per unit dan zona'], ['Fase tumbuh', 'semai sampai panen'], ['Panduan', 'per metode tanam']].map(([b, s], i) => (
              <Reveal key={b} delay={.1 + i * .08} className={cx('pt-5', i > 0 ? 'pl-5 border-l border-ink/12 max-xs:pl-0 max-xs:border-l-0' : 'pr-5')}>
                <b className="block text-[22px] font-semibold tracking-[-.02em] text-forest">{b}</b>
                <span className="text-[13.5px] text-muted">{s}</span>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={.15} className="flex justify-center gap-[18px]">
          <img src="/assets/app/pindai-qr.webp" alt="Layar pindai QR" loading="lazy" className="w-[170px] h-auto self-end rounded-[26px] border-[6px] border-[#101a16] -rotate-4 opacity-90 transition-[rotate] duration-700 hover:rotate-0 max-xs:w-[130px]" />
          <img src="/assets/app/beranda.webp" alt="Beranda Grow Companion" loading="lazy" className="w-[200px] h-[420px] object-cover object-top rounded-[30px] border-[7px] border-[#101a16] shadow-[0_40px_60px_-30px_rgba(0,40,30,.55)] max-xs:w-[150px] max-xs:h-[320px]" />
        </Reveal>
      </div>
    </section>
  )
}

function Related({ p, idx }) {
  const list = [...PRODUCTS.filter(x => x.slug !== p.slug && !x.soon && x.cat !== 'unit')].slice(0, 4)
  return (
    <section className="wrap pt-[clamp(90px,10vw,110px)] pb-[clamp(90px,10vw,120px)]">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-5 mb-[90px] max-tab:grid-cols-1 max-tab:mb-16">
        <Reveal className="bg-forest text-white rounded-[32px] p-8">
          <p className="text-[12px] font-medium tracking-[.18em] uppercase text-white/60">Ulasan pembeli</p>
          <p className="mt-10 mb-1.5 text-[44px] font-semibold tracking-[-.04em] text-lime-2">0</p>
          <p className="text-[14px] text-white/75">ulasan untuk produk ini</p>
        </Reveal>
        <Reveal delay={.1} className="bg-white border border-ink/12 rounded-[32px] p-8 flex flex-col justify-center">
          <h3 className="mb-2 text-[26px] font-semibold text-forest">Belum ada <Em>ulasan.</Em></h3>
          <p className="max-w-[52ch] text-[15px] text-muted">Ulasan bisa ditulis pembeli setelah pesanannya diterima. Panen pertamamu bisa jadi cerita pertama di sini.</p>
        </Reveal>
      </div>
      <SecHead idx={idx}>Lengkapi kebunmu</SecHead>
      <div className="flex flex-wrap items-end justify-between gap-5 mb-10">
        <Reveal><Title className="text-[clamp(34px,4.2vw,56px)]">Sering dibeli <Em>bersama.</Em></Title></Reveal>
        <Link to="/marketplace" className="text-[15px] font-medium">Lihat semua produk →</Link>
      </div>
      <div className="grid grid-cols-4 auto-rows-fr gap-[18px] max-lap:grid-cols-2 max-xs:gap-2.5">
        {list.map((x, i) => (
          <Reveal key={x.slug} delay={i * .06} tx="transition-[opacity] duration-1000 ease-soft" className="flex">
            <ProductCard p={x} className="w-full" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const p = productBySlug(slug)
  if (!p) return <Navigate to="/marketplace" replace />
  let n = 1
  return (
    <main className="bg-paper" key={slug}>
      <section className="wrap pt-[124px] pb-[clamp(80px,9vw,110px)]">
        <nav aria-label="Breadcrumb" className="mb-[26px] text-[13px] text-muted animate-fade-up">
          <Link to="/marketplace" className="text-muted hover:text-forest">Marketplace</Link> <span aria-hidden="true">/</span> {categoryLabel(p.cat)} <span aria-hidden="true">/</span> <span className="text-ink-2">{p.short}</span>
        </nav>
        <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-12 items-start max-tab:grid-cols-1 max-tab:gap-8">
          <div className="animate-fade-up" style={{ animationDelay: '.1s' }}><Gallery p={p} /></div>
          <div className="animate-fade-up" style={{ animationDelay: '.25s' }}><BuyBox p={p} /></div>
        </div>
      </section>
      {p.hasParts && <PartsExplorer />}
      <SpecsAndBox p={p} idx={pad(p.hasParts ? n++ : n - 1)} />
      {p.hasParts && <AppSection />}
      <Related p={p} idx={p.hasParts ? '04' : '02'} />
    </main>
  )
}
