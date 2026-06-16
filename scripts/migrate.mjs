// Applies pending Drizzle migrations, then exits. Run before the server starts.
// Skips cleanly when DATABASE_URL is unset (e.g. preview builds without a DB).
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const url = process.env.DATABASE_URL;
if (!url) {
  console.log('[migrate] DATABASE_URL not set — skipping migrations.');
  process.exit(0);
}

const sql = postgres(url, { max: 1 });
const db = drizzle(sql);
await migrate(db, { migrationsFolder: './src/lib/db/migrations' });
await sql.end();
console.log('[migrate] migrations applied.');
