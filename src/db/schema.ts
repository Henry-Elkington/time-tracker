import { sqliteTable, text, integer, InferModel } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).defaultNow().notNull(),
  password: text("password").notNull(),
});

export const timeEntrys = sqliteTable("time_entrys", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  discription: text("discription").notNull(),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  userId: integer("user_id").references(() => users.id),
});

const sqlite = new Database("./src/db/sqlite.db");
export const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "./src/db/migrations" });
