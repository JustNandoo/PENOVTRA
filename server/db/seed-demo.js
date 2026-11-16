import bcrypt from 'bcryptjs'
import { eq, sql as dsql } from 'drizzle-orm'
import { addresses, db, sql, users } from './index.js'

/* Demo account for trying the marketplace locally (npm run db:seed:demo).
   Safe to run again: the password is reset and the address is only added once.
   Never run this against the production database: the password below is public. */

export const DEMO = {
  name: 'Gilang Ramadhan',
  email: 'gilang@penovtra.test',
  password: 'Gilang2026!',
  phone: '+62 812 7700 1122',
}

const url = process.env.DATABASE_URL || ''
if (process.env.VERCEL || process.env.NODE_ENV === 'production' || !/localhost|127\.0\.0\.1/.test(url)) {
  console.error('Akun demo hanya untuk database lokal. Dibatalkan.')
  process.exit(1)
}

const passwordHash = await bcrypt.hash(DEMO.password, 10)
const [existing] = await db.select().from(users).where(eq(dsql`lower(${users.email})`, DEMO.email)).limit(1)

const user = existing
  ? (await db.update(users).set({ name: DEMO.name, phone: DEMO.phone, passwordHash, emailVerifiedAt: existing.emailVerifiedAt ?? new Date() })
      .where(eq(users.id, existing.id)).returning())[0]
  : (await db.insert(users).values({ name: DEMO.name, email: DEMO.email, phone: DEMO.phone, passwordHash, emailVerifiedAt: new Date() }).returning())[0]

const [hasAddress] = await db.select({ id: addresses.id }).from(addresses).where(eq(addresses.userId, user.id)).limit(1)
if (!hasAddress) {
  await db.insert(addresses).values({
    userId: user.id,
    label: 'Rumah',
    recipient: DEMO.name,
    phone: DEMO.phone,
    line: 'Jl. Keputih Tegal No. 21, Keputih, Sukolilo',
    city: 'Surabaya',
    province: 'Jawa Timur',
    postalCode: '60111',
    isDefault: true,
  })
}

console.log(`Akun demo siap: ${DEMO.name} <${DEMO.email}> (kata sandi ada di server/db/seed-demo.js)`)
await sql.end()
