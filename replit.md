# TeacherOS

## Overview
TeacherOS is a mobile-first AI teacher companion app for Indian classrooms. It has three core modes:
- **Crisis** (red): Immediate classroom support
- **Prep** (blue): 30-second lesson planning
- **Reflect** (purple): Post-class journaling

## Recent Changes
- 2026-02-15: Converted all frontend pages from localStorage to real API calls using TanStack Query
- 2026-02-15: Integrated Replit Auth for authentication (login/logout/session management)
- 2026-02-15: Created PostgreSQL database schema (users, teacher_profiles, timetable_sessions, reflections)
- 2026-02-15: Built Express API routes for profile, timetable, and reflections CRUD

## User Preferences
- Design: Anthropic "paper & ink" aesthetic (#FDFCF8 background, Libre Baskerville serif typography)
- Color-coded modes: Red (Crisis/urgent), Blue (Prep/focus), Purple (Reflect/insight)
- Crisis mode must be easily navigatable during stress (elevated red button in nav)
- Mobile-first responsive design for React Native conversion
- Logout button says "Log Out" (not "Reset & Log Out")
- Do not modify auth module files in server/replit_integrations/auth/

## Project Architecture
- **Frontend**: React + Vite + TanStack Query + wouter routing + Tailwind CSS
- **Backend**: Express.js with authenticated API routes
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Replit Auth (server/replit_integrations/auth/)
- **Key files**:
  - `shared/schema.ts` - Database schema (users, teacher_profiles, timetable_sessions, reflections)
  - `server/routes.ts` - API endpoints
  - `server/storage.ts` - Database CRUD operations
  - `client/src/App.tsx` - Auth-gated routing with Landing page
  - `client/src/pages/` - Home, Crisis, Prep, Reflect, Profile, Onboarding
  - `client/src/hooks/use-auth.ts` - Auth hook
  - `client/src/components/Layout.tsx` - Shared layout with bottom nav

## API Endpoints
- `GET /api/auth/user` - Current user info
- `GET /api/login` - Replit Auth login
- `GET /api/logout` - Logout
- `GET/POST /api/profile` - Teacher profile CRUD
- `GET/POST /api/timetable` - Timetable sessions
- `PATCH /api/timetable/:id` - Update session topic
- `DELETE /api/timetable/:id` - Remove session
- `GET/POST /api/reflections` - Reflection entries
