import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTeacherProfileSchema, insertTimetableSessionSchema, insertReflectionSchema } from "@shared/schema";
import { setupCrisisWebSocket } from "./crisis-ws";

const isReplit = !!process.env.REPL_ID;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  let authMiddleware: RequestHandler;

  if (isReplit) {
    const { setupAuth, registerAuthRoutes, isAuthenticated } = await import("./replit_integrations/auth");
    await setupAuth(app);
    registerAuthRoutes(app);
    authMiddleware = isAuthenticated;
  } else {
    const { setupLocalAuth, registerLocalAuthRoutes, localIsAuthenticated } = await import("./local-auth");
    await setupLocalAuth(app);
    registerLocalAuthRoutes(app);
    authMiddleware = localIsAuthenticated;
    console.log("Running in LOCAL mode - auto-login at /api/login");
  }

  app.get("/api/profile", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getProfile(userId);
      res.json(profile || null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertTeacherProfileSchema.parse({ ...req.body, userId });
      const profile = await storage.upsertProfile(data);
      res.json(profile);
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ message: "Failed to save profile" });
    }
  });

  app.get("/api/timetable", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getTimetable(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching timetable:", error);
      res.status(500).json({ message: "Failed to fetch timetable" });
    }
  });

  app.post("/api/timetable", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertTimetableSessionSchema.parse({ ...req.body, userId });
      const session = await storage.addSession(data);
      res.json(session);
    } catch (error) {
      console.error("Error adding session:", error);
      res.status(500).json({ message: "Failed to add session" });
    }
  });

  app.patch("/api/timetable/:id", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const session = await storage.updateSession(id, userId, req.body);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  app.delete("/api/timetable/:id", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      await storage.deleteSession(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ message: "Failed to delete session" });
    }
  });

  app.get("/api/reflections", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getReflections(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching reflections:", error);
      res.status(500).json({ message: "Failed to fetch reflections" });
    }
  });

  app.post("/api/reflections", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertReflectionSchema.parse({ ...req.body, userId });
      const entry = await storage.addReflection(data);
      res.json(entry);
    } catch (error) {
      console.error("Error saving reflection:", error);
      res.status(500).json({ message: "Failed to save reflection" });
    }
  });

  // Lesson Prep - Lyzr NCF RAG endpoint
  app.post("/api/prep", authMiddleware, async (req: any, res) => {
    try {
      const { subject, topic, class: classLevel } = req.body;

      if (!subject || !topic) {
        return res.status(400).json({ message: "Subject and topic are required" });
      }

      const prompt = `I am a teacher preparing a lesson. Please give me a comprehensive teaching strategy for:

Subject: ${subject}
Topic: ${topic}
Class Level: ${classLevel || "Not specified"}

Based on the National Curriculum Framework (NCF), provide:
1. A clear learning outcome for this lesson
2. An engaging hook or opening activity (5 minutes) to capture student interest
3. Common misconceptions students have about this topic and how to address them
4. Check questions at different Bloom's taxonomy levels (Remember, Understand, Analyze, Apply)
5. Recommended teaching approach and pedagogy aligned with NCF guidelines`;

      const LYZR_API_KEY = process.env.LYZR_API_KEY || "sk-default-MNBhHUHTom982uvMLDHvuMFnoR1p3MbH";
      const LYZR_AGENT_ID = process.env.LYZR_AGENT_ID || "69916c349f359fed2b606ef7";

      const response = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": LYZR_API_KEY,
        },
        body: JSON.stringify({
          user_id: "teacher-user",
          agent_id: LYZR_AGENT_ID,
          session_id: `prep-${Date.now()}`,
          message: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Lyzr API error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error generating prep:", error);
      res.status(500).json({ message: "Failed to generate lesson plan. Please try again." });
    }
  });

  setupCrisisWebSocket(httpServer);

  return httpServer;
}
