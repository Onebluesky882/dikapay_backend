import { Hono } from "hono";
import { generateImageKey } from "../../utils/generateImageKey";
import { createUploadUrl } from "../../utils/aws-s3";

type Bindings = {
  dikapay_bucket: R2Bucket;
};

const uploadImage = new Hono<{ Bindings: Bindings }>();

uploadImage.post("/", async (c) => {
  try {
    const { userId, imageType, mimeType } = await c.req.json();
    const key = generateImageKey(imageType, mimeType);
    const uploadUrl = await createUploadUrl(key);
    // generate key

    // todo create new api

    return c.json({
      success: true,
      userId: userId,
      path: uploadUrl,
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
