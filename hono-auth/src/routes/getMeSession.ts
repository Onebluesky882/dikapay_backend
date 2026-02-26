import { Hono } from "hono";
import { auth } from "..";

const getMeSession = new Hono();

getMeSession.get("/", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json(session.user);
});

export default getMeSession;
