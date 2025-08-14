import { type User, type InsertUser, type ImageAnalysis, type InsertImageAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createImageAnalysis(analysis: InsertImageAnalysis): Promise<ImageAnalysis>;
  getImageAnalysis(id: string): Promise<ImageAnalysis | undefined>;
  getRecentImageAnalyses(limit: number): Promise<ImageAnalysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private imageAnalyses: Map<string, ImageAnalysis>;

  constructor() {
    this.users = new Map();
    this.imageAnalyses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createImageAnalysis(insertAnalysis: InsertImageAnalysis): Promise<ImageAnalysis> {
    const id = randomUUID();
    const analysis: ImageAnalysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date(),
    };
    this.imageAnalyses.set(id, analysis);
    return analysis;
  }

  async getImageAnalysis(id: string): Promise<ImageAnalysis | undefined> {
    return this.imageAnalyses.get(id);
  }

  async getRecentImageAnalyses(limit: number): Promise<ImageAnalysis[]> {
    return Array.from(this.imageAnalyses.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
