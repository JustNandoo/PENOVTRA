import { createHash, randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { db, users } from '../db/index.js'
import { findUserByEmail, normEmail, startSession } from '../lib/auth.js'

/* "Lanjut dengan Google": OAuth 2.0 authorization code flow with PKCE.
   GET /api/auth/google            → redirect to Google's consent screen
   GET /api/auth/google/callback   → exchange the code, sign in (or create) the user, back to the site
   Needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from Google Cloud Console (OAuth client, type "Web application")
   with this redirect URI registered: {APP_URL}/api/auth/google/callback */

const COOKIE = 'pnv_oauth'
const b64url = buf => buf.toString('base64url')
const appUrl = c => process.env.APP_URL || new URL(c.req.url).origin
const redirectUri = c => `${appUrl(c)}/api/auth/google/callback`

// only same-site paths, never "//evil.com" or absolute URLs
const safeNext = n => (typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') ? n : '/marketplace/profil')
const back = (c, path, error) => c.redirect(`${appUrl(c)}${path}${error ? `${path.includes('?') ? '&' : '?'}error=${error}` : ''}`)

export const google = new Hono()

google.get('/', c => {
  const next = safeNext(c.req.query('next'))
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return back(c, `/marketplace/masuk?next=${encodeURIComponent(next)}`, 'google_off')
  }
  const state = b64url(randomBytes(24))
  const verifier = b64url(randomBytes(48))
  const challenge = b64url(createHash('sha256').update(verifier).digest())
  setCookie(c, COOKIE, JSON.stringify({ state, verifier, next }), {
    httpOnly: true,
    secure: appUrl(c).startsWith('https'),
    sameSite: 'Lax', // must survive the top-level redirect back from Google
    path: '/api/auth/google',
    maxAge: 600,
  })
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri(c),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    prompt: 'select_account',
  })
  return c.redirect(url.toString())
})

google.get('/callback', async c => {
  let saved
  try { saved = JSON.parse(getCookie(c, COOKIE) || 'null') } catch { saved = null }
  deleteCookie(c, COOKIE, { path: '/api/auth/google' })
  const next = safeNext(saved?.next)
  const fail = reason => {
    console.warn('Google sign-in gagal:', reason)
    return back(c, `/marketplace/masuk?next=${encodeURIComponent(next)}`, 'google')
  }

  const { code, state, error } = c.req.query()
  if (error) return back(c, `/marketplace/masuk?next=${encodeURIComponent(next)}`, error === 'access_denied' ? 'google_cancel' : 'google')
  if (!saved || !code || state !== saved.state) return fail('state tidak cocok')

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri(c),
      grant_type: 'authorization_code',
      code_verifier: saved.verifier,
    }),
  })
  if (!tokenRes.ok) return fail(`token ${tokenRes.status} ${await tokenRes.text()}`)
  const { access_token } = await tokenRes.json()

  // fetched straight from Google over TLS with our own access token, so it can be trusted
  const infoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: `Bearer ${access_token}` } })
  if (!infoRes.ok) return fail(`userinfo ${infoRes.status}`)
  const g = await infoRes.json()
  if (!g.sub || !g.email || !g.email_verified) return fail('email Google belum terverifikasi')

  const [byGoogle] = await db.select().from(users).where(eq(users.googleId, g.sub)).limit(1)
  let user = byGoogle ?? await findUserByEmail(g.email)
  if (user) {
    // link Google to an existing email account; Google has verified the inbox
    if (!user.googleId || !user.emailVerifiedAt) {
      ;[user] = await db.update(users).set({ googleId: g.sub, emailVerifiedAt: user.emailVerifiedAt ?? new Date() })
        .where(eq(users.id, user.id)).returning()
    }
  } else {
    ;[user] = await db.insert(users).values({
      name: g.name || g.email.split('@')[0],
      email: normEmail(g.email),
      googleId: g.sub,
      emailVerifiedAt: new Date(),
    }).returning()
  }

  await startSession(c, user.id)
  return back(c, next)
})
