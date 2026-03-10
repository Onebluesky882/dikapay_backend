export function generateImageKey(imageType: string) {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const uuid = crypto.randomUUID();
  const key = `images/${imageType}/${year}/${month}/${day}/${uuid}.jpg`;

  return key;
}
