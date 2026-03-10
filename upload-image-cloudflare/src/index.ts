import { Hono } from "hono";
import { uploadImage } from "./router/image-r2/upload-image";
import getImage from "./router/image-r2/get-image";

export type Bindings = {
  dikapay_images_db: D1Database;
  dikapay_bucket: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();
app.route("/api/upload", uploadImage);
app.route("/api/image", getImage);
app.get("/message", (c) => {
  return c.text(" server running port : http://localhost:3000");
});

export default app;
