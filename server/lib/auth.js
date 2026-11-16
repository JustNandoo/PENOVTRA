import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto'
import { and, desc, eq, gt, isNull, sql } from 'drizzle-orm'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { db, emailCodes, sessions, users } from '../db/index.js'
import { fail } from './http.js'

const COOKIE = 'pnv_session'
const SESSION_DAYS = 30
const CODE_MINUTES = 5
const RESET_MINUTES = 30
const RESEND_SECONDS = 60
const MAX_ATTEMPTS = 5

export const sha256 = s => createHash('sha256').update(s).digest('hex')
const sameHash = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))
export const normEmail = e => e.trim().toLowerCase()

/* ── Sessions ─────────────────────────────────────────────────────────── */

export async function startSession(c, userId) {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5)
  await db.insert(sessions).values({ id: sha256(token), userId, expiresAt })
  setCookie(c, COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || !!process.env.VERCEL,
    sameSite: 'Lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function endSession(c) {
  const token = getCookie(c, COOKIE)
  if (token) await db.delete(sessions).where(eq(sessions.id, sha256(token)))
  deleteCookie(c, COOKIE, { path: '/' })
}

/* Attaches c.var.user (or null) on every request */
export const loadUser = createMiddleware(async (c, next) => {
  c.set('user', null)
  const token = getCookie(c, COOKIE)
  if (token) {
    const [row] = await db.select({ user: users, expiresAt: sessions.expiresAt })
      .from(sessions).innerJoin(users, eq(users.id, sessions.userId))
      .where(eq(sessions.id, sha256(token))).limit(1)
    if (row && row.expiresAt > new Date()) c.set('user', row.user)
    else if (row) await endSession(c)
  }
  await next()
})

export const requireUser = createMiddleware(async (c, next) => {
  if (!c.get('user')) fail(401, 'Silakan masuk dulu.')
  await next()
})

/* What the browser gets to see about a user */
export function publicUser(u) {
  if (!u) return null
  return {
    id: u.id,
    name: u.name,
    first: u.name.split(' ')[0],
    email: u.email,
    phone: u.phone,
    verified: !!u.emailVerifiedAt,
    since: u.createdAt.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
  }
}

export const findUserByEmail = async email =>
  (await db.select().from(users).where(eq(sql`lower(${users.email})`, normEmail(email))).limit(1))[0]

/* ── Email codes ──────────────────────────────────────────────────────── */

async function throttle(email, purpose) {
  const [last] = await db.select({ createdAt: emailCodes.createdAt }).from(emailCodes)
    .where(and(eq(sql`lower(${emailCodes.email})`, email), eq(emailCodes.purpose, purpose)))
    .orderBy(desc(emailCodes.createdAt)).limit(1)
  const wait = last ? RESEND_SECONDS - Math.floor((Date.now() - last.createdAt) / 1000) : 0
  if (wait > 0) fail(429, `Tunggu ${wait} detik sebelum meminta kode lagi.`, { retryAfter: wait })
}

/* Creates a 6-digit code (verify / login), retiring earlier ones. Returns the plain code. */
export async function issueCode(rawEmail, purpose) {
  const email = normEmail(rawEmail)
  await throttle(email, purpose)
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  await db.update(emailCodes).set({ usedAt: new Date() })
    .where(and(eq(sql`lower(${emailCodes.email})`, email), eq(emailCodes.purpose, purpose), isNull(emailCodes.usedAt)))
  await db.insert(emailCodes).values({
    email, purpose, codeHash: sha256(`${email}:${code}`), expiresAt: new Date(Date.now() + CODE_MINUTES * 6e4),
  })
  return code
}

/* Checks a code; wrong guesses count toward a limit, success burns the code */
export async function consumeCode(rawEmail, purpose, code) {
  const email = normEmail(rawEmail)
  const [row] = await db.select().from(emailCodes)
    .where(and(eq(sql`lower(${emailCodes.email})`, email), eq(emailCodes.purpose, purpose),
      isNull(emailCodes.usedAt), gt(emailCodes.expiresAt, new Date())))
    .orderBy(desc(emailCodes.createdAt)).limit(1)
  if (!row) fail(400, 'Kode sudah tidak berlaku. Minta kode baru.')
  if (row.attempts >= MAX_ATTEMPTS) fail(429, 'Terlalu banyak percobaan. Minta kode baru.')
  if (!sameHash(row.codeHash, sha256(`${email}:${code}`))) {
    await db.update(emailCodes).set({ attempts: row.attempts + 1 }).where(eq(emailCodes.id, row.id))
    const left = MAX_ATTEMPTS - row.attempts - 1
    fail(400, left > 0 ? `Kode salah. Sisa ${left} percobaan.` : 'Kode salah. Minta kode baru.')
  }
  await db.update(emailCodes).set({ usedAt: new Date() }).where(eq(emailCodes.id, row.id))
}

/* Reset links carry a long random token instead of a short code */
export async function issueResetToken(rawEmail) {
  const email = normEmail(rawEmail)
  await throttle(email, 'reset')
  const token = randomBytes(32).toString('base64url')
  await db.update(emailCodes).set({ usedAt: new Date() })
    .where(and(eq(sql`lower(${emailCodes.email})`, email), eq(emailCodes.purpose, 'reset'), isNull(emailCodes.usedAt)))
  await db.insert(emailCodes).values({
    email, purpose: 'reset', codeHash: sha256(token), expiresAt: new Date(Date.now() + RESET_MINUTES * 6e4),
  })
  return token
}

export async function consumeResetToken(token) {
  const [row] = await db.select().from(emailCodes)
    .where(and(eq(emailCodes.codeHash, sha256(token)), eq(emailCodes.purpose, 'reset'),
      isNull(emailCodes.usedAt), gt(emailCodes.expiresAt, new Date())))
    .limit(1)
  if (!row) fail(400, 'Tautan sudah tidak berlaku. Minta tautan baru.')
  await db.update(emailCodes).set({ usedAt: new Date() }).where(eq(emailCodes.id, row.id))
  return row.email
}
