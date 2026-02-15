import {
  teacherProfiles, timetableSessions, reflections,
  type TeacherProfile, type InsertTeacherProfile,
  type TimetableSession, type InsertTimetableSession,
  type Reflection, type InsertReflection,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getProfile(userId: string): Promise<TeacherProfile | undefined>;
  upsertProfile(profile: InsertTeacherProfile): Promise<TeacherProfile>;

  getTimetable(userId: string): Promise<TimetableSession[]>;
  addSession(session: InsertTimetableSession): Promise<TimetableSession>;
  updateSession(id: number, userId: string, data: Partial<InsertTimetableSession>): Promise<TimetableSession | undefined>;
  deleteSession(id: number, userId: string): Promise<void>;

  getReflections(userId: string): Promise<Reflection[]>;
  addReflection(reflection: InsertReflection): Promise<Reflection>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(userId: string): Promise<TeacherProfile | undefined> {
    const [profile] = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, userId));
    return profile;
  }

  async upsertProfile(profile: InsertTeacherProfile): Promise<TeacherProfile> {
    const [result] = await db
      .insert(teacherProfiles)
      .values(profile)
      .onConflictDoUpdate({
        target: teacherProfiles.userId,
        set: {
          name: profile.name,
          schoolType: profile.schoolType,
          subjects: profile.subjects,
          classes: profile.classes,
          resources: profile.resources,
        },
      })
      .returning();
    return result;
  }

  async getTimetable(userId: string): Promise<TimetableSession[]> {
    return db.select().from(timetableSessions).where(eq(timetableSessions.userId, userId));
  }

  async addSession(session: InsertTimetableSession): Promise<TimetableSession> {
    const [result] = await db.insert(timetableSessions).values(session).returning();
    return result;
  }

  async updateSession(id: number, userId: string, data: Partial<InsertTimetableSession>): Promise<TimetableSession | undefined> {
    const [result] = await db
      .update(timetableSessions)
      .set(data)
      .where(and(eq(timetableSessions.id, id), eq(timetableSessions.userId, userId)))
      .returning();
    return result;
  }

  async deleteSession(id: number, userId: string): Promise<void> {
    await db.delete(timetableSessions).where(and(eq(timetableSessions.id, id), eq(timetableSessions.userId, userId)));
  }

  async getReflections(userId: string): Promise<Reflection[]> {
    return db.select().from(reflections).where(eq(reflections.userId, userId));
  }

  async addReflection(reflection: InsertReflection): Promise<Reflection> {
    const [result] = await db.insert(reflections).values(reflection).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
