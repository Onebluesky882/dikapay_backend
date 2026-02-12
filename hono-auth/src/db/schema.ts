import * as authSchema from "./auth-schema";

// ✅ schema object ที่ better-auth ต้องการ
export const schema = {
  user: authSchema.user,
  session: authSchema.session,
  account: authSchema.account,
};

// (optional) export table แยกไว้ใช้ที่อื่น
export * from "./auth-schema";
