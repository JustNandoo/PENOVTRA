import { H2, Reveal, SecHead, cx } from './ui'

const PEOPLE = [
  { img: 'team-rayan', role: 'Founder & CEO', name: 'Muhammad Ar Rayan',
    pts: ['5 tahun pengalaman di agrikultur', 'Top 3 Energy Founder, Pertamuda Seed & Scale', 'Global Finalist Fowler GSIC 2026'] },
  { img: 'team-gilang', role: 'Co-Founder & COO', name: 'Gilang Ramadhan S. Z. P.',
    pts: ['5 tahun di operasional & project management', 'Top 3 Energy Founder, Pertamuda Seed & Scale', '3rd Winner KMIPN'] },
  { img: 'team-gheri', role: 'Technology Advisor', name: 'Gheri Febri Ananda, S.Pd., M.Eng', alt: 'Gheri Febri Ananda', adv: true,
    pts: ['Penerima pendanaan riset BRIN 2026', '8+ publikasi di AI, computer vision, IoT', 'LPDP Scholarship Awardee'] },
  { img: 'team-yan', role: 'Agribusiness Advisor', name: 'Yan Aidar', adv: true,
    pts: ['20 tahun pengalaman agribisnis di Dumai', 'Pendiri P4S Laksamana Tani', 'Sertifikasi BNSP budidaya hidroponik'] },
]

export default function Team() {
  return (
    <section id="tim" className="wrap py-[clamp(90px,10vw,150px)]">
      <SecHead idx="07">Tim &amp; advisor</SecHead>
      <H2 className="max-w-[16ch] mb-[clamp(40px,5vw,70px)]">Orang-orang di balik <em>setiap panen.</em></H2>

      <div className="grid grid-cols-4 gap-5 max-lap:grid-cols-2 max-lap:gap-x-5 max-lap:gap-y-10 max-xs:gap-x-3.5 max-xs:gap-y-8">
        {PEOPLE.map((p, i) => (
          <Reveal as="article" key={p.name} delay={i * .08} className="group">
            <div className={cx(
              'relative aspect-[4/5] overflow-hidden mb-5 rounded-[28px_28px_28px_90px]',
              p.adv
                ? 'bg-[linear-gradient(160deg,var(--color-forest)_0%,var(--color-forest-3)_100%)]'
                : 'bg-[linear-gradient(160deg,var(--color-lime)_0%,#6c9c0f_100%)]',
              // leaf watermark
              "before:content-[''] before:absolute before:-right-[18%] before:-top-[10%] before:w-[70%] before:aspect-square before:opacity-18",
              'before:bg-[url(/assets/leaf.png)] before:bg-center before:bg-contain before:bg-no-repeat before:brightness-0 before:invert before:rotate-18'
            )}>
              <img src={`/assets/${p.img}.webp`} alt={p.alt ?? p.name} loading="lazy"
                className="absolute left-1/2 bottom-0 w-[94%] h-auto -translate-x-1/2 origin-bottom transition-[scale] duration-1000 ease-soft group-hover:scale-104" />
            </div>
            <span className="text-[11px] font-semibold tracking-[.14em] uppercase text-lime">{p.role}</span>
            <h3 className="text-[19px] text-forest mt-1.5 mb-3 max-xs:text-[16px]">{p.name}</h3>
            <ul className="grid gap-1.5 max-xs:hidden">
              {p.pts.map(t => (
                <li key={t} className="relative pl-3.5 text-[13.5px] text-muted before:absolute before:left-0 before:top-[.7em] before:w-[5px] before:h-px before:bg-muted">{t}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
