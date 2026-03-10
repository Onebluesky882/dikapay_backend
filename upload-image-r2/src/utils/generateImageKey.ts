export function generateImageKey(imageType: string, mimeType: string) {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const uuid = crypto.randomUUID();
  const ext = getExtension(mimeType ?? "image/jpeg");
  const key = `images/${imageType}/${year}/${month}/${day}/${uuid}.${ext}`;
  return key;
}

function getExtension(mimeType: string) {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };

  return map[mimeType] ?? "jpg";
}
