import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { csrf } from 'hono/csrf'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { sql } from './db/index.js'
import { loadUser } from './lib/auth.js'
import { addressRoutes } from './routes/addresses.js'
import { auth } from './routes/auth.js'
import { orderRoutes } from './routes/orders.js'
import { catalog } from './routes/products.js'

/* One Hono app for every /api route. Runs on Node locally (server/dev.js)
   and as a Vercel Function in production (api/index.js). */
export const app = new Hono().basePath('/api')

if (!process.env.VERCEL) app.use('*', logger())
app.use('*', secureHeaders())
app.use('*', bodyLimit({ maxSize: 64 * 1024, onError: c => c.json({ error: 'Data terlalu besar.' }, 413) }))
// Rejects cross-site form posts. JSON calls from our own pages pass.
app.use('*', csrf({ origin: (origin, c) => !origin || origin === new URL(c.req.url).origin || origin === process.env.APP_URL }))
app.use('*', async (c, next) => { await next(); c.header('Cache-Control', 'no-store') })
app.use('*', loadUser)

app.get('/health', async c => {
  await sql`select 1`
  return c.json({ ok: true })
})

app.route('/auth', auth)
app.route('/', catalog)
app.route('/addresses', addressRoutes)
app.route('/orders', orderRoutes)

app.notFound(c => c.json({ error: 'Endpoint tidak ditemukan.' }, 404))

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message, ...(err.cause && typeof err.cause === 'object' ? err.cause : {}) }, err.status)
  }
  console.error(err)
  return c.json({ error: 'Terjadi kesalahan di server. Coba lagi sebentar.' }, 500)
})
