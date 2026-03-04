# Frontend Implementation Tasks: "Yalla Bye"

*Adhering to strict project structure: single responsibility, separation of concerns (Logic ≠ View ≠ Data), max 150 lines per file, isolated features.*

## Phase 1: Project Skeleton & Theming
- [ ] **Task 1.1: Setup Theme & Assets**
  - Implement a "Neon War Room" design system in CSS/Tailwind (Dark Purple/Black, Neon Blue, Neon Red).
  - Add assets (Enemy caricatures, Slipper cursor, Backgrounds) to public folder.
  - Setup glassmorphism utility classes.
- [ ] **Task 1.2: Base Layout & Routing (`src/pages`)**
  - Create `SplashPage` (Draft/City Selection).
  - Create `LobbyPage` (Stats, Leaderboard snapshot, Start Button).
  - Create `ArenaPage` (The actual game grid).
  - Create `DebriefPage` (Results, Mocking engine, Share buttons).

## Phase 2: Feature - User Boarding & State
- [ ] **Task 2.1: Global Store setup (`src/store/userStore.ts`)**
  - Zustand/Redux store to keep `userId`, `city`, `totalSlaps`, `bestScore`, `title`.
- [ ] **Task 2.2: City Selection Component (`src/features/boarding/components/CitySelector.tsx`)**
  - Dropdown/List of Israeli cities.
  - Saves choice to store and triggers backend registration.

## Phase 3: Feature - The Arena (Core Gameplay - UI)
- [ ] **Task 3.1: Grid Components (`src/features/arena/components/`)**
  - `Grid.tsx`: 3x3 layout for portraits.
  - `Hole.tsx`: Visual container for targets.
  - `Actor.tsx`: Renders the specific enemy/friendly with enter/exit animations.
- [ ] **Task 3.2: HUD Components (`src/features/arena/components/HUD.tsx`)**
  - Visuals only: `TimerDisplay`, `ScoreDisplay`, `BeeperGauge`.
- [ ] **Task 3.3: Combat Visuals (`src/features/arena/components/CombatEffects.tsx`)**
  - Render "POW!", "SMACK!" text bubbles at tap coordinates.
  - Slipper slap animation.

## Phase 4: Feature - The Arena (Game Logic - Hooks & Store)
- [ ] **Task 4.1: Game State Store (`src/features/arena/store/gameStore.ts`)**
  - State: `score`, `timeLeft`, `beeperGauge`, `activeActors` (array of current entities in the 3x3 grid).
  - Actions: `addScore`, `deductTime`, `fillBeeper`, `triggerBeeper`, `spawnActor`, `despawnActor`.
- [ ] **Task 4.2: Game Loop Hook (`src/features/arena/hooks/useGameLoop.ts`)**
  - Pure logic interval. Randomly decides which hole gets which actor based on difficulty curve.
  - Handles the 60-second countdown and extensions.
- [ ] **Task 4.3: Daily PRNG Hook (`src/features/arena/hooks/useDailySeed.ts`)**
  - A utility hook that overrides the random spawner with a seeded PRNG for the "Daily Barrage" mode.
- [ ] **Task 4.4: Hit Detection Logic (`src/features/arena/hooks/useHitDetection.ts`)**
  - Logic parsing taps: If Rat -> +10pts, if Friendly -> -5s.
  - Dispatch to `gameStore`. Play sounds. Handle the "Two-tap" Khamenei logic.

## Phase 5: Feedback Systems
- [ ] **Task 5.1: Audio Engine (`src/hooks/useAudio.ts` or `src/services/audioService.ts`)**
  - Preload SFX (Slap, Miss, Grandma failure, high-tempo BGM).
  - Expose `playSlap()`, `playMiss()`, `playMusic()` functions.
- [ ] **Task 5.2: Haptics Engine (`src/utils/haptics.ts`)**
  - Wrapper for `navigator.vibrate` for tactile feedback on hits.

## Phase 6: Post-Game & Virality
- [ ] **Task 6.1: Mocking Engine (`src/features/debrief/utils/mockingGenerator.ts`)**
  - Pure function mapping score/stats to a randomized sarcastic string.
- [ ] **Task 6.2: Debrief View (`src/features/debrief/components/DamageReport.tsx`)**
  - UI for displaying the stats and the mocked enemy image.
- [ ] **Task 6.3: Share API (`src/features/debrief/services/shareService.ts`)**
  - Utilize Web Share API or generate an image (via HTML-to-Canvas) for Instagram/WhatsApp sharing.

## Phase 7: Scoreboard Integration
- [ ] **Task 7.1: API Services (`src/services/api.ts`)**
  - Functions to `submitScore(payload)`, `getCityLeaderboard()`.
- [ ] **Task 7.2: Ticker Component (`src/components/Ticker.tsx`)**
  - A pure scrolling text component receiving news feeds from the backend.
- [ ] **Task 7.3: Leaderboard View (`src/features/leaderboard/components/CityWarMap.tsx`)**
  - Visual ranking list or basic map of top cities.
