import * as authSchema from "./auth-schema";
import { emailOtps } from "./email-otps";
import { images } from "./images";

// ✅ schema object ที่ better-auth ต้องการ
export const schema = {
  user: authSchema.user,
  session: authSchema.session,
  account: authSchema.account,
  emailOtps,
  images,
};

// (optional) export table แยกไว้ใช้ที่อื่น
export * from "./auth-schema";
export * from "./email-otps";
export * from "./images";
