import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { db, sessions, users } from '../db/index.js'
import {
  consumeCode, consumeResetToken, endSession, findUserByEmail, issueCode, issueResetToken,
  normEmail, publicUser, requireUser, startSession,
} from '../lib/auth.js'
import { body, fail } from '../lib/http.js'
import { codeMail, resetMail, sendMail } from '../lib/mail.js'
import { google } from './google.js'

const email = z.email('Format email tidak valid.').max(254)
const password = z.string().min(8, 'Kata sandi minimal 8 karakter.').max(72, 'Kata sandi maksimal 72 karakter.')
const code = z.string().regex(/^\d{6}$/, 'Kode harus 6 digit angka.')

// Compared against when the email doesn't exist, so timing doesn't reveal which emails are registered
const DUMMY_HASH = bcrypt.hashSync('pe-novtra-dummy-password', 10)

async function sendCode(to, purpose) {
  const c = await issueCode(to, purpose)
  await sendMail({ to, ...codeMail(c, purpose) })
}

export const auth = new Hono()

auth.get('/me', c => c.json({ user: publicUser(c.get('user')) }))

auth.post('/register', async c => {
  const d = await body(c, z.object({
    name: z.string().trim().min(2, 'Nama minimal 2 huruf.').max(80),
    email,
    phone: z.string().trim().regex(/^\+?[0-9 -]{8,18}$/, 'Nomor WhatsApp tidak valid.').optional(),
    password,
  }))
  const existing = await findUserByEmail(d.email)
  if (existing?.emailVerifiedAt) fail(409, 'Email ini sudah terdaftar. Silakan masuk.')

  // issue the code first so a too-soon retry (429) changes nothing
  const verifyCode = await issueCode(d.email, 'verify')
  const passwordHash = await bcrypt.hash(d.password, 10)
  if (existing) {
    // signed up before but never verified: take the newest details
    await db.update(users).set({ name: d.name, phone: d.phone ?? existing.phone, passwordHash }).where(eq(users.id, existing.id))
  } else {
    await db.insert(users).values({ name: d.name, email: normEmail(d.email), phone: d.phone ?? null, passwordHash })
  }
  await sendMail({ to: normEmail(d.email), ...codeMail(verifyCode, 'verify') })
  return c.json({ email: normEmail(d.email), next: 'verify' }, 201)
})

/* Verifies a 6-digit code. purpose "verify" finishes sign-up, "login" is passwordless sign-in. */
auth.post('/verify', async c => {
  const d = await body(c, z.object({ email, code, purpose: z.enum(['verify', 'login']).default('verify') }))
  const user = await findUserByEmail(d.email)
  if (!user) fail(400, 'Kode sudah tidak berlaku. Minta kode baru.')
  await consumeCode(d.email, d.purpose, d.code)
  if (!user.emailVerifiedAt) {
    // a login code also proves the inbox belongs to them
    user.emailVerifiedAt = new Date()
    await db.update(users).set({ emailVerifiedAt: user.emailVerifiedAt }).where(eq(users.id, user.id))
  }
  await startSession(c, user.id)
  return c.json({ user: publicUser(user) })
})

auth.post('/login', async c => {
  const d = await body(c, z.object({ email, password: z.string().min(1, 'Isi kata sandi.') }))
  const user = await findUserByEmail(d.email)
  const ok = await bcrypt.compare(d.password, user?.passwordHash ?? DUMMY_HASH)
  if (!user || !user.passwordHash || !ok) fail(401, 'Email atau kata sandi salah.')
  if (!user.emailVerifiedAt) {
    await sendCode(user.email, 'verify').catch(e => { if (e.status !== 429) throw e })
    fail(403, 'Email belum diverifikasi. Cek email untuk kode verifikasi.', { needsVerification: true, email: user.email })
  }
  await startSession(c, user.id)
  return c.json({ user: publicUser(user) })
})

/* Passwordless: email a login code. Same reply whether or not the account exists. */
auth.post('/otp', async c => {
  const d = await body(c, z.object({ email }))
  const user = await findUserByEmail(d.email)
  if (user) await sendCode(user.email, 'login')
  return c.json({ ok: true, email: normEmail(d.email) })
})

auth.post('/resend', async c => {
  const d = await body(c, z.object({ email, purpose: z.enum(['verify', 'login']) }))
  const user = await findUserByEmail(d.email)
  if (user && !(d.purpose === 'verify' && user.emailVerifiedAt)) await sendCode(user.email, d.purpose)
  return c.json({ ok: true })
})

auth.post('/forgot', async c => {
  const d = await body(c, z.object({ email }))
  const user = await findUserByEmail(d.email)
  if (user) {
    const token = await issueResetToken(user.email)
    const link = `${process.env.APP_URL || 'http://localhost:5174'}/marketplace/lupa-sandi?token=${token}`
    await sendMail({ to: user.email, ...resetMail(link) })
  }
  return c.json({ ok: true })
})

auth.post('/reset', async c => {
  const d = await body(c, z.object({ token: z.string().min(20), password }))
  const mail = await consumeResetToken(d.token)
  const user = await findUserByEmail(mail)
  if (!user) fail(400, 'Tautan sudah tidak berlaku. Minta tautan baru.')
  await db.update(users).set({
    passwordHash: await bcrypt.hash(d.password, 10),
    emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
  }).where(eq(users.id, user.id))
  await db.delete(sessions).where(eq(sessions.userId, user.id)) // sign out other devices
  await startSession(c, user.id)
  return c.json({ user: publicUser(user) })
})

auth.post('/logout', async c => {
  await endSession(c)
  return c.json({ ok: true })
})

auth.route('/google', google)

/* Update name / WhatsApp number */
auth.patch('/me', requireUser, async c => {
  const d = await body(c, z.object({
    name: z.string().trim().min(2, 'Nama minimal 2 huruf.').max(80).optional(),
    phone: z.string().trim().regex(/^\+?[0-9 -]{8,18}$/, 'Nomor WhatsApp tidak valid.').or(z.literal('')).optional(),
  }))
  const patch = { ...(d.name && { name: d.name }), ...(d.phone !== undefined && { phone: d.phone || null }) }
  const [user] = Object.keys(patch).length
    ? await db.update(users).set(patch).where(eq(users.id, c.get('user').id)).returning()
    : [c.get('user')]
  return c.json({ user: publicUser(user) })
})
