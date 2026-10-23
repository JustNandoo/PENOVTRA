import { Brand } from './Nav'
import { Icon, Reveal } from './ui'

const CONTACTS = [
  { href: 'mailto:penovtraid@gmail.com', label: 'Email', value: 'penovtraid@gmail.com',
    icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></> },
  { href: 'https://instagram.com/penovtra', label: 'Instagram', value: '@penovtra', external: true,
    icon: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" /></> },
  { href: 'https://www.penovtra.com', label: 'Website', value: 'www.penovtra.com',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></> },
]

export function Closing() {
  return (
    <section id="kontak" className={
      'relative isolate overflow-hidden py-[clamp(110px,14vw,200px)] text-center bg-paper ' +
      'before:absolute before:inset-0 before:-z-1 before:bg-[radial-gradient(ellipse_at_center,rgba(244,245,239,.8),rgba(244,245,239,.94)_70%),linear-gradient(180deg,var(--color-paper),transparent_20%,transparent_80%,var(--color-paper))]'
    }>
      <img src="/assets/greenhouse.webp" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-2 opacity-50 saturate-60" />
      <div className="wrap flex flex-col items-center">
        <img src="/assets/logotype.png" alt="PE-NOVTRA" width="1000" height="118" loading="lazy" className="w-[min(360px,70vw)] h-auto mb-10" />
        <Reveal as="h2" className="text-[clamp(40px,6vw,88px)] tracking-[-.045em] text-forest max-w-[14ch] mb-[22px]">
          Siap menanam <em>tanpa cemas?</em>
        </Reveal>
        <Reveal as="p" className="text-ink-2 max-w-[46ch] text-[17px]">
          Ceritakan ruang dan tanaman yang ingin kamu budidayakan. Tim kami bantu pilih konfigurasi yang pas.
        </Reveal>
        <div className="flex flex-wrap justify-center gap-3 mt-11">
          {CONTACTS.map(c => (
            <a key={c.label} href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener' } : {})}
              className="group flex items-center gap-3.5 text-left py-3.5 pr-[22px] pl-4 rounded-full bg-white/85 border border-line transition-[background-color,color,translate] duration-[.3s,.3s,.4s] ease-soft hover:bg-forest hover:-translate-y-[3px] max-xs:w-full">
              <Icon viewBox="0 0 24 24" className="w-[38px] h-[38px] p-[9px] rounded-full bg-lime-soft stroke-forest [stroke-width:1.7] transition-colors duration-300 group-hover:bg-lime">
                {c.icon}
              </Icon>
              <span className="grid font-medium text-forest text-[15px] leading-[1.3] group-hover:text-white">
                <small className="text-[11px] tracking-[.12em] uppercase text-muted font-medium group-hover:text-white">{c.label}</small>
                {c.value}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-forest-3 text-white/70 py-11">
      <div className="wrap grid grid-cols-[1fr_auto] gap-x-10 gap-y-7 items-center max-tab:grid-cols-1">
        <div>
          <Brand className="text-white" />
          <p className="text-[13px] mt-1.5">Agriculture Technology for Productive Farming.</p>
        </div>
        <div className="flex items-center gap-4 px-5 py-2.5 rounded-full bg-white max-tab:justify-self-start">
          <small className="text-muted text-[11px] tracking-[.08em]">Bagian dari program</small>
          <img src="/assets/pertamuda.png" alt="Pertamuda Seed and Scale" width="691" height="123" loading="lazy" className="h-[30px] w-auto" />
        </div>
        <p className="col-span-full text-[12px] border-t border-forest-line pt-[22px]">© 2026 PE-NOVTRA. Hak cipta dilindungi.</p>
      </div>
    </footer>
  )
}
