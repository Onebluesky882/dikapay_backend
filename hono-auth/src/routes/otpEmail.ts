import { Hono } from "hono";
import { db } from "../db";
import { schema } from "../db/schema";
import { Resend } from "resend";
import { generateOTP, hashOTP } from "../utils/generateOtp";
import { eq } from "drizzle-orm";
import { auth } from "..";
import { internalPassword } from "../utils/crypto";

const otpRoute = new Hono();
if (!process.env.RESEND_API) {
  throw new Error("RESEND_API is missing");
}
if (!process.env.OTP_SECRET) {
  throw new Error("OTP_SECRET is missing");
}
const resend = new Resend(process.env.RESEND_API);
// ================= SEND OTP =================
otpRoute.post("/send-otp", async (c) => {
  const { email } = await c.req.json();

  const otp = generateOTP();
  const otpHash = hashOTP(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await db.delete(schema.emailOtps).where(eq(schema.emailOtps.email, email));

  await db.insert(schema.emailOtps).values({
    email,
    otpHash,
    expiresAt,
  });

  await resend.emails.create({
    from: "DikaPay <no-reply@dikapay.app>",
    to: email,
    subject: "Your OTP Code",
    html: `<h2>Your OTP is ${otp}</h2>
           <p>This code expires in 3 minutes.</p>`,
  });
  return c.json({ success: true });
});

// ================= VERIFY OTP =================

otpRoute.post("/verify-otp", async (c) => {
  const { email, otp } = await c.req.json();
  let session;
  const records = await db
    .select()
    .from(schema.emailOtps)
    .where(eq(schema.emailOtps.email, email))
    .limit(1);

  if (records.length === 0) {
    return c.json({ error: "OTP not found" }, 400);
  }

  const record = records[0];

  if (record.expiresAt < new Date()) {
    return c.json({ error: "OTP expired" }, 400);
  }

  if (record.attempts >= 3) {
    return c.json({ error: "Too many attempts" }, 400);
  }

  const otpHash = hashOTP(otp);

  if (otpHash !== record.otpHash) {
    await db
      .update(schema.emailOtps)
      .set({ attempts: record.attempts + 1 })
      .where(eq(schema.emailOtps.email, email));

    return c.json({ error: "Invalid OTP" }, 400);
  }

  await db.delete(schema.emailOtps).where(eq(schema.emailOtps.email, email));
  try {
    session = await auth.api.signUpEmail({
      body: {
        name: email,
        email,
        password: internalPassword(email),
      },
    });
  } catch (err) {
    session = await auth.api.signInEmail({
      body: {
        email,
        password: internalPassword(email),
      },
    });
    console.log("session", session);
  }

  return c.json({ token: session.token, user: session.user });
});

// todo if login more than 3 will limit and adjust time 
export default otpRoute;
