import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

const configuredName = process.env.DATABASE_FILENAME?.trim() || "farm2market.db";
if (path.basename(configuredName) !== configuredName) {
  throw new Error("DATABASE_FILENAME must be a file name, not a path");
}
export const databaseFile = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "data",
  configuredName
);

const globalForDb = globalThis as typeof globalThis & {
  __farm2MarketLibsql?: Client;
  __farm2MarketDb?: LibSQLDatabase<typeof schema>;
};

export function getSqliteClient(): Client {
  if (!globalForDb.__farm2MarketLibsql) {
    fs.mkdirSync(path.dirname(databaseFile), { recursive: true });
    globalForDb.__farm2MarketLibsql = createClient({
      url: pathToFileURL(databaseFile).href,
    });
  }

  return globalForDb.__farm2MarketLibsql;
}

export function getDatabase(): LibSQLDatabase<typeof schema> {
  if (!globalForDb.__farm2MarketDb) {
    globalForDb.__farm2MarketDb = drizzle(getSqliteClient(), { schema });
  }

  return globalForDb.__farm2MarketDb;
}

// Keep database initialization lazy. Next.js imports route modules while building;
// opening SQLite only when a query actually runs prevents build processes from hanging.
export const db = new Proxy({} as LibSQLDatabase<typeof schema>, {
  get(_target, property) {
    const database = getDatabase() as unknown as Record<PropertyKey, unknown>;
    const value = database[property];
    return typeof value === "function" ? value.bind(database) : value;
  },
});
