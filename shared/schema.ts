import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const imageAnalyses = pgTable("image_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalFilename: text("original_filename").notNull(),
  imageData: text("image_data").notNull(), // base64 encoded image
  originalDescription: text("original_description").notNull(),
  originalElements: text("original_elements").notNull(), // JSON array of strings
  originalMood: text("original_mood").notNull(),
  mirrorDescription: text("mirror_description").notNull(),
  mirrorElements: text("mirror_elements").notNull(), // JSON array of strings
  mirrorMood: text("mirror_mood").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertImageAnalysisSchema = createInsertSchema(imageAnalyses).pick({
  originalFilename: true,
  imageData: true,
  originalDescription: true,
  originalElements: true,
  originalMood: true,
  mirrorDescription: true,
  mirrorElements: true,
  mirrorMood: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertImageAnalysis = z.infer<typeof insertImageAnalysisSchema>;
export type ImageAnalysis = typeof imageAnalyses.$inferSelect;
