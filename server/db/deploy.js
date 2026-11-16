/* Runs during the Vercel build (npm run vercel-build): applies pending
   migrations and upserts the starting catalog, so the database is always in
   step with the deployed code. Existing stock, users and orders are kept.
   Skipped when no DATABASE_URL is set, so a build never fails for that alone. */

if (!process.env.DATABASE_URL) {
  console.log('[db] DATABASE_URL kosong, migrasi dilewati.')
  process.exit(0)
}

const { migrate } = await import('drizzle-orm/postgres-js/migrator')
const { db } = await import('./index.js')

await migrate(db, { migrationsFolder: new URL('./migrations', import.meta.url).pathname })
console.log('[db] Migrasi selesai.')

// seed.js reuses the same connection and closes it when done
await import('./seed.js')
