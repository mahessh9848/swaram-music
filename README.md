# 🎵 SWARAM

> **Music that flows with your mood.**

Swaram is an immersive mood-based music web application. Select a mood, let the artwork take over, and experience music curated for how you feel right now.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Oracle DB](https://img.shields.io/badge/Oracle%20DB-11gR2-F80000?logo=oracle)](https://www.oracle.com/database/)

---

## ✨ Features

| Feature | Status |
|---|---|
| 8 immersive mood backgrounds (Sad, Happy, Calm, Romantic, Energetic, Chill, Lonely, Road Trip) | ✅ |
| Real HTML5 audio playback with seek, volume, next/prev | ✅ |
| Local MP3 import with IndexedDB persistence | ✅ |
| Song renaming (persisted, live player update) | ✅ |
| Demo login / authentication modal | ✅ |
| Light / Dark theme toggle | ✅ |
| Fully responsive (mobile, tablet, desktop) | ✅ |
| Oracle Database schema (15 tables, PL/SQL procedures, views) | ✅ |
| Node.js/Express backend (Oracle integration ready) | 🔧 In progress |

---

## 🗂 Project Structure

```
swaram/
├── frontend/          # React + Vite + TailwindCSS v4 app
│   ├── public/
│   │   ├── audio/     # MP3 files (tracked via Git LFS)
│   │   └── assets/    # Background artwork, icons
│   └── src/
│       ├── components/
│       ├── data/          # Mood configuration & playlists
│       ├── hooks/         # usePlayer, useAuth, useTheme
│       ├── pages/         # Home.jsx (main page)
│       ├── player/        # AudioEngine
│       ├── services/      # API client (future)
│       └── storage/       # IndexedDB music storage
│
├── backend/           # Node.js + Express + oracledb
│   └── src/
│       ├── routes/
│       └── db/
│
└── database/          # Oracle SQL scripts (run in order 01→14)
    ├── 01_create_tables.sql
    ├── ...
    └── README.md      # Full setup guide
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- Git LFS (`git lfs install` before cloning)
- *(For backend)* Oracle Database 11gR2+ with Oracle Instant Client

### 1 · Clone with LFS

```bash
git lfs install
git clone https://github.com/YOUR_USERNAME/swaram-music.git
cd swaram-music
```

### 2 · Frontend

```bash
cd frontend
cp .env.example .env          # Edit VITE_API_BASE if needed
npm install
npm run dev                   # http://localhost:5173
```

### 3 · Backend *(optional — app works without it)*

```bash
cd backend
cp .env.example .env          # Fill in Oracle credentials
npm install
npm run dev                   # http://localhost:3001
```

### 4 · Oracle Database *(optional)*

See [`database/README.md`](./database/README.md) for the full setup guide.

```sql
-- Run scripts in SQL*Plus in order:
@database/01_create_tables.sql
@database/02_create_sequences.sql
-- ... through 14_create_procedures.sql
```

---

## 🔐 Environment Variables

| File | Purpose |
|---|---|
| `frontend/.env.example` | Frontend environment template |
| `backend/.env.example` | Backend / Oracle credentials template |
| `database/.env.example` | Database connection reference |

> ⚠️ Never commit real `.env` files. They contain credentials and are listed in `.gitignore`.

---

## 🎵 Audio Files

Audio files (`frontend/public/audio/*.mp3`) are tracked with **Git LFS**.  
Run `git lfs install` before cloning to ensure they are downloaded correctly.

---

## 📄 License

MIT © 2026 Swaram
