import { config } from "dotenv";
config({ path: ".env.local" });

import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and set DATABASE_URL " +
      "before running drizzle-kit commands (db:push, db:studio, etc.)."
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: connectionString,
  },
  verbose: true,
  strict: false,
});


// import "dotenv/config";
// import { defineConfig } from "drizzle-kit";

// const connectionString = process.env.DATABASE_URL?.trim();

// if (!connectionString) {
//   throw new Error(
//     "DATABASE_URL is not set. Copy .env.example to .env.local and set DATABASE_URL " +
//       "before running drizzle-kit commands (db:push, db:studio, etc.)."
//   );
// }

// export default defineConfig({
//   dialect: "postgresql",
//   schema: "./src/db/schema.ts",
//   out: "./drizzle",
//   dbCredentials: {
//     url: connectionString,
//   },
//   verbose: true,
//   strict: false,
// });
