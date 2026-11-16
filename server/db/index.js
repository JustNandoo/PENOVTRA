import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema.js'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diisi. Salin .env.example ke .env.')

// Reuse one pool per process. On Vercel each function instance keeps its own,
// so the pool stays small; `prepare: false` keeps it compatible with poolers (Neon/PgBouncer).
const g = globalThis
export const sql = g.__pnvSql ??= postgres(process.env.DATABASE_URL, {
  max: process.env.VERCEL ? 1 : 10,
  prepare: false,
  onnotice: () => {},
})

export const db = drizzle(sql, { schema })
export * from './schema.js'
