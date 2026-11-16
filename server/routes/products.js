import { and, asc, desc, eq, gt, gte, ilike, inArray, lte, or, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { BANKS, INSURANCE, SHIPPING, WALLETS } from '../../src/marketplace/data.js'
import { categories, db, products, productVariants, productWaitlist } from '../db/index.js'
import { body, fail } from '../lib/http.js'

const PRICE = { lt100: [0, 99_999], mid: [100_000, 1_000_000], gt1jt: [1_000_001, null] }
const SORT = {
  relevan: [asc(products.sort)],
  murah: [asc(products.price)],
  mahal: [desc(products.price)],
  nama: [asc(products.name)],
}

export function shapeProduct(p, variants) {
  return {
    slug: p.slug,
    name: p.name,
    short: p.short,
    cat: p.categoryId,
    method: p.method,
    price: p.price,
    unit: p.unit,
    tag: p.tag,
    img: p.img,
    gallery: p.gallery,
    blurb: p.blurb,
    desc: p.description,
    // null instead of [] so the UI can tell "no specs" apart from "specs"
    specs: p.specs?.length ? p.specs : null,
    box: p.box?.length ? p.box : null,
    soon: p.comingSoon,
    inStock: !p.comingSoon && p.stock > 0,
    featured: p.featured,
    hasParts: p.hasParts,
    variants: variants?.length ? variants.map(v => ({ id: v.code, name: v.name, desc: v.description, price: v.price })) : null,
  }
}

export const catalog = new Hono()

catalog.get('/categories', async c => {
  const rows = await db.select({
    id: categories.id, label: categories.label, img: categories.img,
    // written out with aliases: drizzle drops table names inside sql``, which made "id" ambiguous
    count: sql`(select count(*)::int from products p where p.category_id = categories.id and p.active)`.mapWith(Number),
  }).from(categories).orderBy(asc(categories.sort))
  return c.json({ categories: rows })
})

/* GET /products?q=&cat=&method=soil|hydro&price=lt100|mid|gt1jt&ready=1&sort=relevan|murah|mahal|nama */
catalog.get('/products', async c => {
  const { q, cat, method, price, ready, sort } = c.req.query()
  const where = [eq(products.active, true)]
  if (q?.trim()) {
    const like = `%${q.trim().replace(/[%_\\]/g, '\\$&')}%`
    where.push(or(ilike(products.name, like), ilike(products.short, like), ilike(products.blurb, like)))
  }
  if (cat && cat !== 'all') where.push(eq(products.categoryId, cat))
  if (method === 'soil' || method === 'hydro') where.push(inArray(products.method, [method, 'both']))
  if (PRICE[price]) {
    const [min, max] = PRICE[price]
    where.push(gte(products.price, min), eq(products.comingSoon, false))
    if (max) where.push(lte(products.price, max))
  }
  if (ready === '1' || ready === 'true') where.push(eq(products.comingSoon, false), gt(products.stock, 0))

  const rows = await db.query.products.findMany({
    where: and(...where),
    orderBy: [sql`${products.comingSoon} asc`, ...(SORT[sort] ?? SORT.relevan)],
    with: { variants: { orderBy: asc(productVariants.sort) } },
  })
  return c.json({ products: rows.map(p => shapeProduct(p, p.variants)), total: rows.length })
})

catalog.get('/products/:slug', async c => {
  const p = await db.query.products.findFirst({
    where: and(eq(products.slug, c.req.param('slug')), eq(products.active, true)),
    with: { variants: { orderBy: asc(productVariants.sort) } },
  })
  if (!p) fail(404, 'Produk tidak ditemukan.')
  return c.json({ product: shapeProduct(p, p.variants) })
})

/* "Ingatkan saya" for coming-soon products */
catalog.post('/products/:slug/notify', async c => {
  const user = c.get('user')
  const d = user ? { email: user.email } : await body(c, z.object({ email: z.email('Format email tidak valid.') }))
  const [p] = await db.select({ id: products.id }).from(products).where(eq(products.slug, c.req.param('slug'))).limit(1)
  if (!p) fail(404, 'Produk tidak ditemukan.')
  await db.insert(productWaitlist).values({ productId: p.id, email: d.email.toLowerCase() }).onConflictDoNothing()
  return c.json({ ok: true })
})

/* Options the checkout page renders */
catalog.get('/checkout-options', c => c.json({
  shipping: SHIPPING,
  insurance: INSURANCE,
  payMethods: ['va', 'qris', 'wallet', 'card'],
  banks: BANKS,
  wallets: WALLETS,
}))
