import { useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { cx } from '../../components/ui'
import { DotField } from '../components/DotField'
import { Em, Field, Option, PillTabs, Steps, Title, inputCls } from '../components/atoms'
import { useStore } from '../store'
import { ADDRESSES, BANKS, INSURANCE, PAY_METHODS, SHIPPING, WALLETS, rupiah } from '../data'

function Block({ n, title, aside, delay = 0, children }) {
  return (
    <section className="bg-white border border-ink/12 rounded-[32px] p-8 max-xs:p-5 max-xs:rounded-[26px] animate-fade-up" style={{ animationDelay: `${.15 + delay}s` }}>
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="flex items-center gap-3.5 text-[22px] font-semibold tracking-[-.02em] text-forest max-xs:text-[19px]">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-full border border-line text-[12px] font-semibold tabular-nums">{n}</span>{title}
        </h2>
        {aside && <span className="text-[13.5px] text-muted">{aside}</span>}
      </header>
      {children}
    </section>
  )
}

/* Small square chooser used for banks and wallets */
const Chip = ({ on, onClick, children }) => (
  <button type="button" aria-pressed={on} onClick={onClick}
    className={cx('h-14 rounded-[18px] text-[15px] font-semibold tracking-[-.01em] transition-[border-color,background-color,color] duration-300',
      on ? 'border-[1.5px] border-forest bg-[#f1f6e6] text-forest' : 'border border-ink/12 bg-white text-ink-2 hover:border-ink/25')}>{children}</button>
)

export default function Checkout() {
  const { items, subtotal, placeOrder } = useStore()
  const nav = useNavigate()
  const [addr, setAddr] = useState('rumah')
  const [ship, setShip] = useState(items.some(i => i.product.cat === 'unit') ? 'cargo' : 'reg')
  const [ins, setIns] = useState(true)
  const [pay, setPay] = useState('va')
  const [bank, setBank] = useState('BCA')
  const [wallet, setWallet] = useState('GoPay')
  const placed = useRef(false)

  if (items.length === 0 && !placed.current) return <Navigate to="/marketplace/keranjang" replace />

  const shipping = SHIPPING.find(s => s.id === ship)
  const total = subtotal + shipping.price + (ins ? INSURANCE : 0)
  const payName = pay === 'va' ? `VA ${bank}` : pay === 'wallet' ? wallet : pay === 'qris' ? 'QRIS' : 'Kartu'

  const submit = e => {
    e.preventDefault()
    placed.current = true
    const id = placeOrder({ shipping: ship, insured: ins, pay: payName, address: ADDRESSES.find(a => a.id === addr) })
    nav(`/marketplace/pembayaran/${id}`)
  }

  return (
    <main className="bg-paper">
      <form onSubmit={submit} className="wrap pt-32 pb-[clamp(90px,10vw,120px)]">
        <div className="animate-fade-up"><Steps current={2} /></div>
        <div className="flex flex-wrap items-end justify-between gap-5 mb-10 animate-fade-up" style={{ animationDelay: '.1s' }}>
          <Title as="h1" className="text-[clamp(40px,5vw,64px)] tracking-[-.04em]">Checkout, <Em>hampir selesai.</Em></Title>
          <Link to="/marketplace/keranjang" className="text-[15px] font-medium">← Ubah keranjang</Link>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-5 items-start max-lap:grid-cols-1">
          <div className="grid gap-5">
            <Block n="01" title="Alamat pengiriman">
              <div className="grid grid-cols-3 gap-3.5 max-tab:grid-cols-1">
                {ADDRESSES.map(a => (
                  <Option key={a.id} on={addr === a.id} onClick={() => setAddr(a.id)} className="rounded-[24px] p-5 h-full">
                    <b className="block mb-1 text-[15px] font-semibold text-forest">{a.label}</b>
                    <span className="block text-[13.5px] leading-[1.55] text-ink-2">{a.name}</span>
                    <span className="block text-[13.5px] leading-[1.55] text-muted line-clamp-3">{a.addr}</span>
                    <span className="block mt-1.5 text-[13px] text-muted">{a.phone}</span>
                  </Option>
                ))}
                <button type="button" className="grid place-items-center content-center gap-2 min-h-[150px] rounded-[24px] border border-dashed border-ink/25 text-[14px] font-medium text-forest hover:border-forest hover:bg-white transition-colors max-tab:min-h-[64px] max-tab:flex max-tab:justify-center">
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-mist text-[20px] leading-none">+</span>Tambah alamat
                </button>
              </div>
            </Block>

            <Block n="02" title="Pengiriman" aside="Dikirim dari Surabaya" delay={.08}>
              <div className="grid gap-3">
                {SHIPPING.map(s => (
                  <Option key={s.id} on={ship === s.id} onClick={() => setShip(s.id)} className="rounded-[22px] px-5 py-[18px]">
                    <span className="flex items-start justify-between gap-4">
                      <span className="min-w-0">
                        <b className="block text-[15px] font-semibold text-forest">{s.name} · <span className="font-normal">{s.eta}</span></b>
                        <span className="block mt-0.5 text-[13.5px] text-muted">{s.note}</span>
                      </span>
                      <span className="flex-none text-[15px] font-semibold text-forest">{rupiah(s.price)}</span>
                    </span>
                  </Option>
                ))}
              </div>
              <label className="flex items-center gap-3 mt-[18px] px-5 py-4 rounded-[20px] bg-mist text-[14.5px] text-ink-2 cursor-pointer">
                <input type="checkbox" checked={ins} onChange={e => setIns(e.target.checked)} className="flex-none w-[18px] h-[18px] accent-forest" />
                <span className="flex-1">Asuransi pengiriman <span className="text-muted">· disarankan untuk unit</span></span>
                <b className="font-semibold text-forest">{rupiah(INSURANCE)}</b>
              </label>
              <div className="mt-[18px]"><Field label="Catatan untuk kurir"><input placeholder="Contoh: titip ke satpam" className={inputCls} /></Field></div>
            </Block>

            <Block n="03" title="Metode pembayaran" delay={.16}>
              <PillTabs items={PAY_METHODS} value={pay} onChange={setPay} label="Metode pembayaran" className="mb-6 max-xs:grid max-xs:grid-cols-2 max-xs:rounded-[22px] max-xs:w-full" itemClass="px-5 py-2.5 max-xs:px-2" />
              <div key={pay} className="animate-swap">
                {pay === 'va' && (<>
                  <p className="mb-4 text-[14px] text-muted">Pilih bank. Nomor virtual account muncul setelah pesanan dibuat.</p>
                  <div className="grid grid-cols-5 gap-2.5 max-tab:grid-cols-3">{BANKS.map(b => <Chip key={b} on={bank === b} onClick={() => setBank(b)}>{b}</Chip>)}</div>
                </>)}
                {pay === 'qris' && (
                  <div className="grid grid-cols-[120px_1fr] gap-5 items-center px-5 py-5 rounded-[22px] bg-mist max-xs:grid-cols-1">
                    <span aria-hidden="true" className="grid grid-cols-5 gap-1 w-[120px] h-[120px] p-3 rounded-[18px] bg-white">
                      {Array.from({ length: 25 }, (_, i) => <span key={i} className={cx('rounded-[3px]', [0, 1, 3, 5, 6, 8, 11, 12, 14, 16, 18, 19, 20, 21, 23, 24].includes(i) ? 'bg-forest' : 'bg-transparent')} />)}
                    </span>
                    <p className="text-[14px] leading-[1.6] text-ink-2">Kode QRIS muncul setelah pesanan dibuat. Bayar dengan aplikasi bank atau e-wallet apa pun yang mendukung QRIS.</p>
                  </div>
                )}
                {pay === 'wallet' && (
                  <div className="grid grid-cols-4 gap-2.5 max-xs:grid-cols-2">{WALLETS.map(w => <Chip key={w} on={wallet === w} onClick={() => setWallet(w)}>{w}</Chip>)}</div>
                )}
                {pay === 'card' && (
                  <div className="grid grid-cols-[1fr_140px_120px] gap-3 max-tab:grid-cols-2">
                    <div className="max-tab:col-span-2"><Field label="Nomor kartu"><input inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" className={inputCls} /></Field></div>
                    <Field label="Berlaku"><input autoComplete="cc-exp" placeholder="BB/TT" className={inputCls} /></Field>
                    <Field label="CVV"><input inputMode="numeric" autoComplete="cc-csc" placeholder="•••" className={inputCls} /></Field>
                  </div>
                )}
              </div>
            </Block>
          </div>

          <aside aria-label="Ringkasan pesanan" className="relative isolate overflow-hidden rounded-[32px] bg-forest text-white p-8 lap:sticky lap:top-28 max-xs:p-6 animate-fade-up" style={{ animationDelay: '.3s' }}>
            <DotField density={.3} />
            <p className="mb-5 text-[12px] font-medium tracking-[.18em] uppercase text-white/60">Pesananmu</p>
            <ul className="grid gap-3.5 pb-5 border-b border-white/14">
              {items.map(it => (
                <li key={it.key} className="grid grid-cols-[52px_minmax(0,1fr)_auto] gap-3 items-center">
                  <span className="relative w-[52px] h-[52px] rounded-[16px] bg-white/8 overflow-hidden"><img src={it.product.img} alt="" className="absolute inset-[12%] w-[76%] h-[76%] object-contain" /></span>
                  <span className="min-w-0 text-[14px] leading-[1.35]"><span className="block truncate">{it.product.short}</span><span className="text-white/60">{it.variantName ? `${it.variantName} · ` : ''}× {it.qty}</span></span>
                  <span className="text-[14px]">{rupiah(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 pt-5 text-[14.5px]">
              <dt className="text-white/72">Subtotal</dt><dd className="text-right">{rupiah(subtotal)}</dd>
              <dt className="text-white/72">Ongkir · {shipping.name}</dt><dd key={ship} className="text-right animate-swap">{rupiah(shipping.price)}</dd>
              {ins && <><dt className="text-white/72 animate-swap">Asuransi</dt><dd className="text-right animate-swap">{rupiah(INSURANCE)}</dd></>}
            </dl>
            <div className="mt-[22px] pt-5 border-t border-white/14">
              <span className="block text-[13px] text-white/65">Total bayar · {payName}</span>
              <span key={total} className="block text-[44px] font-semibold tracking-[-.045em] text-lime-2 animate-swap max-xs:text-[36px]">{rupiah(total)}</span>
            </div>
            <button type="submit" className="group mt-[22px] w-full h-14 flex items-center justify-center gap-2.5 rounded-full bg-lime text-forest-3 text-[15.5px] font-medium hover:bg-lime-2 transition-colors">
              Bayar {rupiah(total)} <span aria-hidden="true" className="transition-[translate] duration-400 group-hover:translate-x-1">→</span>
            </button>
            <p className="mt-3.5 text-[13px] leading-[1.55] text-white/65">Dengan membayar, kamu menyetujui Syarat &amp; Ketentuan. Pembayaran diproses lewat payment gateway resmi.</p>
          </aside>
        </div>
      </form>
    </main>
  )
}
