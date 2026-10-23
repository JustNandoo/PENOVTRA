import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../hooks/useInView'
import { H2, SecHead, cx } from './ui'

/* hotspot positions are % of the device render; z = zoom level when selected */
const PARTS = [
  { t: 'Naungan Insect Net', s: 'Proteksi hama', x: 35, y: 17, z: 1.9,
    d: 'Jaring halus menutup seluruh bak. Hama seperti kutu daun dan ulat tertahan di luar, sementara cahaya dan udara tetap masuk.' },
  { t: 'Kipas Sirkulasi', s: 'Smart environment', x: 73.6, y: 13.8, z: 2.6,
    d: 'Menjaga udara di dalam naungan tetap bergerak sehingga panas dan kelembapan berlebih terbuang. Bisa menyala otomatis sesuai pembacaan sensor.' },
  { t: 'Kanopi Buka-Tutup', s: 'Akses mudah', x: 12.5, y: 40, z: 2.1,
    d: 'Rangka lengkung berengsel dengan tali penyangga. Dibuka saat menanam dan memanen, ditutup rapat saat hujan lebat atau terik.' },
  { t: 'Zona Media Tanam', s: '2-in-1 · sisi kiri', x: 24, y: 58, z: 2,
    d: 'Bak berisi tanah atau media tanam NovGrow, cocok untuk sayuran daun, herbal, dan tanaman yang butuh media padat.' },
  { t: 'Zona Hidroponik', s: '2-in-1 · sisi kanan', x: 76, y: 53, z: 2,
    d: 'Panel net pot hidroponik untuk selada dan sayuran daun yang tumbuh cepat dan bersih, tanpa tanah.' },
  { t: 'Rangka Modular', s: 'Modular estetik', x: 41, y: 70, z: 1.7,
    d: 'Bak modular berkaki setinggi pinggang, jadi tak perlu membungkuk saat merawat. Mudah dipasang dan rapi untuk teras, balkon, atau halaman.' },
]

/* screens from the NOVTRA Grow Companion design (585px wide, h = image height) */
const SCREENS = [
  { img: 'beranda', h: 2700, t: 'Tugas harian', s: 'Beranda',
    d: 'Setiap pagi, aplikasi menyusun tugas perawatan untuk tiap unit dan zona: cek reservoir, kelembapan media, sampai hama. Tandai selesai atau tunda dengan sekali ketuk.' },
  { img: 'pindai-qr', h: 1266, t: 'Pindai & hubungkan', s: 'Tambah unit',
    d: 'Pindai QR di kemasan atau badan unit PE-NOVTRA. Zona media tanam dan hidroponik langsung dibuat otomatis.' },
  { img: 'kebun-saya', h: 1380, t: 'Kebun saya', s: 'Semua unit',
    d: 'Kelola beberapa unit sekaligus, di teras, halaman, atau balkon. Lihat kelompok tanaman aktif dan tugas tiap unit.' },
  { img: 'fase-tumbuh', h: 1800, t: 'Fase tumbuh', s: 'Kelompok tanaman',
    d: 'Ikuti tiap kelompok tanaman dari semai, pindah tanam, tumbuh, sampai panen, lengkap dengan riwayat perawatan dan foto.' },
  { img: 'kalender', h: 1770, t: 'Kalender', s: 'Jadwal perawatan',
    d: 'Semua jadwal dalam tampilan mingguan atau bulanan, termasuk momen penting dan tugas yang terlewat. Bisa disinkronkan ke Google Calendar.' },
  { img: 'panduan', h: 1890, t: 'Panduan', s: 'Cara merawat',
    d: 'Cara merawat setiap tanaman, dibedakan per metode media tanam dan hidroponik, dari semai sampai panen.' },
  { img: 'catat-panen', h: 1440, t: 'Catat panen', s: 'Riwayat hasil',
    d: 'Catat hasil panen dalam gram, kg, ikat, atau buah, tambahkan foto, lalu mulai siklus tanam berikutnya.' },
]
const FRAME_H = 1266 // screen height at 585px wide (1170 × 2532 ÷ 2)

const pad = i => String(i + 1).padStart(2, '0')

function useNarrow() {
  const q = '(max-width: 859px)'
  const [narrow, setNarrow] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setNarrow(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return narrow
}

function Tabs({ mode, setMode }) {
  const refs = { device: useRef(null), app: useRef(null) }
  const [ind, setInd] = useState({ w: 0, x: 0 })

  useLayoutEffect(() => {
    const place = () => {
      const a = refs[mode].current
      setInd({ w: a.offsetWidth, x: a.offsetLeft - 5 })
    }
    place()
    window.addEventListener('resize', place)
    document.fonts?.ready.then(place)
    return () => window.removeEventListener('resize', place)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const tab = (key, label) => (
    <button
      ref={refs[key]} role="tab" aria-selected={mode === key} onClick={() => setMode(key)}
      className={cx('relative z-1 border-0 bg-transparent px-5 py-2.5 rounded-full text-[14px] font-medium transition-colors duration-300', mode === key ? 'text-white' : 'text-muted')}
    >
      {label}
    </button>
  )

  return (
    <div role="tablist" aria-label="Mode tampilan" className="relative inline-flex p-[5px] bg-white rounded-full border border-line">
      {tab('device', 'Unit PE-NOVTRA')}
      {tab('app', 'Aplikasi NOVTRA')}
      <span aria-hidden="true" className="absolute top-[5px] bottom-[5px] left-[5px] rounded-full bg-forest transition-[transform,width] duration-500 ease-soft"
        style={{ width: ind.w, transform: `translateX(${ind.x}px)` }} />
    </div>
  )
}

/* Three phones fanned out; the centre one shows the active screen and
   slowly scrolls through it when the screen is taller than the phone. */
function PhoneCarousel({ active, show, onPick }) {
  const narrow = useNarrow()
  const reduced = prefersReducedMotion()
  const n = SCREENS.length
  const gap = narrow ? 128 : 250

  return (
    <div aria-hidden={!show} className={cx(
      'absolute inset-0 transition-opacity duration-600 ease-soft',
      show ? 'opacity-100' : 'opacity-0 pointer-events-none'
    )}>
      {SCREENS.map((s, i) => {
        let o = i - active
        if (o > n / 2) o -= n
        if (o < -n / 2) o += n
        const near = Math.abs(o) <= 1
        const center = o === 0
        const tall = s.h > FRAME_H + 4
        const transform = center
          ? 'translateX(0) scale(1)'
          : `translateX(${o * gap}px) scale(${near ? .8 : .62}) rotate(${o * 4}deg)`

        return (
          <button
            key={s.img} type="button" tabIndex={near && !center ? 0 : -1}
            aria-label={center ? s.t : `Lihat layar ${s.t}`}
            onClick={() => onPick(i)}
            style={{ transform, zIndex: 3 - Math.abs(o) }}
            className={cx(
              'absolute left-1/2 top-11 -ml-[104px] w-[208px] p-[7px] rounded-[38px] bg-[#101a16] border-0 origin-bottom',
              'shadow-[0_40px_60px_-30px_rgba(0,40,30,.55),inset_0_0_0_1.5px_rgba(255,255,255,.08)]',
              'transition-[transform,opacity,filter] duration-[.8s,.6s,.6s] ease-soft',
              'max-tab:top-11 max-tab:-ml-[78px] max-tab:w-[156px] max-tab:p-[5px] max-tab:rounded-[28px]',
              center ? 'opacity-100 cursor-default' : near ? 'opacity-55 saturate-50 hover:opacity-80' : 'opacity-0 pointer-events-none'
            )}
          >
            <span className="block relative overflow-hidden rounded-[31px] aspect-[1170/2532] bg-[#f6f7f3] max-tab:rounded-[23px]">
              <img
                key={center ? `on-${active}` : 'off'}
                src={`/assets/app/${s.img}.webp`} alt="" width="585" height={s.h} loading="lazy" draggable="false"
                className="block w-full h-auto select-none"
                style={center && tall && !reduced ? {
                  '--dist': `${-(1 - FRAME_H / s.h) * 100}%`,
                  animation: `screen-scroll ${Math.max(3.5, (s.h - FRAME_H) / 300)}s var(--ease-io) 1.4s both`,
                } : undefined}
              />
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function Explorer() {
  const [mode, setMode] = useState('device')
  const [cur, setCur] = useState(-1)
  const [scr, setScr] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hover, setHover] = useState(false)
  const [coord, setCoord] = useState('X 00.0 · Y 00.0')
  const tiltRef = useRef(null)
  const isApp = mode === 'app'

  const select = i => setCur(c => (typeof i === 'function' ? i(c) : i))
  const next = () => isApp ? setScr(s => (s + 1) % SCREENS.length) : select(c => (c + 1) % PARTS.length)
  const prev = () => isApp ? setScr(s => (s <= 0 ? SCREENS.length - 1 : s - 1)) : select(c => (c <= 0 ? PARTS.length - 1 : c - 1))

  const part = PARTS[cur]
  const z = part ? (window.innerWidth < 860 ? Math.min(part.z, 1.8) : part.z) : 1
  const zoomTransform = part ? `scale(${z}) translate(${50 - part.x}%, ${42 - part.y}%)` : ''
  const screen = SCREENS[scr]

  // app screens advance on their own; tall screens get time to finish scrolling
  useEffect(() => {
    if (!isApp || !playing || hover || prefersReducedMotion()) return
    const tall = screen.h > FRAME_H + 4
    const id = setTimeout(() => setScr(s => (s + 1) % SCREENS.length), tall ? 7500 : 5000)
    return () => clearTimeout(id)
  }, [isApp, playing, hover, scr, screen.h])

  // gentle 3D tilt + coordinate readout
  const onMove = e => {
    const r = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height
    setCoord(`X ${(nx * 100).toFixed(1).padStart(4, '0')} · Y ${(ny * 100).toFixed(1).padStart(4, '0')}`)
    if (!prefersReducedMotion() && !isApp) tiltRef.current.style.transform = `rotateY(${(nx - .5) * 10}deg) rotateX(${(.5 - ny) * 6}deg)`
  }
  const onLeave = () => { setHover(false); if (!isApp) tiltRef.current.style.transform = '' }
  useEffect(() => {
    tiltRef.current.style.transform = isApp ? 'translateX(-60px) scale(.94)' : ''
  }, [isApp])

  const onKey = e => {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'Escape' && !isApp) select(-1)
  }

  // the left list follows the active tab
  const items = isApp ? SCREENS : PARTS
  const activeItem = isApp ? scr : cur
  const pick = i => isApp ? setScr(i) : select(cur === i ? -1 : i)

  const card = isApp
    ? { key: `a${scr}`, tag: `${pad(scr)} / ${pad(SCREENS.length - 1)} · Grow Companion`, title: screen.t, desc: screen.d }
    : {
      key: `d${cur}`,
      tag: part ? `${pad(cur)} / 06 · ${part.s}` : '6 bagian utama',
      title: part ? part.t : 'Satu unit, dua cara tanam',
      desc: part ? part.d : 'Klik titik bernomor pada alat atau pilih dari daftar untuk melihat setiap bagian dari dekat.',
    }
  const navButtons = isApp
    ? [['←', 'Layar sebelumnya', prev], [playing ? 'Jeda' : 'Putar', playing ? 'Jeda putar otomatis' : 'Putar otomatis', () => setPlaying(p => !p)], ['→', 'Layar berikutnya', next]]
    : [['←', 'Bagian sebelumnya', prev], ['Lihat utuh', 'Tampilkan seluruh alat', () => select(-1)], ['→', 'Bagian berikutnya', next]]

  return (
    <section id="alat" className="relative bg-mist py-[clamp(90px,10vw,140px)]">
      <div className="wrap">
        <div className="grid grid-cols-[1fr_auto] items-end gap-x-10 gap-y-6 mb-10 max-tab:grid-cols-1">
          <SecHead idx="02" className="col-span-full mb-0">Jelajahi alatnya</SecHead>
          <H2 className="max-w-[18ch]">Lihat lebih dekat, <em>bagian per bagian.</em></H2>
          <Tabs mode={mode} setMode={setMode} />
        </div>

        <div className="grid grid-cols-[300px_1fr] gap-5 max-lap:grid-cols-1">
          {/* part / screen list */}
          <ol key={mode} className="flex flex-col gap-1.5 max-lap:flex-row max-lap:overflow-x-auto max-lap:gap-2 no-scrollbar animate-swap">
            {items.map((p, i) => {
              const on = activeItem === i
              return (
                <li key={p.t} className="max-lap:flex-none">
                  <button
                    type="button" aria-pressed={on} onClick={() => pick(i)}
                    className={cx(
                      'w-full text-left border rounded-xl px-[18px] grid grid-cols-[30px_1fr] gap-x-3 gap-y-0.5 items-baseline',
                      'transition-[background-color,border-color] duration-350',
                      'max-lap:grid-cols-[auto_auto] max-lap:px-4 max-lap:py-2.5 max-lap:rounded-full',
                      isApp ? 'py-3' : 'py-4',
                      on
                        ? 'bg-white border-line shadow-[0_10px_30px_-18px_rgba(0,72,58,.35)]'
                        : 'bg-transparent border-transparent hover:bg-white/50 max-lap:bg-white/55'
                    )}
                  >
                    <span className={cx('text-[12px] font-semibold tabular-nums', on ? 'text-lime' : 'text-muted')}>{pad(i)}</span>
                    <span className="font-semibold text-forest text-[15.5px]">{p.t}</span>
                    <span className="col-start-2 text-[12.5px] text-muted max-lap:hidden">{p.s}</span>
                  </button>
                </li>
              )
            })}
          </ol>

          {/* stage */}
          <div
            tabIndex={0}
            aria-label={isApp
              ? 'Tampilan aplikasi NOVTRA Grow Companion, gunakan panah kiri dan kanan untuk berpindah layar'
              : 'Penjelajah alat PE-NOVTRA, gunakan panah kiri dan kanan untuk berpindah bagian'}
            onPointerMove={onMove} onPointerEnter={() => setHover(true)} onPointerLeave={onLeave} onKeyDown={onKey}
            className={cx(
              'relative overflow-hidden min-h-[660px] rounded-[32px] border border-line [perspective:1400px] transition-[min-height] duration-500 ease-soft',
              isApp ? 'max-tab:min-h-[700px]' : 'max-tab:min-h-[600px]',
              'bg-[radial-gradient(120%_90%_at_50%_100%,#fff_0%,#f6f8f1_45%,#eef1e7_100%)]',
              isApp ? 'cursor-default' : 'cursor-crosshair'
            )}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(0,72,58,.16)_1px,transparent_1.2px)] bg-size-[26px_26px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
            <div aria-hidden="true" className="absolute top-5 inset-x-6 z-4 flex justify-between text-[11px] tracking-[.14em] text-muted tabular-nums">
              {isApp
                ? <><span>NOVTRA GROW COMPANION</span><span>{pad(scr)} / {pad(SCREENS.length - 1)}</span></>
                : <><span>{coord}</span><span>{z.toFixed(1)}×</span></>}
            </div>

            <div ref={tiltRef} className={cx(
              'absolute inset-0 grid place-items-center [transform-style:preserve-3d] transition-[transform,opacity] duration-600 ease-soft',
              isApp && 'opacity-0 pointer-events-none'
            )}>
              <div
                className="relative w-[min(78%,620px)] -mt-[110px] origin-center transition-transform duration-[1.1s] ease-io max-tab:w-[92%] max-tab:-mt-[170px]"
                style={{ transform: zoomTransform }}
              >
                <img src="/assets/device.webp" alt="Render unit PE-NOVTRA" width="1600" height="1306" loading="lazy" draggable="false"
                  className="w-full h-auto select-none drop-shadow-[0_30px_40px_rgba(0,40,30,.25)]" />
                <div className="absolute inset-0">
                  {PARTS.map((p, i) => {
                    const on = cur === i
                    return (
                      <button
                        key={p.t} type="button" aria-label={p.t}
                        onClick={e => { e.stopPropagation(); select(on ? -1 : i) }}
                        style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `scale(${1 / z})`, '--dl': `${i * .35}s` }}
                        className={cx(
                          'absolute w-[30px] h-[30px] -ml-[15px] -mt-[15px] p-0 border-0 rounded-full grid place-items-center text-[11px] font-semibold',
                          'shadow-[0_0_0_4px_rgba(255,255,255,.85),0_8px_18px_rgba(0,40,30,.3)] transition-[background-color,transform,opacity] duration-[.3s,.4s,.4s] ease-soft',
                          'before:absolute before:-inset-2 before:rounded-full before:border-[1.5px] before:border-lime before:animate-ring before:[animation-delay:var(--dl)]',
                          on ? 'bg-lime text-forest-3' : 'bg-forest text-white hover:bg-lime',
                          cur >= 0 && !on && 'opacity-45'
                        )}
                      >
                        {i + 1}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* app mode */}
            <PhoneCarousel active={scr} show={isApp} onPick={setScr} />

            {/* info card */}
            <div aria-live="polite" className={cx(
              'absolute inset-x-5 bottom-5 z-5 grid grid-cols-[auto_1fr_auto] [grid-template-areas:"tag_tag_nav"_"title_desc_nav"] gap-x-7 gap-y-1 items-center',
              'px-[22px] py-5 rounded-[20px] bg-white/86 border border-line backdrop-blur-[12px]',
              'max-tab:grid-cols-1 max-tab:[grid-template-areas:"tag"_"title"_"desc"_"nav"] max-tab:gap-1.5'
            )}>
              <span key={`tag${card.key}`} className="[grid-area:tag] text-[11px] font-semibold tracking-[.14em] uppercase text-lime animate-swap">
                {card.tag}
              </span>
              <h3 key={`t${card.key}`} className="[grid-area:title] text-[22px] text-forest min-w-[210px] animate-swap max-tab:min-w-0">
                {card.title}
              </h3>
              <p key={`d${card.key}`} className="[grid-area:desc] text-[14.5px] text-ink-2 max-w-[62ch] animate-swap">
                {card.desc}
              </p>
              <div className="[grid-area:nav] flex gap-1.5 max-tab:mt-2">
                {navButtons.map(([label, aria, fn]) => (
                  <button key={aria} type="button" aria-label={aria} onClick={fn}
                    className="h-[42px] min-w-[42px] px-3.5 rounded-full border border-line bg-white text-[14px] transition-colors duration-300 hover:bg-forest hover:text-white">
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
