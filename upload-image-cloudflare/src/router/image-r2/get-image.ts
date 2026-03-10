import { Hono } from "hono";
import { db } from "../../db";
import images from "../../db/schema";
import { and, eq } from "drizzle-orm";

type Bindings = {
  dikapay_bucket: R2Bucket;
  PUBLIC_IMAGE: string;
};

type ImageType = "profile" | "shop" | "slip";

type Body = {
  userId: string;
  imageType: ImageType;
};

const getImage = new Hono<{ Bindings: Bindings }>();

getImage.post("/", async (c) => {
  try {
    const body = await c.req.json<Body>();
    const { userId, imageType } = body;

    if (!userId) {
      return c.json({ success: false, message: "userId required" }, 400);
    }

    const image = await db
      .select()
      .from(images)
      .where(and(eq(images.userId, userId), eq(images.imageType, imageType)));

    if (image.length === 0) {
      return c.json({
        success: true,
        imageUrl: [],
      });
    }

    const baseUrl = c.env.PUBLIC_IMAGE;

    const imageUrl = image.map((img) => {
      return `${baseUrl}/${img.imageKey}`;
    });

    console.log("imageUrl:", imageUrl);

    return c.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("GET IMAGE ERROR:", error);

    return c.json(
      {
        success: false,
        message: "server error",
      },
      500,
    );
  }
});

export default getImage;
