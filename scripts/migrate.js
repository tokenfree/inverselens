#!/usr/bin/env node

// Database migration script for production deployment
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-http/migrator";
import path from "path";

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  console.log("Connecting to database...");
  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  try {
    console.log("Running database migrations...");
    await migrate(db, { 
      migrationsFolder: path.join(process.cwd(), "migrations")
    });
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().catch(console.error);
}

export { runMigrations };
