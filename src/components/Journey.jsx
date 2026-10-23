import { useEffect, useRef, useState } from 'react'
import { CountUp, Eyebrow, H2, Reveal, SecHead, Tag, cx } from './ui'

const MILESTONES = [
  { img: 'ms-sawit', alt: 'Panen kelapa sawit dengan alat panen', time: 'Oktober 2025', t: 'The Beginning',
    d: 'Berawal dari pengalaman langsung di perkebunan kelapa sawit. Kami mengembangkan teknologi alat panen sawit dan mencatat penjualan awal Rp8 juta.' },
  { img: 'ms-map', alt: 'Peta perjalanan Dumai ke Surabaya', time: 'Juni 2026', t: 'Market Discovery',
    d: 'Eksplorasi pasar membuka peluang di kebutuhan budidaya perkotaan, pasar yang lebih dekat dengan konsumen.' },
  { img: 'ms-circular', alt: 'Tim bersama mitra dan produk NovGrow', time: 'Juli 2026', t: 'Circular Innovation',
    d: 'Lahir NovGrow, media tanam dari limbah sawit, dan Novtra Agro sebagai lini agribisnis. 150 produk terjual.' },
  { img: 'device', alt: 'Unit PE-NOVTRA', time: 'Agustus 2026', t: 'Strategic Refocus', now: true,
    d: 'Fokus ke PE-NOVTRA: 2-in-1 smart modular growing system untuk home growing yang terlindungi dan terdampingi digital.' },
]

const AWARDS = [
  { img: 'pertamuda-award', alt: 'Tim PE-NOVTRA menerima dana pembinaan di Awarding Night Pertamuda Seed and Scale 2025',
    tag: 'Pertamuda Seed & Scale 2025', t: 'Top 3 Energy Founder',
    d: 'Peringkat 2 subkategori Energy Future dari Pertamina, dengan dana pembinaan Rp35 juta. Diumumkan di Awarding Night, Yogyakarta, 28 Oktober 2025.' },
  { img: 'hult', alt: 'Tim PE-NOVTRA di Hult Prize Indonesia', tag: 'Hult Prize', t: 'Top 39 Indonesia',
    d: 'Bagian dari 1.500 startup terbaik dunia dari 18.000+ tim di 130+ negara.' },
  { img: 'fowler', alt: 'Tim PE-NOVTRA di Fowler GSIC, San Diego', tag: 'Fowler GSIC 2026', t: 'Global Finalist',
    d: 'Finalis global kompetisi Fowler Global Social Innovation Challenge di San Diego, USA.' },
]

const PARTNERS = [
  { img: 'pertamuda', name: 'Pertamuda' },
  { img: 'brics', name: 'BRICS+ Youth Innovation Summit' },
  { img: 'kadin-dumai', name: 'Kadin Kota Dumai' },
  { img: 'hipmi-pens', name: 'HIPMI Perguruan Tinggi Politeknik Elektronika Negeri Surabaya' },
  { img: 'mitra', name: 'Mitra pendukung' },
  { img: 'apmi', name: 'APMI, Asosiasi Planters Muda Indonesia' },
  { img: 'ram-harapan', name: 'RAM Harapan' },
  { img: 'p4s-laksamana-tani', name: 'P4S Laksamana Tani' },
  { img: 'pensky', name: 'Pensky Venture' },
]

const TRACTION = [[20, 'wawancara calon pembeli'], [17, 'menerima harga'], [150, 'produk NovGrow terjual']]

/* horizontal timeline you can drag with the mouse (touch uses native scrolling) */
function useDragScroll(ref) {
  const [dragging, setDragging] = useState(false)
  useEffect(() => {
    const el = ref.current
    let drag = null
    const down = e => {
      if (e.pointerType !== 'mouse') return
      drag = { x: e.clientX, s: el.scrollLeft }
      setDragging(true)
    }
    const move = e => { if (drag) el.scrollLeft = drag.s - (e.clientX - drag.x) }
    const up = () => { if (drag) { drag = null; setDragging(false) } }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [ref])
  return dragging
}

export default function Journey() {
  const tl = useRef(null)
  const dragging = useDragScroll(tl)

  return (
    <section id="perjalanan" className="bg-mist py-[clamp(90px,10vw,150px)] overflow-hidden">
      <div className="wrap">
        <SecHead idx="06">Perjalanan kami</SecHead>
        <H2 className="max-w-[19ch] mb-[clamp(40px,5vw,70px)]">Dari kebun sawit di Dumai, <em>ke halaman rumah kota.</em></H2>
      </div>

      <div
        ref={tl}
        className={cx(
          'grid grid-flow-col auto-cols-[clamp(280px,28vw,380px)] gap-5 overflow-x-auto no-scrollbar pb-2.5',
          'px-[max(var(--gutter),calc((100vw_-_var(--wrap))_/_2))] scroll-px-[max(var(--gutter),calc((100vw_-_var(--wrap))_/_2))]',
          dragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'
        )}
      >
        {MILESTONES.map(m => (
          <article key={m.t} className={cx(
            'group relative snap-start pt-[34px]',
            'before:absolute before:top-1.5 before:left-0 before:-right-5 before:h-px before:bg-line',
            'after:absolute after:top-0 after:left-0 after:w-[13px] after:h-[13px] after:rounded-full',
            m.now
              ? 'after:bg-lime after:shadow-[0_0_0_4px_var(--color-mist),0_0_0_8px_rgba(128,178,20,.3)]'
              : 'after:bg-forest after:shadow-[0_0_0_4px_var(--color-mist)]'
          )}>
            <figure className="m-0 mb-5 aspect-[4/3] rounded-[20px] overflow-hidden bg-white">
              <img src={`/assets/${m.img}.webp`} alt={m.alt} loading="lazy" className={cx(
                'w-full h-full pointer-events-none transition-[scale] duration-[1.2s] ease-soft group-hover:scale-105',
                m.now ? 'object-contain p-[18px]' : 'object-cover'
              )} />
            </figure>
            <time className="text-[12px] font-semibold tracking-[.14em] uppercase text-lime">{m.time}</time>
            <h3 className="text-[24px] text-forest mt-1.5 mb-2.5">{m.t}</h3>
            <p className="text-muted text-[14.5px]">{m.d}</p>
          </article>
        ))}
      </div>

      <div className="wrap">
        <div className="grid grid-cols-3 gap-5 mt-[clamp(60px,7vw,100px)] max-tab:grid-cols-1">
          {AWARDS.map(a => (
            <Reveal as="article" key={a.t} className="flex flex-col overflow-hidden rounded-[32px] bg-white border border-line">
              <img src={`/assets/${a.img}.webp`} alt={a.alt} loading="lazy" className="aspect-video object-cover w-full" />
              <div className="px-6 pt-[22px] pb-[26px]">
                <Tag>{a.tag}</Tag>
                <h3 className="text-[24px] text-forest mb-2">{a.t}</h3>
                <p className="text-muted text-[14.5px]">{a.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* market validation: one horizontal band so the numbers read side by side */}
        <Reveal className={cx(
          'relative overflow-hidden mt-5 grid grid-cols-[1.15fr_repeat(3,1fr)] items-stretch rounded-[32px] bg-forest text-white px-9 py-8',
          'max-lap:grid-cols-3 max-xs:grid-cols-1 max-xs:px-7',
          'before:absolute before:-right-24 before:-top-24 before:w-72 before:h-72 before:rounded-full before:bg-[radial-gradient(closest-side,rgba(154,205,43,.18),transparent)]'
        )}>
          <div className="relative self-center pr-8 max-lap:col-span-full max-lap:pr-0 max-lap:pb-7">
            <Eyebrow className="text-white/60 mb-3">Validasi pasar</Eyebrow>
            <p className="text-[clamp(20px,2vw,26px)] font-semibold leading-[1.25] tracking-[-.02em] max-w-[16ch]">
              Diuji langsung ke <em className="text-lime-2">calon pembeli.</em>
            </p>
          </div>
          {TRACTION.map(([n, label], i) => (
            <div key={label} className={cx(
              'relative grid content-center gap-2 pl-8 border-l border-forest-line',
              i === 0 && 'max-lap:pl-0 max-lap:border-l-0',
              'max-xs:pl-0 max-xs:border-l-0 max-xs:border-t max-xs:pt-5 max-xs:mt-5'
            )}>
              <span className="text-[clamp(44px,5vw,64px)] font-semibold tracking-[-.045em] text-lime-2 tabular-nums leading-none"><CountUp to={n} /></span>
              <span className="text-white/75 text-[14px] max-w-[18ch] min-h-[2lh]">{label}</span>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-5 grid grid-cols-[minmax(0,.85fr)_minmax(0,2fr)] items-center gap-10 rounded-[32px] bg-white border border-line p-8 max-tab:grid-cols-1 max-tab:gap-7 max-xs:p-5">
          <div className="max-tab:px-1">
            <Eyebrow className="text-muted mb-3">Didukung oleh</Eyebrow>
            <h3 className="text-[clamp(22px,2.2vw,30px)] text-forest leading-[1.15] max-w-[14ch]">
              Tumbuh bersama <em>ekosistem yang tepat.</em>
            </h3>
            <p className="mt-3 text-muted text-[14.5px] max-w-[34ch]">
              Program, komunitas, dan mitra yang mendukung perjalanan PE-NOVTRA.
            </p>
          </div>
          <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-[20px] border border-line bg-line">
            {PARTNERS.map(p => (
              <li key={p.img} className="group grid place-items-center bg-white aspect-[16/10] p-5 max-xs:aspect-[4/3] max-xs:p-3">
                <img src={`/assets/partners/${p.img}.webp`} alt={p.name} loading="lazy"
                  className="max-h-[88px] max-w-[74%] w-auto h-auto object-contain transition-[scale] duration-500 ease-soft group-hover:scale-[1.06] max-xs:max-h-[52px] max-xs:max-w-[86%]" />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
