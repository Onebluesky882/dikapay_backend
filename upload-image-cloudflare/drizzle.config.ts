import { defineConfig } from "drizzle-kit";

const DATABASE_URL =
  "postgresql://postgres:RPSrTrpWkjKXJgVshYWgNkTPKNrpoaTc@turntable.proxy.rlwy.net:20579/railway";
export default defineConfig({
  out: "./drizzle",
  schema: "@hono_auth/src/db/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
