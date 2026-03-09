import crypto from "crypto";
export function internalPassword(email: string) {
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET!)
    .update(email)
    .digest("hex");
}
