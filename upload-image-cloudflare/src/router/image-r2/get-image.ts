import { Hono } from "hono";
type Bindings = {
  dikapay_bucket: R2Bucket;
};

const getImage = new Hono<{ Bindings: Bindings }>();

getImage.get("/", async (c) => {
  const uuid = crypto.randomUUID();
  // todo record image
  //   const key = `${year}/${month}/${day}/${uuid}.jpg`;

  //   await c.env.dikapay_bucket.put(key, file.stream(), {
  //     httpMetadata: {
  //       contentType: "image/jpeg",
  //     },
  //   });

  //   return c.json({
  //     success: true,
  //     path: key,
  //   });
});

export { getImage as uploadImage };
