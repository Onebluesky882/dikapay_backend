import { Hono } from "hono";
import { generateImageKey } from "../../utils/format-date";
import { db } from "../../db";
import images from "../../db/schema";

type Bindings = {
  dikapay_bucket: R2Bucket;
};

const uploadImage = new Hono<{ Bindings: Bindings }>();

uploadImage.post("/", async (c) => {
  try {
    const formData = await c.req.formData();

    const userId = formData.get("userId") as string;
    const rawType = formData.get("imageType");
    const file = formData.get("file") as File;

    if (!userId) {
      return c.json({ success: false, message: "userId required" }, 400);
    }

    if (!file) {
      return c.json({ success: false, message: "file required" }, 400);
    }

    // validate imageType
    let imageType: "profile" | "shop" | "slip";

    switch (rawType) {
      case "profile":
      case "shop":
      case "slip":
        imageType = rawType;
        break;

      default:
        return c.json({ success: false, message: "invalid imageType" }, 400);
    }

    // generate key
    const { uuid, key } = generateImageKey(imageType);

    console.log({
      name: file.name,
      userId,
      imageKey: key,
      mimeType: file.type,
      imageType,
    });

    // upload to R2 (ใช้ file ตรง ๆ ไม่ใช้ stream)
    await c.env.dikapay_bucket.put(key, file, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    console.log("file:", file);
    console.log("file.type:", file.type);
    console.log("file.name:", file.name);
    // save metadata
    await db.insert(images).values({
      imageKey: key,
      mimeType: file.type,
      name: uuid,
      userId,
      imageType,
    });

    return c.json({
      success: true,
      path: key,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return c.json(
      {
        success: false,
        message: "upload failed",
      },
      500,
    );
  }
});

export { uploadImage };
