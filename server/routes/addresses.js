import { and, asc, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { addresses, db } from '../db/index.js'
import { requireUser } from '../lib/auth.js'
import { body, fail } from '../lib/http.js'

const fields = {
  label: z.string().trim().min(1, 'Isi label alamat, misalnya Rumah.').max(30),
  recipient: z.string().trim().min(2, 'Isi nama penerima.').max(80),
  phone: z.string().trim().regex(/^\+?[0-9 -]{8,18}$/, 'Nomor telepon tidak valid.'),
  line: z.string().trim().min(5, 'Isi alamat lengkap.').max(200),
  city: z.string().trim().min(2, 'Isi kota atau kabupaten.').max(60),
  province: z.string().trim().min(2, 'Isi provinsi.').max(60),
  postalCode: z.string().trim().regex(/^\d{5}$/, 'Kode pos harus 5 digit.'),
  isDefault: z.boolean().optional(),
}
const createSchema = z.object(fields)
const updateSchema = z.object(fields).partial()

export const shapeAddress = a => ({
  id: a.id, label: a.label, recipient: a.recipient, phone: a.phone, line: a.line,
  city: a.city, province: a.province, postalCode: a.postalCode, isDefault: a.isDefault,
})

const mine = (c, id) => and(eq(addresses.id, id), eq(addresses.userId, c.get('user').id))
const idParam = c => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id)) fail(404, 'Alamat tidak ditemukan.')
  return id
}

export const addressRoutes = new Hono()
addressRoutes.use('*', requireUser)

addressRoutes.get('/', async c => {
  const rows = await db.select().from(addresses).where(eq(addresses.userId, c.get('user').id))
    .orderBy(desc(addresses.isDefault), asc(addresses.createdAt))
  return c.json({ addresses: rows.map(shapeAddress) })
})

addressRoutes.post('/', async c => {
  const d = await body(c, createSchema)
  const userId = c.get('user').id
  const row = await db.transaction(async tx => {
    const has = await tx.select({ id: addresses.id }).from(addresses).where(eq(addresses.userId, userId)).limit(1)
    const isDefault = d.isDefault || has.length === 0 // the first address becomes the default
    if (isDefault) await tx.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId))
    return (await tx.insert(addresses).values({ ...d, userId, isDefault }).returning())[0]
  })
  return c.json({ address: shapeAddress(row) }, 201)
})

addressRoutes.patch('/:id', async c => {
  const id = idParam(c)
  const d = await body(c, updateSchema)
  const row = await db.transaction(async tx => {
    if (d.isDefault) await tx.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, c.get('user').id))
    return (await tx.update(addresses).set(d).where(mine(c, id)).returning())[0]
  })
  if (!row) fail(404, 'Alamat tidak ditemukan.')
  return c.json({ address: shapeAddress(row) })
})

addressRoutes.delete('/:id', async c => {
  const id = idParam(c)
  const userId = c.get('user').id
  await db.transaction(async tx => {
    const [gone] = await tx.delete(addresses).where(mine(c, id)).returning()
    if (!gone) fail(404, 'Alamat tidak ditemukan.')
    if (gone.isDefault) { // hand the default to the oldest remaining address
      const [next] = await tx.select({ id: addresses.id }).from(addresses).where(eq(addresses.userId, userId))
        .orderBy(asc(addresses.createdAt)).limit(1)
      if (next) await tx.update(addresses).set({ isDefault: true }).where(eq(addresses.id, next.id))
    }
  })
  return c.json({ ok: true })
})
