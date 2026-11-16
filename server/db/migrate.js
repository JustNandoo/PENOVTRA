import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db, sql } from './index.js'

// Applies every pending SQL file in server/db/migrations, in order.
await migrate(db, { migrationsFolder: new URL('./migrations', import.meta.url).pathname })
console.log('Migrasi selesai.')
await sql.end()
