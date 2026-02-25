import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db";
import { schema } from "./db/schema";
import { Resend } from "resend";
import { generateOTP, hashOTP } from "./utils/generateOtp";
import { emailOtps } from "./db/email-otps";
import { and, eq } from "drizzle-orm";
import { error } from "better-auth/api";
import otpRoute from "./routes/otpEmail";
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

const resend = new Resend(process.env.RESEND_API);
if (!resend) {
  console.log("no resend key");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: ["localhost://3000", "dikapayapp://"],
  emailAndPassword: {
    enabled: true,
  },
});

app.route("/api/auth", otpRoute);

app.all("/api/auth/*", async (c) => {
  return auth.handler(c.req.raw);
});

const port = Number(process.env.PORT ?? 3000);

export default {
  port,
  fetch: app.fetch,
};
