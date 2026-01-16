
import { integer, json, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

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


export const chapterTable = pgTable("chapters", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  courseId: varchar({ length: 255 }).notNull().references(() => coursesTable.courseId),
  chapterId: varchar({ length: 255 }).notNull().unique(),
  chapterTitle: varchar({ length: 255 }).notNull(),
  videoContent: json(),
  captions: json(),
  audioFileUrl: varchar({ length: 1024 }),
  createdAt: timestamp().defaultNow(),

})

export const chapterContentSlides = pgTable("chapter_content_slides", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  courseId: varchar({ length: 255 }).notNull().references(() => coursesTable.courseId),
  chapterId: varchar({ length: 255 }).notNull().references(() => chapterTable.chapterId),
  slideId: varchar({ length: 255 }).notNull(),
  slideIndex: integer().notNull(),
  audioFileName: varchar({ length: 255 }).notNull(),
  captions: json(),
  narration: json().notNull(),
  html: text(),
  revelData: json().notNull(),
});