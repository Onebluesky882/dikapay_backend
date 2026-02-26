import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db";
import { schema } from "./db/schema";
import otpRoute from "./routes/otpEmail";
import { getSession } from "better-auth/api";
import getMeSession from "./routes/getMeSession";
const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// wansing882@gmail.com
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: ["localhost://3000", "dikapayapp://", "http://192.168.1.47"],
  emailAndPassword: {
    enabled: true,
  },
});

app.route("/api/auth", otpRoute);
app.route("/api/me", getMeSession);

app.all("/api/auth/*", async (c) => {
  return auth.handler(c.req.raw);
});

const port = Number(process.env.PORT ?? 3000);

export default {
  port,
  fetch: app.fetch,
};
