import type { Express, RequestHandler } from "express";
import session from "express-session";
import { db } from "./db";
import { users } from "@shared/models/auth";
import { eq } from "drizzle-orm";

const LOCAL_USER = {
  id: "local-dev-user",
  email: "teacher@local.dev",
  firstName: "Local",
  lastName: "Teacher",
  profileImageUrl: null,
};

export async function setupLocalAuth(app: Express) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "local-dev-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  await db
    .insert(users)
    .values({
      id: LOCAL_USER.id,
      email: LOCAL_USER.email,
      firstName: LOCAL_USER.firstName,
      lastName: LOCAL_USER.lastName,
      profileImageUrl: LOCAL_USER.profileImageUrl,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: LOCAL_USER.email,
        firstName: LOCAL_USER.firstName,
        lastName: LOCAL_USER.lastName,
        updatedAt: new Date(),
      },
    });
}

export function registerLocalAuthRoutes(app: Express) {
  app.get("/api/login", (req: any, res) => {
    req.session.userId = LOCAL_USER.id;
    res.redirect("/");
  });

  app.get("/api/logout", (req: any, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

  app.get("/api/auth/user", localIsAuthenticated, async (req: any, res) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.user.claims.sub));
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}

export const localIsAuthenticated: RequestHandler = (req: any, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = {
    claims: { sub: req.session.userId },
  };
  next();
};
