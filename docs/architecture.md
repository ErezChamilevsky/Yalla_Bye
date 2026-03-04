# System Architecture: "Yalla Bye"

## 1. High-Level Architecture Overview
"Yalla Bye" operates on a **Client-Heavy, Server-Light** architecture. Since reflexes and zero-latency interactions are critical, the entire core gameplay loop is processed locally on the client (Frontend). The Backend acts as a secure ledger for scores, leaderboard aggregation, and daily seed distribution.

### Client (Frontend)
- **Tech Stack:** React (Web/PWA) targeting Mobile-first (Portrait mode is the primary orientation) but fully responsive for Desktop browsers.
- **Responsibility:** Game loop, rendering animations, hit detection, audio/haptics, local state management (score, timer, power-up gauge), and enforcing "Daily Seed" deterministic logic.
- **Display Focus:** The entire game logic and UI must prioritize mobile screens. The gameplay arena should be centered and scaled on desktop, avoiding horizontal stretching of the vertical 3x3 play space.

### Server (Backend)
- **Tech Stack:** Node.js (Express/NestJS) + MongoDB (sole database for persistence and real-time scores).
- **Responsibility:** User registration (anonymous/device-tied + city), score validation (anti-cheat), score aggregation (City War), and daily configuration distribution (Daily Barrage seed).

---

## 2. Core Flows

### A. Game Initialization & Daily Seed
1. Client requests `/api/config/daily-seed`.
2. Backend returns the random seed for the day's "Daily Barrage" and any configuration updates (e.g., spawn rate multipliers).
3. Client uses the seed to initialize a pseudo-random number generator (PRNG) guaranteeing every player gets the exact same enemy sequences in the daily mode.

### B. Gameplay Loop (100% Client-Side)
1. Player hits "Start". 60-second timer begins.
2. `useGameLoop` hook triggers spawns based on active mode (Endless random vs. Daily PRNG).
3. Tap events trigger hit detection. Hits update the local `gameStore` (score increases, beeper gauge fills).
4. Time extension (+0.5s) and penalties (-5s) are applied locally.

### C. Score Submission & City War
1. Timer hits 0. Client generates a "Damage Report" payload: `{ userId, city, score, slaps: { rat: 10, bunker: 5, head: 1 }, timestamp, hash }`.
2. Payload is sent to `POST /api/scores/submit`.
3. Backend validates the payload (e.g., is `score` mathematically possible given the max 60+ seconds?).
4. Backend updates the User's total stats, checks for Title unlocks, and increments the City's cumulative score in MongoDB using atomic updates (`$inc`).

### D. Live Leaderboard Update
1. Client polls or connects via WebSocket/SSE to `/api/leaderboards/live`.
2. Backend returns the top Cities and current Ticker events by querying the aggregated scores in MongoDB.

---

## 3. Database Schema Concept

**Users Table/Collection:**
- `id` (UUID)
- `city_id` (String/Ref)
- `total_slaps` (Int)
- `best_score` (Int)
- `title` (String)

**Scores/Sessions Table:**
- `session_id` (UUID)
- `user_id` (UUID)
- `score` (Int)
- `mode` (Enum: ENDLESS, DAILY)
- `created_at` (Timestamp)

**Cities Table (or Redis Hash):**
- `city_id` (String)
- `total_score` (Int)
- `player_count` (Int) - for average calculation if needed.
