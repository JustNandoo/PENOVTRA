import { H2, Reveal, SecHead } from './ui'

const GOALS = [
  { img: 'sdg-2', alt: 'SDG 2 Zero Hunger', t: 'Zero Hunger', d: 'Akses pangan segar dan ketahanan pangan keluarga lewat budidaya skala rumah tangga.' },
  { img: 'sdg-11', alt: 'SDG 11 Sustainable Cities and Communities', t: 'Sustainable Cities & Communities', d: 'Solusi budidaya yang cocok untuk rumah, apartemen, dan komunitas perkotaan.' },
  { img: 'sdg-12', alt: 'SDG 12 Responsible Consumption and Production', t: 'Responsible Consumption & Production', d: 'Budidaya terkontrol yang mengurangi pemborosan input dan memaksimalkan hasil.' },
]

export default function Sdg() {
  return (
    <section className="pt-[clamp(60px,8vw,110px)] pb-[clamp(90px,10vw,150px)]">
      <div className="wrap grid grid-cols-[1fr_1.1fr] gap-[clamp(40px,6vw,100px)] items-start max-tab:grid-cols-1">
        <div className="sticky top-[120px] max-tab:static">
          <SecHead idx="05">Dampak berkelanjutan</SecHead>
          <H2 className="mb-[22px] max-w-[15ch]">Pangan segar dari rumah, untuk kota yang <em>lebih hijau.</em></H2>
          <Reveal as="p" className="max-w-[42ch] text-muted">
            PE-NOVTRA membantu masyarakat menanam pangan secara mandiri dengan cara yang lebih praktis, hemat, dan berkelanjutan.
          </Reveal>
        </div>
        <div className="grid">
          {GOALS.map(g => (
            <Reveal as="article" key={g.img} className="group grid grid-cols-[104px_1fr] gap-[26px] items-center py-[26px] border-t border-line last:border-b max-xs:grid-cols-[72px_1fr] max-xs:gap-[18px]">
              <img src={`/assets/${g.img}.webp`} alt={g.alt} loading="lazy"
                className="w-[104px] h-[104px] rounded-[10px] transition-[rotate,scale] duration-600 ease-soft group-hover:-rotate-4 group-hover:scale-104 max-xs:w-[72px] max-xs:h-[72px]" />
              <div>
                <h3 className="text-[21px] text-forest mb-1.5">{g.t}</h3>
                <p className="text-muted text-[14.5px]">{g.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
