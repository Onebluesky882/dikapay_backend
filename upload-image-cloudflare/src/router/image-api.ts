import { Hono } from "hono";
type Bindings = {
  dikapay_bucket: R2Bucket;
};

const uploadImage = new Hono<{ Bindings: Bindings }>();

uploadImage.post("/", async (c) => {
  const formData = await c.req.formData();

  const file = formData.get("file") as File;
  if (!file) {
    return c.json({ success: false, message: "No file uploaded" }, 400);
  }
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const ext = file.name.split(".").pop();

  const key = `${year}/${month}/${day}/${crypto.randomUUID()}.${ext}`;

  await c.env.dikapay_bucket.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  });

  return c.json({
    success: true,
    path: key,
  });
});

export { uploadImage };
