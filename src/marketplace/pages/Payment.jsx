import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Reveal, cx } from '../../components/ui'
import { DarkBand } from '../components/DotField'
import { Em, PillTabs, SecHead, Title } from '../components/atoms'
import { useStore } from '../store'
import { INSURANCE, SHIPPING, lineItems, orderTotal, rupiah, subtotalOf } from '../data'

function useCountdown(seconds) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    const id = setInterval(() => setLeft(l => Math.max(0, l - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  const h = String(Math.floor(left / 3600)).padStart(2, '0')
  const m = String(Math.floor(left % 3600 / 60)).padStart(2, '0')
  const s = String(left % 60).padStart(2, '0')
  return [h, m, s]
}

function CopyBtn({ text }) {
  const [done, setDone] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(text.replace(/\s|Rp|\./g, '')).catch(() => {})
    setDone(true)
    setTimeout(() => setDone(false), 1600)
  }
  return (
    <button type="button" onClick={copy} className={cx('flex-none h-10 px-4 rounded-full text-[13.5px] font-medium transition-colors duration-300', done ? 'bg-forest text-white' : 'bg-mist text-forest hover:bg-lime-soft')}>
      <span key={String(done)} className="inline-block animate-swap">{done ? 'Tersalin ✓' : 'Salin'}</span>
    </button>
  )
}

const HOW = {
  mbank: { label: 'm-Banking', steps: ['Buka aplikasi m-Banking lalu pilih Transfer, kemudian Virtual Account.', 'Masukkan nomor virtual account di atas.', 'Periksa nama penerima PE-NOVTRA dan jumlahnya.', 'Masukkan PIN untuk menyelesaikan pembayaran.'] },
  atm: { label: 'ATM', steps: ['Masukkan kartu dan PIN, lalu pilih Transaksi Lainnya.', 'Pilih Transfer, kemudian Virtual Account.', 'Masukkan nomor virtual account dan periksa jumlahnya.', 'Konfirmasi lalu simpan struk sebagai bukti.'] },
  ibank: { label: 'Internet banking', steps: ['Masuk ke internet banking dari browser.', 'Pilih Transfer Dana, kemudian Virtual Account.', 'Masukkan nomor virtual account di atas.', 'Konfirmasi dengan token atau kode OTP.'] },
}

export default function Payment() {
  const { id } = useParams()
  const { orders, markPaid, user } = useStore()
  const nav = useNavigate()
  const [how, setHow] = useState('mbank')
  const [checking, setChecking] = useState(false)
  const [h, m, s] = useCountdown(23 * 3600 + 59 * 60 + 12)
  const order = orders.find(o => o.id === id)

  if (!order) return <Navigate to="/marketplace/profil" replace />
  if (order.status !== 'bayar') return <Navigate to={`/marketplace/berhasil/${id}`} replace />

  const items = lineItems(order.lines)
  const ship = SHIPPING.find(x => x.id === order.shipping)
  const total = orderTotal(order)
  const isVa = order.pay.startsWith('VA')
  const bank = isVa ? order.pay.slice(3) : null
  const va = '8077 ' + user.phone.replace(/\D/g, '').slice(2).replace(/(\d{4})(\d{4})(\d+)/, '$1 $2 $3')

  const check = () => {
    setChecking(true)
    setTimeout(() => { markPaid(id); nav(`/marketplace/berhasil/${id}`) }, 1100)
  }

  return (
    <main className="bg-paper">
      <DarkBand id="mk-hero" word="NOVTRA" className="pt-[150px] pb-[200px] max-xs:pt-28 max-xs:pb-[150px]">
        <div className="wrap relative grid grid-cols-[1fr_auto] gap-10 items-end max-tab:grid-cols-1 max-tab:gap-8">
          <div>
            <p className="inline-flex items-center gap-2.5 mb-6 px-4 py-2 rounded-full text-[13px] font-medium bg-white/6 border border-white/16 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse-dot" />Menunggu pembayaran · {order.id}
            </p>
            <h1 className="text-[clamp(40px,5.4vw,72px)] leading-[1.03] tracking-[-.045em] font-semibold">
              <span className="block overflow-hidden"><span className="inline-block animate-line-up" style={{ animationDelay: '.1s' }}>Selesaikan pembayaran</span></span>
              <span className="block overflow-hidden"><span className="inline-block animate-line-up" style={{ animationDelay: '.22s' }}><Em light>sebelum waktunya habis.</Em></span></span>
            </h1>
          </div>
          <div className="animate-chip-in" style={{ animationDelay: '.45s' }}>
            <span className="block mb-2 text-[13px] text-white/60">Sisa waktu</span>
            <span className="flex gap-2 font-semibold tabular-nums">
              {[h, m, s].map((v, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="grid place-items-center w-[78px] h-[84px] rounded-[22px] bg-white/8 border border-white/14 text-[40px] tracking-[-.03em] max-xs:w-16 max-xs:h-[70px] max-xs:text-[32px]">
                    <span key={v} className="inline-block animate-swap">{v}</span>
                  </span>
                  {i < 2 && <span className="text-[30px] text-white/40">:</span>}
                </span>
              ))}
            </span>
            <span className="block mt-3 text-[13px] text-white/60">Batas: 17 Nov 2026, 14.32 WIB</span>
          </div>
        </div>
      </DarkBand>

      <section className="wrap relative -mt-[140px] max-xs:-mt-[110px] pb-[clamp(80px,9vw,100px)]">
        <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-5 items-start max-lap:grid-cols-1">
          <div className="bg-white rounded-[32px] p-9 shadow-[0_50px_80px_-50px_rgba(0,40,30,.55)] animate-toast-in max-xs:p-5 max-xs:rounded-[26px]" style={{ animationDelay: '.3s' }}>
            <p className="mb-6 text-[12px] font-medium tracking-[.18em] uppercase text-muted">{isVa ? `Transfer virtual account ${bank}` : `Bayar dengan ${order.pay}`}</p>
            {isVa ? (
              <div className="flex items-center justify-between gap-4 px-6 py-5 rounded-[24px] bg-paper border border-ink/10 max-xs:px-4 max-xs:flex-wrap">
                <span className="min-w-0"><span className="block mb-1 text-[13px] text-muted">Nomor virtual account</span>
                  <b className="block text-[clamp(24px,3vw,34px)] font-semibold tracking-[.02em] text-forest tabular-nums">{va}</b></span>
                <CopyBtn text={va} />
              </div>
            ) : (
              <div className="grid grid-cols-[150px_1fr] gap-6 items-center px-6 py-5 rounded-[24px] bg-paper border border-ink/10 max-xs:grid-cols-1">
                <span aria-hidden="true" className="grid grid-cols-7 gap-[3px] w-[150px] h-[150px] p-3 rounded-[18px] bg-white">
                  {Array.from({ length: 49 }, (_, i) => <span key={i} className={cx('rounded-[2px]', (i * 7 + (i >> 2)) % 3 === 0 || [0, 1, 2, 7, 14, 4, 5, 6, 13, 20, 28, 35, 42, 43, 44].includes(i) ? 'bg-forest' : '')} />)}
                </span>
                <p className="text-[14.5px] leading-[1.6] text-ink-2">Pindai kode ini dari aplikasi {order.pay === 'QRIS' ? 'bank atau e-wallet apa pun' : order.pay}. Status pesanan berubah otomatis setelah pembayaran masuk.</p>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 mt-3 px-6 py-5 rounded-[24px] bg-paper border border-ink/10 max-xs:px-4">
              <span className="min-w-0"><span className="block mb-1 text-[13px] text-muted">Jumlah yang harus dibayar</span>
                <b className="block text-[clamp(26px,3vw,34px)] font-semibold tracking-[-.03em] text-forest">{rupiah(total)}</b></span>
              <CopyBtn text={String(total)} />
            </div>
            <p className="mt-4 px-5 py-3.5 rounded-[18px] bg-lime-soft text-[13.5px] leading-[1.55] text-forest">Transfer tepat sampai 3 digit terakhir agar terverifikasi otomatis.</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <button type="button" onClick={check} disabled={checking} className="group flex-1 min-w-[220px] h-14 flex items-center justify-center gap-2.5 rounded-full bg-lime text-forest-3 text-[15.5px] font-medium hover:bg-lime-2 transition-colors disabled:opacity-80">
                {checking
                  ? <><span className="w-4 h-4 rounded-full border-2 border-forest-3/30 border-t-forest-3 animate-spin" />Mengecek pembayaran…</>
                  : <>Cek status pembayaran <span aria-hidden="true" className="transition-[translate] duration-400 group-hover:translate-x-1">→</span></>}
              </button>
              <Link to="/marketplace/profil" className="grid place-items-center h-14 px-7 rounded-full border border-ink/18 text-[15px] font-medium text-forest hover:border-forest max-xs:flex-1">Bayar nanti</Link>
            </div>
          </div>

          <aside aria-label="Ringkasan pesanan" className="bg-white border border-ink/12 rounded-[32px] p-8 animate-fade-up max-xs:p-6" style={{ animationDelay: '.45s' }}>
            <p className="mb-1 text-[12px] font-medium tracking-[.18em] uppercase text-muted">Pesanan</p>
            <b className="block mb-5 text-[20px] font-semibold tracking-[-.02em] text-forest">{order.id}</b>
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 text-[14.5px]">
              <dt className="text-muted">{items.reduce((a, i) => a + i.qty, 0)} produk</dt><dd className="text-right">{rupiah(subtotalOf(items))}</dd>
              <dt className="text-muted">{ship.name} · {ship.eta}</dt><dd className="text-right">{rupiah(ship.price)}</dd>
              {order.insured && <><dt className="text-muted">Asuransi</dt><dd className="text-right">{rupiah(INSURANCE)}</dd></>}
              <dt className="pt-3.5 border-t border-ink/10 font-semibold text-forest">Total</dt><dd className="pt-3.5 border-t border-ink/10 text-right font-bold text-forest">{rupiah(total)}</dd>
            </dl>
            {order.address && (
              <p className="mt-5 px-[18px] py-3.5 rounded-[18px] bg-mist text-[13.5px] leading-[1.55] text-ink-2">Dikirim ke <b className="font-semibold text-forest">{order.address.label}</b> · {order.address.name}, {order.address.addr.split(',').slice(1, 3).join(',').trim()}</p>
            )}
          </aside>
        </div>

        {isVa && (
          <div className="mt-[clamp(70px,8vw,96px)]">
            <SecHead idx="01">Cara bayar</SecHead>
            <div className="flex flex-wrap items-end justify-between gap-6 mb-9">
              <Reveal><Title className="text-[clamp(32px,4vw,52px)]">Tiga cara, <Em>pilih yang paling mudah.</Em></Title></Reveal>
              <PillTabs items={Object.entries(HOW).map(([id, v]) => ({ id, label: v.label }))} value={how} onChange={setHow} label="Cara bayar" />
            </div>
            <ol key={how} className="grid grid-cols-4 gap-[18px] max-lap:grid-cols-2 max-xs:grid-cols-1">
              {HOW[how].steps.map((t, i) => (
                <li key={i} className="bg-white border border-ink/12 rounded-[28px] p-7 animate-rise" style={{ animationDelay: `${i * .07}s` }}>
                  <span className={cx('grid place-items-center w-11 h-11 mb-5 rounded-full text-[13px] font-bold', i === 0 ? 'bg-lime text-forest-3' : 'border border-ink/18 text-forest')}>0{i + 1}</span>
                  <p className="text-[15px] leading-[1.6] text-ink-2">{t.replace('di atas', bank ? `${bank} di atas` : 'di atas')}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </main>
  )
}
