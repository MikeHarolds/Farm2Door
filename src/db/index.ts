import { config } from "dotenv";
config({ path: ".env.local" });

import { Pool } from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and set DATABASE_URL to your " +
      "Postgres connection string (e.g. a free Neon database — see README.md for setup steps)."
  );
}

// Neon (and most hosted Postgres providers) require TLS. Local Postgres usually does not.
// We detect this from the connection string rather than requiring a separate flag:
//   - an explicit `sslmode=require` (or similar) in the URL always wins
//   - a `neon.tech` / `neon.build` host implies TLS is required even if not spelled out
//   - otherwise (e.g. a plain localhost URL) we leave SSL off for local Postgres
const needsSsl =
  /sslmode=require|sslmode=verify/i.test(connectionString) ||
  /neon\.(tech|build)/i.test(connectionString);

const globalForDb = globalThis as typeof globalThis & {
  __farm2MarketPool?: Pool;
  __farm2MarketDb?: NodePgDatabase<typeof schema>;
};

function getPool(): Pool {
  if (!globalForDb.__farm2MarketPool) {
    globalForDb.__farm2MarketPool = new Pool({
      connectionString,
      // rejectUnauthorized: false avoids TLS chain-verification failures some
      // environments (e.g. WSL) hit against Neon's certificate chain.
      ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    });
  }
  return globalForDb.__farm2MarketPool;
}

export const db: NodePgDatabase<typeof schema> =
  globalForDb.__farm2MarketDb ??
  (globalForDb.__farm2MarketDb = drizzle(getPool(), { schema }));

/** Runs a trivial query to confirm the database connection is alive. Used by /api/health. */
export async function pingDatabase(): Promise<void> {
  const pool = getPool();
  await pool.query("select 1");
}
