import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: `./data/${process.env.DATABASE_FILENAME || "farm2market.db"}`,
  },
  verbose: true,
  strict: false,
});
