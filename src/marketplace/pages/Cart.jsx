import { Link, useNavigate } from 'react-router-dom'
import { Reveal, cx } from '../../components/ui'
import { DotField } from '../components/DotField'
import { Em, Kicker, PageLoader, ProductImg, QtyStepper, SecHead, Steps, Title } from '../components/atoms'
import { useStore } from '../store'
import { rupiah } from '../data'

export default function Cart() {
  const { items, cart, count, subtotal, setQty, removeLine, addToCart, user, catalog, catalogState, categoryLabel } = useStore()
  const nav = useNavigate()
  const suggest = catalog.filter(p => ['grow-kit-refill', 'benih-premium', 'kipas-sirkulasi'].includes(p.slug))
  // cart lines are joined with the catalog; wait for it instead of flashing "empty"
  if (catalogState === 'loading' && cart.length) return <PageLoader />
  const go = () => nav(user ? '/marketplace/checkout' : '/marketplace/masuk?next=/marketplace/checkout')

  return (
    <main className="bg-paper">
      <section className="wrap pt-32 pb-[clamp(80px,9vw,100px)]">
        <div className="animate-fade-up"><Steps current={0} /></div>
        <div className="flex flex-wrap items-end justify-between gap-5 mb-10 animate-fade-up" style={{ animationDelay: '.1s' }}>
          <Title as="h1" className="text-[clamp(40px,5vw,64px)] tracking-[-.04em]">Keranjang <Em>kamu.</Em></Title>
          <Link to="/marketplace" className="text-[15px] font-medium">← Lanjut belanja</Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-ink/12 rounded-[32px] px-6 py-[72px] text-center animate-rise">
            <h2 className="mb-2.5 text-[34px] font-semibold tracking-[-.03em] text-forest">Masih <Em>kosong.</Em></h2>
            <p className="mb-6 text-[15px] text-muted">Mulai dari unit PE-NOVTRA atau isi ulang grow kit.</p>
            <Link to="/marketplace" className="inline-flex px-[26px] py-[15px] rounded-full bg-forest text-white text-[15px] font-medium hover:bg-forest-2">Ke Marketplace →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)_400px] gap-5 items-start max-lap:grid-cols-1">
            <section aria-label="Isi keranjang" className="bg-white border border-ink/12 rounded-[32px] px-8 py-2 max-xs:px-4 animate-fade-up" style={{ animationDelay: '.2s' }}>
              {items.map((it, i) => (
                <article key={it.key} className={cx('grid grid-cols-[128px_minmax(0,1fr)_auto] gap-6 items-center py-6 max-xs:grid-cols-[88px_minmax(0,1fr)] max-xs:gap-3.5 max-xs:py-4', i < items.length - 1 && 'border-b border-ink/10')}>
                  <Link to={`/marketplace/produk/${it.slug}`} className="group block w-32 rounded-[24px] overflow-hidden max-xs:w-[88px] max-xs:rounded-[18px]">
                    <ProductImg src={it.product.img} inset="12%" className="aspect-square bg-[radial-gradient(closest-side,#e6f2c8,#f4f5ef_95%)]" />
                  </Link>
                  <div className="grid gap-1.5 min-w-0">
                    <Kicker>{categoryLabel(it.product.cat)}</Kicker>
                    <Link to={`/marketplace/produk/${it.slug}`} className="line-clamp-2 text-[18px] font-semibold leading-[1.3] tracking-[-.01em] text-forest hover:underline underline-offset-4 max-xs:text-[15px]">{it.product.name}</Link>
                    <span className="text-[13.5px] text-muted">{it.variantName ? `${it.variantName} · ` : ''}{rupiah(it.price)} / item</span>
                    <div className="flex items-center gap-4 mt-2 max-xs:gap-3">
                      <QtyStepper size="sm" value={it.qty} onChange={q => setQty(it.key, q)} label={it.product.short} />
                      <button type="button" onClick={() => removeLine(it.key)} className="py-2 text-[13.5px] text-muted underline underline-offset-4 hover:text-[#b42318]">Hapus</button>
                    </div>
                    <span className="hidden max-xs:block mt-1 text-[17px] font-bold tracking-[-.03em] text-forest">{rupiah(it.price * it.qty)}</span>
                  </div>
                  <span key={it.qty} className="text-[22px] font-bold tracking-[-.03em] text-forest whitespace-nowrap animate-swap max-xs:hidden">{rupiah(it.price * it.qty)}</span>
                </article>
              ))}
            </section>

            <aside aria-label="Ringkasan belanja" className="relative isolate overflow-hidden rounded-[32px] bg-forest text-white p-8 lap:sticky lap:top-28 max-xs:p-6 animate-fade-up" style={{ animationDelay: '.3s' }}>
              <DotField density={.3} />
              <p className="mb-[22px] text-[12px] font-medium tracking-[.18em] uppercase text-white/60">Ringkasan</p>
              <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 text-[14.5px]">
                <dt className="text-white/72">Subtotal ({count} produk)</dt><dd className="text-right">{rupiah(subtotal)}</dd>
                <dt className="text-white/72">Ongkos kirim</dt><dd className="text-right text-white/72">di checkout</dd>
              </dl>
              <form onSubmit={e => e.preventDefault()} className="flex items-center gap-2 h-[50px] mt-[22px] pl-[18px] pr-1.5 rounded-full bg-white/8 border border-white/18 focus-within:border-lime-2 transition-colors">
                <label htmlFor="promo" className="sr-only">Kode promo</label>
                <input id="promo" placeholder="Kode promo" className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[14px] text-white placeholder:text-white/50" />
                <button type="submit" className="h-[38px] px-4 rounded-full border border-white/30 text-[13.5px] hover:bg-white/10">Pakai</button>
              </form>
              <div className="mt-[26px] pt-5 border-t border-white/14">
                <span className="block text-[13px] text-white/65">Total sementara</span>
                <span key={subtotal} className="block text-[44px] font-semibold tracking-[-.045em] text-lime-2 animate-swap max-xs:text-[36px]">{rupiah(subtotal)}</span>
              </div>
              <button type="button" onClick={go} className="group mt-[22px] w-full h-14 flex items-center justify-center gap-2.5 rounded-full bg-lime text-forest-3 text-[15.5px] font-medium hover:bg-lime-2 transition-colors">
                Lanjut ke checkout <span aria-hidden="true" className="transition-[translate] duration-400 group-hover:translate-x-1">→</span>
              </button>
              {!user && <p className="mt-3.5 text-[13px] leading-[1.55] text-white/65">Kamu akan diminta masuk atau daftar dulu. Isi keranjang tetap tersimpan.</p>}
            </aside>
          </div>
        )}
      </section>

      <section className="bg-mist pt-[clamp(80px,9vw,96px)] pb-[clamp(90px,10vw,110px)]">
        <div className="wrap">
          <SecHead idx="+">Sebelum checkout</SecHead>
          <Reveal><Title className="mb-10 text-[clamp(32px,4vw,52px)]">Jangan sampai <Em>kehabisan nutrisi.</Em></Title></Reveal>
          <div className="grid grid-cols-3 gap-[18px] max-lap:grid-cols-1">
            {suggest.map((s, i) => (
              <Reveal key={s.slug} delay={i * .08} className="group grid grid-cols-[120px_minmax(0,1fr)] gap-[18px] items-center p-[18px] bg-white border border-ink/12 rounded-[28px] max-xs:grid-cols-[96px_minmax(0,1fr)]">
                <Link to={`/marketplace/produk/${s.slug}`} className="block rounded-[20px] overflow-hidden">
                  <ProductImg src={s.img} inset="12%" className="aspect-square bg-[radial-gradient(closest-side,#e6f2c8,#f4f5ef_95%)]" />
                </Link>
                <span className="grid gap-1">
                  <Link to={`/marketplace/produk/${s.slug}`} className="text-[15.5px] font-semibold leading-[1.3] text-forest hover:underline underline-offset-4">{s.name}</Link>
                  <span className="flex items-center justify-between gap-2.5 mt-1.5">
                    <span className="text-[18px] font-bold tracking-[-.03em] text-forest">{rupiah(s.price)}</span>
                    <button type="button" onClick={() => addToCart(s.slug)} aria-label={`Tambah ${s.name}`} className="w-[42px] h-[42px] rounded-full bg-lime text-forest-3 text-[22px] leading-none hover:bg-lime-2 active:scale-90 transition-[background-color,scale]">+</button>
                  </span>
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
