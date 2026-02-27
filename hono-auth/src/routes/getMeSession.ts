import { Hono } from "hono";
import { auth } from "..";
import { internalPassword } from "../utils/crypto";

const getMeSession = new Hono();

getMeSession.post("/", async (c) => {
  const { email } = await c.req.json();
  if (!email) {
    return c.json({ error: "Email is required" }, 400);
  }
  // todo if login more than 3 will limit and adjust time
  const session = await auth.api.signInEmail({
    body: {
      email,
      password: internalPassword(email),
    },
  });
  return c.json(session);
});

export default getMeSession;
