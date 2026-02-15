<p align="center">
  <h1 align="center">🪷 GuruShakti — AI-Powered Teacher Companion</h1>
  <p align="center">
    <strong>Empowering India's 9.7 million teachers with AI-driven classroom support, NCF-aligned lesson planning, and real-time crisis resolution.</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Built%20with-Lyzr%20AI-blueviolet" alt="Lyzr AI" />
    <img src="https://img.shields.io/badge/Aligned%20to-NCF%202023-orange" alt="NCF 2023" />
    <img src="https://img.shields.io/badge/Stack-React%20%2B%20Express%20%2B%20Python-blue" alt="Stack" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL-336791" alt="PostgreSQL" />
  </p>
</p>

---

## 📌 Problem Statement

### The Crisis in Indian Classrooms

India has **9.7 million teachers** serving **265 million students** across 1.5 million schools — the largest education system in the world. Yet teachers face a **silent crisis**:

| Challenge | Scale |
|-----------|-------|
| Average class size | **40–60 students** per classroom |
| Teacher-to-student ratio | **1:35** (national average, worse in rural areas) |
| Teachers feeling unsupported | **68%** report lack of pedagogical guidance |
| Curriculum overhaul | **NCF 2023** introduced, but teachers lack training |
| Classroom disruptions | **No real-time support** for de-escalation |
| Lesson planning time | **2–3 hours daily** spent on manual planning |

### Why It Matters

The **National Curriculum Framework 2023 (NCF)** represents India's most ambitious education reform in decades — shifting from rote learning to competency-based education. But the framework's 700+ page document is dense, and teachers on the ground have **no practical tool** to translate NCF guidelines into daily classroom action.

**GuruShakti bridges this gap.** It puts the entire NCF knowledge base in every teacher's pocket, accessible through voice, text, and a 30-second lesson planner.

---

## 🚀 Features

### 🔴 Crisis Resolution — *"Tap to Speak"*

> **Real-time, voice-activated classroom crisis support powered by NCF knowledge.**

When a teacher faces a chaotic classroom — students fighting, crying, disengaged — they don't have time to search for strategies. **Tap the red button, speak the situation, and get an immediate NCF-backed response.**

- 🎙️ **Voice Input** — Uses browser Speech Recognition API (works best in Chrome)
- ⚡ **Instant Quick Filters** — One-tap triggers for common scenarios: *Too Loud, Fighting, Crying, Sleeping*
- 📝 **Silent Text Mode** — Type your situation when voice isn't appropriate
- 🔄 **Real-time Streaming** — Responses stream word-by-word via WebSocket
- 📚 **NCF RAG Knowledge Base** — Powered by Lyzr AI agent with Retrieval-Augmented Generation on the National Curriculum Framework
- 📖 **Source Citations** — Every suggestion links back to NCF document sections

**Tech:** React → WebSocket (`ws://localhost:8765`) → Python Server → Lyzr AI Agent API → NCF RAG Knowledge Base

---

### 📖 Lesson Prep — *"30-Second NCF-Aligned Planner"*

> **Generate a complete teaching strategy for any topic in seconds, grounded in NCF 2023.**

Instead of spending hours manually planning, teachers select their subject, topic, and class level — and the AI generates a structured, NCF-aligned lesson plan.

**Output includes:**
- 🎯 **Learning Outcome** — Competency-based objectives from NCF
- 💡 **The Hook (5 min)** — An engaging opening activity to capture attention
- ⚠️ **Common Pitfalls** — Misconceptions students typically have and how to address them
- 📊 **Check Questions** — Questions at multiple Bloom's taxonomy levels (Remember, Analyze, Apply)
- 📄 **NCF Source References** — Direct citations from the curriculum framework

**Supports:** Biology, Mathematics, History, English, Physics, Chemistry, Geography, Computer Science | Classes 6–12

**Tech:** React → `POST /api/prep` → Express Backend → Lyzr AI Agent API → NCF RAG

---

### 🏠 Smart Dashboard — *"Your Day at a Glance"*

> **A personalized daily command center for teachers.**

- 📅 **Today's Timetable** — View and manage all class sessions for the day
- ✏️ **Quick Topic Entry** — Tap any session to add or edit the day's topic
- 🔔 **Next Class Alert** — Always know what's coming up
- ➡️ **Quick Actions** — One-tap access to Prep, Crisis, and Reflect features
- 💬 **Daily Teaching Quote** — Motivational quotes from Indian educators

---

### 🪞 Reflect — *"Classroom Pulse Tracker"*

> **Post-class reflection tool to track teaching effectiveness over time.**

After every class, teachers log a quick reflection:
- 📊 **Energy Slider** — Rate the class energy level (1–5)
- ✅ **Strategy Feedback** — Did the teaching strategy work? (Thumbs up/down/neutral)
- 📝 **Quick Notes** — Add observations for future reference
- 📈 **Trend Tracking** — View reflection history to identify patterns

This data builds a **personal teaching profile** over time, enabling the AI to give increasingly personalized advice.

---

### 👤 Teacher Profile & Onboarding

> **Personalized setup for contextually relevant AI responses.**

- 🏫 **School Type** — CBSE, ICSE, State Board
- 📚 **Subjects & Classes** — Configure teaching load
- 🛠️ **Resource Availability** — What tools does your classroom have?
- 🔐 **Session-based Auth** — Secure login with local dev mode support

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│                   Browser (React)                 │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────┐│
│  │  Crisis   │ │  Prep    │ │  Home  │ │Reflect ││
│  │(WebSocket)│ │(REST API)│ │        │ │        ││
│  └─────┬─────┘ └─────┬────┘ └────────┘ └────────┘│
└────────┼─────────────┼───────────────────────────┘
         │             │
    ws://8765     POST /api/prep
         │             │
┌────────▼─────┐ ┌─────▼──────────────────────────┐
│ Python WS    │ │     Express.js Backend           │
│ Server       │ │  ┌─────────────────────────┐    │
│ (ws_server.py│ │  │ Routes (REST API)        │    │
│              │ │  │ • /api/prep → Lyzr       │    │
│              │ │  │ • /api/profile           │    │
│              │ │  │ • /api/timetable         │    │
│              │ │  │ • /api/reflections       │    │
│              │ │  └─────────────────────────┘    │
└──────┬───────┘ └──────────────┬──────────────────┘
       │                        │
       │     ┌──────────────────▼──────────┐
       │     │       PostgreSQL             │
       │     │  • teacher_profiles          │
       │     │  • timetable_sessions        │
       │     │  • reflections               │
       │     └─────────────────────────────┘
       │
┌──────▼──────────────────────────────────┐
│     Lyzr AI Platform (Cloud)             │
│  ┌───────────────────────────────────┐  │
│  │  NCF Advisor Agent (GPT-4.1)     │  │
│  │  • RAG on National Curriculum     │  │
│  │    Framework documents            │  │
│  │  • Structured JSON responses      │  │
│  │  • Source citations               │  │
│  └───────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Framer Motion, Tailwind CSS, Wouter |
| **Backend** | Express.js 5, TypeScript, Node.js |
| **AI Server** | Python, WebSockets, Lyzr AI SDK |
| **Database** | PostgreSQL 17, Drizzle ORM |
| **AI Platform** | Lyzr AI Agent Studio (GPT-4.1 + NCF RAG) |
| **Speech** | Web Speech Recognition API (Chrome) |
| **Auth** | Session-based (Passport.js) |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v20+
- **Python** 3.8+
- **PostgreSQL** v14+
- **Lyzr AI API Key** — [Get one from Lyzr Studio](https://studio.lyzr.ai)
- **Google Gemini API Key** *(optional, for legacy crisis mode)* — [Get one here](https://aistudio.google.com/apikey)

### Setup

```bash
# 1. Install Node dependencies
npm install

# 2. Install Python dependencies
pip install websockets requests python-dotenv

# 3. Create .env in project root
cat > .env << EOF
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/teacheros
GEMINI_API_KEY=your_gemini_key
SESSION_SECRET=any-random-string
LYZR_API_KEY=your_lyzr_api_key
LYZR_AGENT_ID=your_lyzr_agent_id
EOF

# 4. Create python-ws/.env
cat > python-ws/.env << EOF
LYZR_API_KEY=your_lyzr_api_key
LYZR_AGENT_ID=your_lyzr_agent_id
EOF

# 5. Create the database
createdb teacheros

# 6. Push schema
npm run db:push
```

### Run

**Terminal 1** — Node.js app:
```bash
npm run dev
```

**Terminal 2** — Python WebSocket server:
```bash
cd python-ws
python ws_server.py
```

Open **http://localhost:5000** 🚀

---

## 🎯 Impact & Vision

| Metric | Target |
|--------|--------|
| **Lesson planning time** | 2–3 hours → **30 seconds** |
| **Crisis response time** | Minutes of panic → **Instant voice guidance** |
| **NCF compliance** | Manual interpretation → **AI-extracted guidelines** |
| **Teacher reflection** | None → **Daily data-driven insights** |

### For India's Teachers

GuruShakti is built specifically for the **Indian classroom context**:
- 🇮🇳 Large class sizes (40–60 students)
- 📋 Board exam pressure (CBSE, ICSE, State Boards)
- 🌍 Mixed-ability classrooms
- 📱 Mobile-first design for teachers on the go
- 🗣️ English-medium with future Hindi/regional language support

---

## 📄 License

MIT

---

<p align="center">
  <strong>Built with ❤️ for India's educators</strong><br/>
  <em>"The teacher who is indeed wise does not bid you to enter the house of his wisdom but rather leads you to the threshold of your mind."</em> — Khalil Gibran
</p>
