# Running TeacherOS Locally

## Prerequisites

- **Node.js** v20 or later — [download here](https://nodejs.org)
- **PostgreSQL** v14 or later — [download here](https://www.postgresql.org/download/)
- **Google Gemini API key** (for the AI Crisis feature) — [get one here](https://aistudio.google.com/apikey)

## Step-by-step Setup

### 1. Download the project

Download the project as a ZIP from Replit (three-dot menu → Download as zip), then unzip it.

### 2. Install dependencies

```bash
cd teacheros
npm install
```

### 3. Create a PostgreSQL database

```bash
createdb teacheros
```

Or via `psql`:
```sql
CREATE DATABASE teacheros;
```

### 4. Create a `.env` file

Create a file called `.env` in the project root with these values:

```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/teacheros
GEMINI_API_KEY=your_gemini_api_key_here
SESSION_SECRET=any-random-string-here
```

Replace:
- `your_username` / `your_password` with your PostgreSQL credentials
- `your_gemini_api_key_here` with your Google Gemini API key
- `any-random-string-here` with any random string (used for session encryption)

### 5. Push the database schema

```bash
npm run db:push
```

### 6. Start the app

```bash
npm run dev
```

The app will be running at **http://localhost:5000**

### 7. Log in

Click "Log In to Get Started" on the landing page. In local mode, you'll be automatically logged in as a dev user — no Replit account needed.

## How Local Mode Works

When the app detects it's not running on Replit (no `REPL_ID` environment variable), it automatically:

- **Auth**: Uses a simple session-based login with a local dev user instead of Replit Auth
- **AI**: Connects directly to Google's Gemini API using your `GEMINI_API_KEY` instead of Replit's AI integration
- **Database**: Works the same way — just needs a PostgreSQL `DATABASE_URL`

## Notes

- The AI Crisis feature (voice + streaming responses) requires a valid `GEMINI_API_KEY`. Without it, crisis queries will fail.
- Voice input ("Tap to Speak") uses the browser's built-in Speech Recognition API. It works best in Chrome.
- The app binds to `0.0.0.0:5000` by default. Change the port with `PORT=3000 npm run dev`.
