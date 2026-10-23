import { Btn, H2, Pill, Reveal, SecHead, Tag, cx } from './ui'

const INCLUDES = ['Unit dengan protective cover', 'Panduan QR & aplikasi', '1 tahun garansi produk', '1 paket grow kit']

const EDU_PHOTOS = [
  { src: '/assets/edu-mou.webp', alt: 'Penyerahan sertifikat kerja sama edukasi budidaya', cap: 'Kerja sama sekolah' },
  { src: '/assets/school.webp', alt: 'Siswa memegang hasil panen', cap: 'Praktik bersama siswa' },
]

const CheckDot = () => (
  <span className="flex-none w-[18px] h-[18px] mt-[3px] rounded-full bg-lime grid place-items-center">
    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-white [stroke-width:3.2] [stroke-linecap:round] [stroke-linejoin:round]"><path d="M6 12.5l4 4 8-9" /></svg>
  </span>
)

/* `stack` puts the media under the text so the card can grow to fill its row */
function EcoCard({ tag, title, text, className, titleClass, stack, children }) {
  return (
    <Reveal
      as="article"
      tx="transition-[translate,box-shadow] duration-600 ease-soft"
      className={cx(
        'overflow-hidden rounded-[32px] bg-white border border-line px-7 py-[26px]',
        stack ? 'flex flex-col gap-5' : 'grid grid-cols-2 gap-6 items-center max-tab:grid-cols-1',
        'hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,72,58,.35)]',
        className
      )}
    >
      <div>
        <Tag>{tag}</Tag>
        <h3 className={cx('text-[24px] text-forest mb-2', titleClass)}>{title}</h3>
        <p className={cx('text-muted text-[14.5px]', stack && 'max-w-[52ch]')}>{text}</p>
      </div>
      {children}
    </Reveal>
  )
}

export default function Ecosystem() {
  return (
    <section id="ekosistem" className="wrap pt-[clamp(90px,10vw,150px)] pb-[clamp(60px,8vw,110px)]">
      <SecHead idx="04">Produk &amp; ekosistem</SecHead>
      <H2 className="max-w-[20ch] mb-[clamp(40px,5vw,64px)]">Satu paket untuk mulai, <em>ekosistem untuk bertumbuh.</em></H2>

      <div className="grid grid-cols-[1fr_1.15fr] gap-5 max-tab:grid-cols-1">
        <Reveal as="article" className={cx(
          'group relative flex flex-col overflow-hidden rounded-[32px] p-[30px] bg-white border border-line',
          'before:absolute before:-inset-x-[20%] before:top-[18%] before:h-[55%] before:z-0 before:bg-[radial-gradient(closest-side,var(--color-lime-soft),transparent)]',
          '*:relative'
        )}>
          <div className="flex gap-1.5">
            <Pill tone="dark">B2C Package</Pill>
            <Pill tone="lime">1 Year Warranty</Pill>
          </div>
          <img src="/assets/device.webp" alt="" loading="lazy" width="1600" height="1306"
            className="w-[92%] mx-auto mt-[26px] mb-2.5 transition-[translate,rotate] duration-[1.2s] ease-soft group-hover:-translate-y-2 group-hover:-rotate-1" />
          <div className="flex items-baseline gap-2.5 flex-wrap pt-[18px] border-t border-line">
            <small className="text-muted text-[14px]">Mulai dari</small>
            <strong className="text-[clamp(36px,4vw,54px)] tracking-[-.045em] text-forest font-bold">Rp1.799.000</strong>
            <small className="text-muted text-[14px]">/ paket</small>
          </div>
          <ul className="grid grid-cols-2 gap-x-[18px] gap-y-2.5 mt-[18px] mb-[26px] max-xs:grid-cols-1">
            {INCLUDES.map(t => <li key={t} className="flex gap-2.5 text-[14.5px] text-ink-2"><CheckDot />{t}</li>)}
          </ul>
          <Btn href="#kontak" tone="dark" arrow="→" className="self-start mt-auto">Pesan sekarang</Btn>
        </Reveal>

        <div className="grid gap-5 grid-rows-[auto_auto_1fr]">
          <EcoCard
            tag="Penjualan budidaya" title="NovGrow" titleClass="italic font-extrabold"
            text="Media tanam organik, benih premium, dan nutrisi hidroponik untuk isi ulang grow kit."
            className="bg-[linear-gradient(135deg,#fff_40%,var(--color-lime-soft))]"
          >
            <img src="/assets/novgrow.webp" alt="Produk NovGrow: media tanam, benih premium, dan nutrisi" loading="lazy" className="w-full h-auto object-contain" />
          </EcoCard>
          <EcoCard tag="Services & after sales" title="Layanan purnajual" text="Servis, suku cadang, dan refill grow kit supaya alat terus produktif.">
            <img src="/assets/services.webp" alt="" loading="lazy" className="w-full h-auto object-contain" />
          </EcoCard>
          <EcoCard
            stack tag="Edukasi" title="Sekolah & komunitas"
            text="Pelatihan budidaya bersama sekolah dan komunitas, didampingi praktisi bersertifikat BNSP."
          >
            <div className="grid grid-cols-[1.15fr_1fr] gap-2.5 flex-1 min-h-[220px] max-xs:grid-cols-1 max-xs:min-h-0">
              {EDU_PHOTOS.map(p => (
                <figure key={p.src} className="group/ph relative m-0 overflow-hidden rounded-[20px] max-xs:aspect-[4/3]">
                  <img src={p.src} alt={p.alt} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-[scale] duration-[1.2s] ease-soft group-hover/ph:scale-105" />
                  <figcaption className="absolute left-3 bottom-3 px-3 py-1.5 rounded-full bg-white/88 backdrop-blur-[8px] text-[12px] font-medium text-forest">
                    {p.cap}
                  </figcaption>
                </figure>
              ))}
            </div>
          </EcoCard>
        </div>
      </div>
    </section>
  )
}
