import { Hono } from "hono";
import { Bindings } from "../../index";
import { db } from "../../db";
import { images } from "../../db/schema";

const uploadImage = new Hono<{ Bindings: Bindings }>();

uploadImage.post("/", async (c) => {
  const formData = await c.req.formData();
  const userId = formData.get("userId") as string;
  const file = formData.get("file") as File;
  if (!file) {
    return c.json({ success: false, message: "No file uploaded" }, 400);
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const uuid = crypto.randomUUID();

  // todo record image
  const key = `${year}/${month}/${day}/${uuid}.jpg`;

  await c.env.dikapay_bucket.put(key, file.stream(), {
    httpMetadata: {
      contentType: "image/jpeg",
    },
  });
  const ext = file.name.split(".").pop()?.toLowerCase();

  const mimeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };

  const mimeType = mimeMap[ext || ""] || "application/octet-stream";
  console.log("mimeType :", mimeType);
  await db.insert(images).values({
    imageKey: uuid,
    mimeType: mimeType,
    name: uuid,
    userId: userId,
  });
  return c.json({
    success: true,
    path: key,
  });
});

export { uploadImage };
