import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";
export * from "./models/chat";

export const teacherProfiles = pgTable("teacher_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  name: text("name").notNull(),
  schoolType: text("school_type").notNull().default("CBSE"),
  subjects: text("subjects").array().notNull().default(sql`'{}'::text[]`),
  classes: text("classes").array().notNull().default(sql`'{}'::text[]`),
  resources: text("resources").array().notNull().default(sql`'{}'::text[]`),
});

export const timetableSessions = pgTable("timetable_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  time: text("time").notNull(),
  className: text("class_name").notNull(),
  section: text("section"),
  subject: text("subject").notNull(),
  topic: text("topic"),
});

export const reflections = pgTable("reflections", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  sessionId: integer("session_id"),
  energy: integer("energy").notNull(),
  strategy: text("strategy"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTeacherProfileSchema = createInsertSchema(teacherProfiles).omit({ id: true });
export const insertTimetableSessionSchema = createInsertSchema(timetableSessions).omit({ id: true });
export const insertReflectionSchema = createInsertSchema(reflections).omit({ id: true, createdAt: true });

export type InsertTeacherProfile = z.infer<typeof insertTeacherProfileSchema>;
export type TeacherProfile = typeof teacherProfiles.$inferSelect;

export type InsertTimetableSession = z.infer<typeof insertTimetableSessionSchema>;
export type TimetableSession = typeof timetableSessions.$inferSelect;

export type InsertReflection = z.infer<typeof insertReflectionSchema>;
export type Reflection = typeof reflections.$inferSelect;
