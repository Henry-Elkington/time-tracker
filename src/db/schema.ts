import { sqliteTable, text, integer, InferModel } from "drizzle-orm/sqlite-core";
import { and, asc, desc, eq, or } from "drizzle-orm/expressions";
import { drizzle } from "drizzle-orm/better-sqlite3";
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

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite);

// db.select().from(users).all();
// db.select().from(users).where(eq(users.id, 42)).get();

// // you can combine filters with and(...) or or(...)
// db.select()
//   .from(users)
//   .where(and(eq(users.id, 42), eq(users.name, "Dan")))
//   .all();

// db.select()
//   .from(users)
//   .where(or(eq(users.id, 42), eq(users.id, 1)))
//   .all();

// // partial select
// const result = db
//   .select({
//     field1: users.id,
//     field2: users.name,
//   })
//   .from(users)
//   .all();
// const { field1, field2 } = result[0];

// // limit offset & order by
// db.select().from(users).limit(10).offset(10).all();
// db.select().from(users).orderBy(users.name).all();
// db.select().from(users).orderBy(desc(users.name)).all();
// // you can pass multiple order args
// db.select().from(users).orderBy(asc(users.name), desc(users.name)).all();
