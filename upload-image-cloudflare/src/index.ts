import { Hono } from "hono";
import { uploadImage } from "./router/image-api";

const app = new Hono<{ Bindings: CloudflareBindings }>();
app.route("/api/upload", uploadImage);
app.get("/message", (c) => {
  return c.text(" server running port : http://localhost:3000");
});

export default app;
