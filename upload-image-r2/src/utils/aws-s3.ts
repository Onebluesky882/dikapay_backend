import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { Bindings } from "..";

export function createS3(env: Bindings) {
  if (!env.R2_ACCESS_KEY) {
    throw new Error("no access key");
  }

  return new S3Client({
    region: "auto",
    endpoint:
      "https://c40a6cc1eb575a43f79e9b4d9cc6a88d.r2.cloudflarestorage.com",
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY,
      secretAccessKey: env.R2_SECRET_KEY,
    },
  });
}

export async function createUploadUrl(key: string, env: Bindings) {
  const command = new PutObjectCommand({
    Bucket: "dikapay",
    Key: key,
  });
  const s3 = createS3(env);
  return await getSignedUrl(s3, command, {
    expiresIn: 600,
  });
}
