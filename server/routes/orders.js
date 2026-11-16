import { randomInt } from 'node:crypto'
import { and, asc, desc, eq, gte, inArray, lt, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { BANKS, INSURANCE, SHIPPING, WALLETS } from '../../src/marketplace/data.js'
import { addresses, db, orderEvents, orderItems, orders, products, productVariants } from '../db/index.js'
import { requireUser } from '../lib/auth.js'
import { body, fail } from '../lib/http.js'
import { shapeAddress } from './addresses.js'

const PAY_HOURS = 24
const VA_PREFIX = { BCA: '8077', Mandiri: '8908', BNI: '8241', BRI: '1288', Permata: '8625' }

const checkoutSchema = z.object({
  items: z.array(z.object({
    slug: z.string().min(1),
    variant: z.string().optional(),
    qty: z.number().int().min(1, 'Jumlah minimal 1.').max(10, 'Jumlah maksimal 10 per produk.'),
  })).min(1, 'Keranjang masih kosong.').max(30),
  addressId: z.number().int(),
  shipping: z.enum(SHIPPING.map(s => s.id)),
  insured: z.boolean().default(false),
  payMethod: z.enum(['va', 'qris', 'wallet', 'card']),
  payChannel: z.string().optional(),
  note: z.string().trim().max(200).optional(),
})

const newOrderId = () => {
  const d = new Date()
  const ym = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}`
  return `PNV-${ym}-${String(randomInt(0, 10_000)).padStart(4, '0')}`
}

/* "3–5 hari" from today → "20–22 Nov 2026" */
function etaFrom(shippingId, from = new Date()) {
  const s = SHIPPING.find(x => x.id === shippingId)
  const nums = (s?.eta.match(/\d+/g) ?? ['0']).map(Number)
  const fmt = (n, withMonth) => new Date(from.getTime() + n * 864e5)
    .toLocaleDateString('id-ID', withMonth ? { day: 'numeric', month: 'short', year: 'numeric' } : { day: 'numeric' })
  const [a, b = a] = nums
  return a === b ? `estimasi tiba ${fmt(a, true)}` : `estimasi tiba ${fmt(a)}–${fmt(b, true)}`
}

export function shapeOrder(o) {
  const ship = SHIPPING.find(s => s.id === o.shippingMethod)
  return {
    id: o.id,
    status: o.status,
    createdAt: o.createdAt,
    subtotal: o.subtotal,
    shipping: { id: o.shippingMethod, name: ship?.name ?? o.shippingMethod, eta: ship?.eta ?? '', cost: o.shippingCost },
    insurance: o.insurance,
    total: o.total,
    pay: {
      method: o.payMethod,
      channel: o.payChannel,
      label: o.payMethod === 'va' ? `VA ${o.payChannel}` : o.payMethod === 'qris' ? 'QRIS' : o.payMethod === 'wallet' ? o.payChannel : 'Kartu',
      code: o.payCode,
      expiresAt: o.payExpiresAt,
      paidAt: o.paidAt,
    },
    address: o.address,
    note: o.courierNote,
    resi: o.resi,
    eta: o.eta,
    items: (o.items ?? []).map(i => ({
      name: i.name, variantName: i.variantName, img: i.img, price: i.price, qty: i.qty,
      slug: i.product?.slug, cat: i.product?.categoryId,
    })),
    events: (o.events ?? []).map(e => ({ title: e.title, place: e.place, at: e.at })),
  }
}

const withDetails = {
  items: { orderBy: asc(orderItems.id), with: { product: { columns: { slug: true, categoryId: true } } } },
  events: { orderBy: desc(orderEvents.at) },
}

/* Unpaid orders past their deadline are cancelled and their stock released */
async function expireStale(userId) {
  const stale = await db.select({ id: orders.id }).from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.status, 'bayar'), lt(orders.payExpiresAt, new Date())))
  for (const { id } of stale) await cancelOrder(id, 'Dibatalkan otomatis', 'Batas waktu pembayaran habis')
}

async function cancelOrder(id, title, place) {
  await db.transaction(async tx => {
    const [o] = await tx.update(orders).set({ status: 'batal', eta: 'pesanan dibatalkan' })
      .where(and(eq(orders.id, id), eq(orders.status, 'bayar'))).returning({ id: orders.id })
    if (!o) return // already paid or cancelled by another request
    const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, id))
    for (const it of items) {
      await tx.update(products).set({ stock: sql`${products.stock} + ${it.qty}` }).where(eq(products.id, it.productId))
    }
    await tx.insert(orderEvents).values({ orderId: id, title, place })
  })
}

export const orderRoutes = new Hono()
orderRoutes.use('*', requireUser)

orderRoutes.get('/', async c => {
  const user = c.get('user')
  await expireStale(user.id)
  const rows = await db.query.orders.findMany({
    where: eq(orders.userId, user.id), orderBy: desc(orders.createdAt), with: withDetails,
  })
  return c.json({ orders: rows.map(shapeOrder) })
})

orderRoutes.get('/:id', async c => {
  const user = c.get('user')
  await expireStale(user.id)
  const o = await db.query.orders.findFirst({
    where: and(eq(orders.id, c.req.param('id')), eq(orders.userId, user.id)), with: withDetails,
  })
  if (!o) fail(404, 'Pesanan tidak ditemukan.')
  return c.json({ order: shapeOrder(o) })
})

/* Checkout. Prices, shipping and totals are always computed here, never trusted from the browser. */
orderRoutes.post('/', async c => {
  const user = c.get('user')
  const d = await body(c, checkoutSchema)

  if (d.payMethod === 'va' && !BANKS.includes(d.payChannel)) fail(400, 'Pilih bank untuk virtual account.')
  if (d.payMethod === 'wallet' && !WALLETS.includes(d.payChannel)) fail(400, 'Pilih e-wallet.')
  const payChannel = d.payMethod === 'va' || d.payMethod === 'wallet' ? d.payChannel : null

  const [addr] = await db.select().from(addresses).where(and(eq(addresses.id, d.addressId), eq(addresses.userId, user.id))).limit(1)
  if (!addr) fail(400, 'Alamat pengiriman tidak ditemukan.')

  // merge duplicate lines of the same product + variant
  const lines = new Map()
  for (const it of d.items) {
    const k = `${it.slug}:${it.variant ?? ''}`
    lines.set(k, { ...it, qty: (lines.get(k)?.qty ?? 0) + it.qty })
  }
  const slugs = [...new Set(d.items.map(i => i.slug))]
  const found = await db.query.products.findMany({ where: inArray(products.slug, slugs), with: { variants: true } })
  const bySlug = new Map(found.map(p => [p.slug, p]))

  const priced = [...lines.values()].map(l => {
    const p = bySlug.get(l.slug)
    if (!p || !p.active) fail(400, `Produk "${l.slug}" tidak tersedia.`)
    if (p.comingSoon) fail(400, `${p.short} belum bisa dibeli.`)
    let variant = null
    if (p.variants.length) {
      variant = p.variants.find(v => v.code === (l.variant ?? 'std'))
      if (!variant) fail(400, `Pilih paket untuk ${p.short}.`)
    }
    return { p, variant, qty: l.qty, price: variant?.price ?? p.price }
  })

  const subtotal = priced.reduce((a, l) => a + l.price * l.qty, 0)
  const ship = SHIPPING.find(s => s.id === d.shipping)
  const insurance = d.insured ? INSURANCE : 0
  const total = subtotal + ship.price + insurance
  const payCode = d.payMethod === 'va'
    ? `${VA_PREFIX[payChannel]}${String(randomInt(0, 1e6)).padStart(6, '0')}${String(randomInt(0, 1e6)).padStart(6, '0')}`
    : null

  const id = await db.transaction(async tx => {
    let orderId
    for (let i = 0; i < 6 && !orderId; i++) {
      const tryId = newOrderId()
      const [row] = await tx.insert(orders).values({
        id: tryId,
        userId: user.id,
        subtotal,
        shippingMethod: ship.id,
        shippingCost: ship.price,
        insurance,
        total,
        payMethod: d.payMethod,
        payChannel,
        payCode,
        payExpiresAt: new Date(Date.now() + PAY_HOURS * 36e5),
        address: shapeAddress(addr),
        courierNote: d.note || null,
        eta: 'menunggu pembayaran',
      }).onConflictDoNothing().returning({ id: orders.id })
      orderId = row?.id
    }
    if (!orderId) fail(503, 'Gagal membuat nomor pesanan. Coba lagi.')

    for (const l of priced) {
      // reserve stock; the WHERE makes this fail instead of going negative
      const [ok] = await tx.update(products).set({ stock: sql`${products.stock} - ${l.qty}` })
        .where(and(eq(products.id, l.p.id), gte(products.stock, l.qty))).returning({ id: products.id })
      if (!ok) fail(409, `Stok ${l.p.short} tidak cukup.`)
      await tx.insert(orderItems).values({
        orderId, productId: l.p.id, variantId: l.variant?.id ?? null,
        name: l.p.name, variantName: l.variant?.name ?? null, img: l.p.img, price: l.price, qty: l.qty,
      })
    }
    await tx.insert(orderEvents).values({ orderId, title: 'Pesanan dibuat', place: 'Checkout berhasil' })
    return orderId
  })

  const o = await db.query.orders.findFirst({ where: eq(orders.id, id), with: withDetails })
  return c.json({ order: shapeOrder(o) }, 201)
})

/* Local/demo only: marks an order as paid. Replaced by the payment gateway webhook later. */
orderRoutes.post('/:id/pay', async c => {
  if (process.env.PAYMENT_MOCK !== 'true') fail(403, 'Pembayaran tiruan dimatikan di server ini.')
  const user = c.get('user')
  const id = c.req.param('id')
  await expireStale(user.id)
  const now = new Date()
  const [o] = await db.select().from(orders).where(and(eq(orders.id, id), eq(orders.userId, user.id))).limit(1)
  if (!o) fail(404, 'Pesanan tidak ditemukan.')
  if (o.status === 'batal') fail(409, 'Pesanan sudah dibatalkan.')
  if (o.status === 'bayar') {
    await db.transaction(async tx => {
      await tx.update(orders).set({ status: 'proses', paidAt: now, eta: etaFrom(o.shippingMethod, now) }).where(eq(orders.id, id))
      const label = o.payMethod === 'va' ? `VA ${o.payChannel}` : o.payMethod === 'qris' ? 'QRIS' : o.payChannel ?? 'Kartu'
      await tx.insert(orderEvents).values({ orderId: id, title: 'Pembayaran diterima', place: label, at: now })
    })
  }
  const full = await db.query.orders.findFirst({ where: eq(orders.id, id), with: withDetails })
  return c.json({ order: shapeOrder(full) })
})

orderRoutes.post('/:id/cancel', async c => {
  const user = c.get('user')
  const id = c.req.param('id')
  const [o] = await db.select({ status: orders.status }).from(orders).where(and(eq(orders.id, id), eq(orders.userId, user.id))).limit(1)
  if (!o) fail(404, 'Pesanan tidak ditemukan.')
  if (o.status !== 'bayar') fail(409, 'Hanya pesanan yang belum dibayar yang bisa dibatalkan.')
  await cancelOrder(id, 'Dibatalkan', 'Dibatalkan oleh pembeli')
  const full = await db.query.orders.findFirst({ where: eq(orders.id, id), with: withDetails })
  return c.json({ order: shapeOrder(full) })
})
