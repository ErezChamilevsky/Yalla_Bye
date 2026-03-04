# Backend Implementation Tasks: "Yalla Bye"

*The backend serves as a secure, high-throughput scoreboard and state manager. It does not run game ticks, but heavily focuses on score validation and aggregate tracking.*

## Phase 1: Foundation & Database Setup
- [ ] **Task 1.1: Project Setup**
  - Initialize Node.js + Express/NestJS server.
  - Setup environment variables (CORS, DB URIs, JWT secrets).
- [ ] **Task 1.2: MongoDB Connection & Models**
  - Setup Mongoose/MongoDB connection.
  - Create models for `User` (id, device_id, city, total_slaps, best_score, title).
  - Create `City` model (name, total_score, player_count) to track aggregate stats.

## Phase 2: User Onboarding API
- [ ] **Task 2.1: Registration Endpoint (`POST /api/users/register`)**
  - Input: `deviceId` (or generate anonymous UUID), `city`.
  - Action: Create user if not exists. Update city if changed.
  - Output: `userId`, current `title`, personal best stats.

## Phase 3: Core Gameplay APIs
- [ ] **Task 3.1: Config/Seed Endpoint (`GET /api/game/daily-seed`)**
  - Generate a random seed unique to the calendar day (e.g., hash of YYYY-MM-DD + secret).
  - Output: `{ seed: "XYZ123", mode: "DAILY_BARRAGE", expiry: "timestamp" }`.
- [ ] **Task 3.2: Score Submission Endpoint (`POST /api/scores/submit`)**
  - Input: `userId`, `score`, `slapBreakdown`, `mode`, `hash` (basic anti-tamper signature).
  - Action: 
    1. **Validation**: Check if max score limit is breached.
    2. **User Update**: Atomic increment of `total_slaps`, update `best_score` if higher.
    3. **City Update**: Atomically increment the City's `total_score` in the `City` collection using `$inc`.
  - Output: `newTitle` (if changed), `cityRank`.

## Phase 4: Leaderboard Engine (The City War)
- [ ] **Task 4.1: MongoDB Leaderboard Query**
  - Implement a query on the `City` collection sorted by `total_score` descending.
- [ ] **Task 4.2: Fetch Leaderboard Endpoint (`GET /api/leaderboards/city`)**
  - Fetch Top N cities.
  - Output: Array of `{ city, score, rank }`.
- [ ] **Task 4.3: The "Ticker" Event Generator**
  - A background function that periodically checks for changes in city rankings and generates "News" events.

## Phase 5: Security & Rate Limiting
- [ ] **Task 5.1: API Rate Limiting**
  - Prevent script kiddies from spamming `/submit`. Max 1 submission per 60 seconds per IP/User.
- [ ] **Task 5.2: Hash Validation Hook**
  - Implement a shared secret logic (Frontend hashes score + timestamp + secret). Backend verifies hash to stop raw cURL requests altering the score.

## Phase 6: Analytics & Monitoring (Admin)
- [ ] **Task 6.1: Basic Admin Stats**
  - Number of Active Users, Total Slaps delivered today, Anomalous users (high scores).
