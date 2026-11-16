import { Link, Navigate, useParams } from 'react-router-dom'
import { Reveal, cx } from '../../components/ui'
import { DarkBand } from '../components/DotField'
import { Em, SecHead, Title } from '../components/atoms'
import { useStore } from '../store'
import { orderTotal, rupiah } from '../data'

const AFTER = [
  ['Rakit', 'Ikuti panduan QR di dalam kotak untuk memasang rangka, bak, dan naungan.'],
  ['Pindai', 'Masuk ke Grow Companion dengan akun yang sama, lalu pindai QR di unit. Zona media tanam dan hidroponik dibuat otomatis.'],
  ['Tanam', 'Pakai grow kit dari paketmu. Aplikasi mengingatkan tugas harian sampai panen.'],
]

export default function Success() {
  const { id } = useParams()
  const { orders, user } = useStore()
  const order = orders.find(o => o.id === id)
  if (!order) return <Navigate to="/marketplace/profil" replace />
  if (order.status === 'bayar') return <Navigate to={`/marketplace/pembayaran/${id}`} replace />

  const total = orderTotal(order)
  const timeline = [
    ['16 Nov · 14.30', 'Pesanan dibuat', 'Checkout berhasil.', 'done'],
    ['16 Nov · 14.41', 'Pembayaran diterima', `${order.pay} · ${rupiah(total)}`, 'now'],
    ['Berikutnya', 'Dikemas', 'Unit dicek dan dikemas.', 'next'],
    ['Berikutnya', 'Dikirim', 'Nomor resi muncul di Profil.', 'next'],
    ['20–22 Nov', 'Diterima', 'Garansi mulai berlaku.', 'next'],
  ]

  return (
    <main className="bg-paper">
      <DarkBand id="mk-hero" word="NOVTRA" className="pt-[160px] pb-[clamp(110px,12vw,150px)] max-xs:pt-28">
        <div className="wrap relative flex flex-col items-center text-center">
          <span className="relative grid place-items-center w-24 h-24 mb-8 animate-pop" style={{ animationDelay: '.1s' }}>
            <span aria-hidden="true" className="absolute inset-0 rounded-full border border-lime-2/60 animate-ring" />
            <span aria-hidden="true" className="absolute inset-0 rounded-full border border-lime-2/40 animate-ring-late" />
            <span className="grid place-items-center w-full h-full rounded-full bg-lime text-forest-3 text-[40px] font-bold">✓</span>
          </span>
          <p className="mb-5 text-[12px] font-medium tracking-[.18em] uppercase text-lime-2 animate-fade-up" style={{ animationDelay: '.3s' }}>Pembayaran diterima</p>
          <h1 className="mb-5 text-[clamp(40px,6vw,80px)] leading-[1.02] tracking-[-.045em] font-semibold">
            <span className="block overflow-hidden"><span className="inline-block animate-line-up" style={{ animationDelay: '.35s' }}>Terima kasih, {user.first}.</span></span>
            <span className="block overflow-hidden"><span className="inline-block animate-line-up" style={{ animationDelay: '.47s' }}><Em light>Kebunmu segera tiba.</Em></span></span>
          </h1>
          <p className="max-w-[52ch] mb-9 text-[16.5px] leading-[1.6] font-light text-white/72 animate-fade-up" style={{ animationDelay: '.6s' }}>
            Pesanan <b className="font-semibold text-white">{order.id}</b> sedang disiapkan di Surabaya. Kami kabari lewat WhatsApp setiap statusnya berubah.
          </p>
          <div className="flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: '.7s' }}>
            <Link to={`/marketplace/profil?order=${order.id}`} className="group inline-flex items-center gap-2.5 h-14 px-7 rounded-full bg-lime text-forest-3 text-[15.5px] font-medium hover:bg-lime-2 hover:text-forest-3 transition-colors">
              Lacak di Profil <span aria-hidden="true" className="transition-[translate] duration-400 group-hover:translate-x-1">→</span>
            </Link>
            <Link to="/marketplace" className="inline-flex items-center h-14 px-7 rounded-full border border-white/30 text-[15px] font-medium text-white hover:bg-white/10 hover:text-white">Belanja lagi</Link>
          </div>
          <dl className="grid grid-cols-2 mt-14 w-full max-w-[560px] rounded-[28px] bg-forest-3/55 border border-white/14 backdrop-blur-[10px] animate-chip-in max-xs:grid-cols-1" style={{ animationDelay: '.85s' }}>
            <div className="px-7 py-6 border-r border-white/12 max-xs:border-r-0 max-xs:border-b"><dt className="mb-1 text-[13px] text-white/60">Total dibayar</dt><dd className="text-[28px] font-semibold tracking-[-.03em] text-lime-2">{rupiah(total)}</dd></div>
            <div className="px-7 py-6"><dt className="mb-1 text-[13px] text-white/60">Estimasi tiba</dt><dd className="text-[28px] font-semibold tracking-[-.03em]">20–22 Nov 2026</dd></div>
          </dl>
        </div>
      </DarkBand>

      <section className="wrap pt-[clamp(80px,9vw,110px)] pb-[clamp(60px,7vw,80px)]">
        <SecHead idx="01">Status pesanan</SecHead>
        <Reveal><Title className="mb-12 text-[clamp(32px,4vw,52px)]">Dari gudang ke <Em>halaman rumahmu.</Em></Title></Reveal>
        <ol className="relative grid grid-cols-5 gap-4 max-lap:grid-cols-1 max-lap:gap-0">
          <li aria-hidden="true" className="absolute left-0 right-0 top-[21px] h-px bg-ink/15 max-lap:hidden" />
          <li aria-hidden="true" className="absolute left-0 w-[30%] top-[21px] h-px bg-lime max-lap:hidden" />
          {timeline.map(([t, title, d, st], i) => (
            <Reveal as="li" key={title} delay={i * .08} className="relative max-lap:grid max-lap:grid-cols-[44px_1fr] max-lap:gap-4 max-lap:pb-7">
              {i < timeline.length - 1 && <span aria-hidden="true" className={cx('hidden max-lap:block absolute left-[21px] top-11 bottom-0 w-px', st === 'next' ? 'bg-ink/15' : 'bg-lime')} />}
              <span className={cx('relative grid place-items-center w-11 h-11 mb-5 rounded-full text-[13px] font-bold max-lap:mb-0',
                st === 'done' ? 'bg-forest text-white' : st === 'now' ? 'bg-lime text-forest-3 shadow-[0_0_0_6px_rgba(128,178,20,.18)]' : 'bg-paper border border-ink/18 text-muted')}>
                {st === 'next' ? `0${i + 1}` : '✓'}
              </span>
              <span className="block">
                <span className="block mb-1.5 text-[12.5px] text-muted">{t}</span>
                <b className={cx('block mb-1 text-[18px] font-semibold tracking-[-.02em]', st === 'next' ? 'text-ink-2' : 'text-forest')}>{title}</b>
                <span className="block text-[14px] leading-[1.55] text-muted">{d}</span>
              </span>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="bg-mist pt-[clamp(80px,9vw,100px)] pb-[clamp(90px,10vw,120px)]">
        <div className="wrap">
          <SecHead idx="02">Setelah paket tiba</SecHead>
          <Reveal><Title className="mb-10 text-[clamp(32px,4vw,52px)]">Tiga langkah <Em>sampai menanam.</Em></Title></Reveal>
          <div className="grid grid-cols-3 gap-[18px] max-lap:grid-cols-1">
            {AFTER.map(([t, d], i) => (
              <Reveal key={t} delay={i * .1} className={cx('relative isolate overflow-hidden rounded-[32px] p-8 min-h-[260px] flex flex-col', i === 1 ? 'bg-forest text-white' : 'bg-white border border-ink/12')}>
                <span className={cx('text-[13px] font-semibold tabular-nums', i === 1 ? 'text-lime-2' : 'text-lime')}>0{i + 1}</span>
                <b className={cx('mt-auto mb-2.5 text-[40px] italic font-bold tracking-[-.04em]', i === 1 ? 'text-white' : 'text-forest')}>{t}</b>
                <p className={cx('text-[15px] leading-[1.6]', i === 1 ? 'text-white/72' : 'text-muted')}>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
