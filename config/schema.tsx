
import { integer, json, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(2)

});

export const coursesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull().references(() => usersTable.email),
  courseId: varchar({ length: 255 }).notNull().unique(),
  courseName: varchar({ length: 255 }).notNull(),
  userInput: varchar({ length: 1024 }).notNull(),
  type: varchar({ length: 255 }).notNull(),
  courseLayout: json(),
  createdAt: timestamp().defaultNow(),

});