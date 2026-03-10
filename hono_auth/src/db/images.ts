import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const images = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  userId: text("user_id"),
  imageKey: text("image_key").notNull(),
  mimeType: text("mime_type").notNull(),
  // profile | shop | slip
  imageType: text("image_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
