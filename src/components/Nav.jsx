import { useState } from 'react'
import { useScrollFrame } from '../hooks/useScrollFrame'
import { cx } from './ui'

const LINKS = [
  ['#tentang', 'Tentang'],
  ['#alat', 'Alat'],
  ['#cara-kerja', 'Cara Kerja'],
  ['#ekosistem', 'Ekosistem'],
  ['#perjalanan', 'Perjalanan'],
  // ['#tim', 'Tim'],
]

export function Brand({ className }) {
  return (
    <span className={cx('inline-flex items-center gap-2.5 font-extrabold italic text-[18px] tracking-[-.02em]', className)}>
      <img src="/assets/leaf.png" alt="" width="22" height="24" />
      <span><i className="text-lime">PE-</i>NOVTRA</span>
    </span>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(false)

  // switch to the light glass once the dark hero has scrolled away
  useScrollFrame(() => {
    const hero = document.getElementById('hero')
    if (hero) setLight(hero.getBoundingClientRect().bottom < 80)
  })

  const tone = open
    ? 'bg-forest-3/94 text-white border-white/12 rounded-[26px] flex-wrap'
    : light
      ? 'bg-paper/82 text-ink border-line rounded-full'
      : 'bg-forest-3/35 text-white border-white/12 rounded-full'

  return (
    <header className={cx(
      'fixed z-50 top-4 left-1/2 -translate-x-1/2 w-[min(calc(100%_-_32px),1180px)]',
      'flex items-center justify-between gap-6 py-2.5 pr-2.5 pl-[22px] border',
      'backdrop-blur-[14px] backdrop-saturate-[1.4] transition-[background-color,color,border-color,top] duration-400 animate-nav-in',
      tone
    )}>
      <a href="#top" aria-label="PE-NOVTRA beranda"><Brand /></a>

      <nav aria-label="Navigasi utama" className={cx(
        'gap-1 lap:flex lap:flex-row lap:w-auto lap:order-none lap:p-0',
        open ? 'flex flex-col w-full order-3 pt-1.5 pb-2.5' : 'hidden'
      )}>
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}
            className="px-3.5 py-2 rounded-full text-[14px] opacity-80 transition-[opacity,background-color] duration-200 hover:opacity-100 hover:bg-[rgba(127,127,127,.12)] max-lap:text-[18px] max-lap:px-1.5 max-lap:py-2.5">
            {label}
          </a>
        ))}
      </nav>

      <a href="#kontak" className="hidden lap:inline px-[18px] py-2.5 rounded-full bg-lime text-forest-3 text-[14px] font-medium whitespace-nowrap">
        Hubungi kami <span aria-hidden="true">↗</span>
      </a>

      <button
        type="button"
        aria-label="Buka menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="lap:hidden block relative w-[42px] h-[42px] rounded-full border-0 bg-lime"
      >
        <span className={cx('absolute left-[13px] right-[13px] top-[17px] h-0.5 bg-forest-3 transition-[translate,rotate] duration-300', open && 'translate-y-[3px] rotate-45')} />
        <span className={cx('absolute left-[13px] right-[13px] top-[23px] h-0.5 bg-forest-3 transition-[translate,rotate] duration-300', open && '-translate-y-[3px] -rotate-45')} />
      </button>
    </header>
  )
}
