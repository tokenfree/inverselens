import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, imageAnalyses, type User, type InsertUser, type ImageAnalysis, type InsertImageAnalysis } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { IStorage, MemStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is required");
    }

    const sql = neon(databaseUrl);
    this.db = drizzle(sql, { schema: { users, imageAnalyses } });
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  async createImageAnalysis(analysis: InsertImageAnalysis): Promise<ImageAnalysis> {
    const result = await this.db.insert(imageAnalyses).values(analysis).returning();
    return result[0];
  }

  async getImageAnalysis(id: string): Promise<ImageAnalysis | undefined> {
    const result = await this.db.select().from(imageAnalyses).where(eq(imageAnalyses.id, id)).limit(1);
    return result[0];
  }

  async getRecentImageAnalyses(limit: number): Promise<ImageAnalysis[]> {
    return await this.db
      .select()
      .from(imageAnalyses)
      .orderBy(desc(imageAnalyses.createdAt))
      .limit(limit);
  }
}

// Export storage instance - use database in production, memory in development
export const storage = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
