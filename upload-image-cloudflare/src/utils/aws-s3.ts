import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

if (!process.env.R2_ACCESS_KEY) {
  throw new Error("no access key");
}

export const s3 = new S3Client({
  region: "auto",
  endpoint: "https://c40a6cc1eb575a43f79e9b4d9cc6a88d.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

export async function createUploadUrl(key: string) {
  const command = new PutObjectCommand({
    Bucket: "dikapay",
    Key: key,
  });

  return await getSignedUrl(s3, command, {
    expiresIn: 600,
  });
}
