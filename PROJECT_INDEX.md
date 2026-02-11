# Project Index: Tamashii (funtime-app)

Generated: 2026-02-10

> **Tamashii** (魂 — "soul/spirit") is a personal focus & recovery desktop/mobile app built with Tauri v2 + React + TypeScript. It helps users maintain discipline through streak tracking, content blocking, journaling, achievements, and an anime-style mascot companion.

## Project Structure

```
funtime-app/
├── src/                          # React frontend (TypeScript)
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Root component (theme loader + router)
│   ├── router.tsx                # react-router v7 route definitions
│   ├── index.css                 # Tailwind v4 + CSS variables (3 themes)
│   ├── types/index.ts            # Shared TypeScript interfaces
│   ├── lib/                      # Data & utilities
│   │   ├── database.ts           # SQLite init (7 tables via @tauri-apps/plugin-sql)
│   │   ├── theme.ts              # Theme definitions + applyTheme()
│   │   ├── achievements.ts       # 25 achievement definitions (5 categories)
│   │   ├── blocklists.ts         # 350+ domains across 7 block categories
│   │   ├── quotes.ts             # 110 motivational quotes (4 categories)
│   │   └── mascotDialogues.ts    # Mascot speech bubbles by context
│   ├── store/                    # Zustand state management
│   │   ├── appStore.ts           # Global app state (theme, mascot, notifications)
│   │   ├── streakStore.ts        # Streak tracking (start/reset/duration calc)
│   │   ├── blockerStore.ts       # Blocker state (categories, lock, domains)
│   │   └── achievementStore.ts   # Achievement progress tracking
│   └── components/               # React UI components
│       ├── layout/
│       │   ├── AppShell.tsx       # Main layout (TopBar + Sidebar + content)
│       │   ├── TopBar.tsx         # Title bar (logo, theme toggle, window controls)
│       │   └── Sidebar.tsx        # Navigation sidebar (7 routes)
│       ├── dashboard/
│       │   ├── DashboardPage.tsx  # Home page
│       │   ├── StreakCounter.tsx   # Live streak timer display
│       │   ├── DailyQuote.tsx     # Random daily quote card
│       │   ├── QuickStats.tsx     # At-a-glance stats
│       │   └── PanicButton.tsx    # Emergency button on dashboard
│       ├── blocker/
│       │   ├── BlockerPage.tsx    # Content blocker management
│       │   ├── CategoryCard.tsx   # Block category toggle card
│       │   ├── ActivateForm.tsx   # Blocker activation form
│       │   ├── LockStatus.tsx     # Lock timer display
│       │   └── DomainListModal.tsx # View/edit domain list modal
│       ├── panic/
│       │   ├── PanicPage.tsx      # Emergency/urge page
│       │   ├── BreathingExercise.tsx # Guided breathing animation
│       │   ├── GroundingExercise.tsx # 5-4-3-2-1 grounding technique
│       │   └── ProductiveActions.tsx # Redirect to productive activities
│       ├── stats/
│       │   ├── StatsPage.tsx      # Statistics overview
│       │   ├── CalendarHeatmap.tsx # GitHub-style activity heatmap
│       │   ├── StreakHistory.tsx   # Streak history timeline
│       │   └── WeeklySummary.tsx   # Weekly stats summary
│       ├── journal/
│       │   ├── JournalPage.tsx    # Journal entries list
│       │   ├── JournalEditor.tsx  # Rich text journal editor
│       │   └── JournalEntryCard.tsx # Journal entry preview card
│       ├── achievements/
│       │   ├── AchievementsPage.tsx # Achievement gallery
│       │   └── AchievementCard.tsx # Individual achievement card
│       ├── settings/
│       │   ├── SettingsPage.tsx    # Settings page
│       │   ├── ThemeSelector.tsx   # Theme picker (dark/light/anime)
│       │   ├── MascotSelector.tsx  # Mascot gender picker
│       │   └── NotificationSettings.tsx # Notification preferences
│       ├── anime/
│       │   ├── VRMMascot.tsx      # 3D VRM mascot renderer (@react-three/fiber)
│       │   ├── MascotDialogue.tsx # Speech bubble component
│       │   └── SparkleParticles.tsx # Anime mode floating particles
│       ├── background/
│       │   └── MeshGradient.tsx   # Animated mesh gradient background
│       └── shared/
│           ├── Button.tsx         # Reusable button
│           ├── Card.tsx           # Reusable card
│           ├── Modal.tsx          # Reusable modal
│           ├── Toggle.tsx         # Toggle switch
│           └── ProgressBar.tsx    # Progress bar
├── src-tauri/                    # Rust backend (Tauri v2)
│   ├── Cargo.toml                # Rust dependencies
│   ├── tauri.conf.json           # Tauri config (window, plugins, bundle)
│   ├── capabilities/default.json # Tauri permissions
│   ├── build.rs                  # Tauri build script
│   ├── icons/                    # App icons (16 variants)
│   └── src/
│       ├── main.rs               # Rust entry (calls lib::run)
│       ├── lib.rs                # App setup (plugins, tray, commands, scheduler)
│       ├── commands/
│       │   ├── mod.rs             # Command module exports
│       │   ├── blocker.rs         # Tauri commands: apply/remove blocklist, status, admin check, extend lock
│       │   └── streak.rs          # Tauri commands: get/save streak data
│       ├── blocker/
│       │   ├── mod.rs             # Blocker module exports
│       │   ├── hosts.rs           # Windows hosts file manipulation (TAMASHII markers)
│       │   └── watcher.rs         # Tamper-protection watcher (60s re-apply)
│       └── scheduler/
│           ├── mod.rs             # Scheduler module exports
│           └── quote_scheduler.rs # Daily notification scheduler (09:30)
├── public/
│   ├── logo.png                  # Tamashii logo (1024x1024, Blender-rendered)
│   └── models/                   # VRM mascot models
│       ├── girl.vrm              # Female mascot
│       └── boy.vrm               # Male mascot
├── index.html                    # HTML entry point
├── package.json                  # Node dependencies
├── tsconfig.json                 # TypeScript config
└── vite.config.ts                # Vite config (React + Tailwind v4)
```

## Entry Points

- **Frontend**: `src/main.tsx` — React root render
- **Backend**: `src-tauri/src/main.rs` → `lib.rs::run()` — Tauri app bootstrap
- **Build**: `npm run build` (tsc + vite) / `npm run tauri build` (full app)
- **Dev**: `npm run dev` (Vite dev server, port 1420)

## Core Modules

### Frontend — State (Zustand)

| Store | Path | Purpose |
|-------|------|---------|
| `useAppStore` | `src/store/appStore.ts` | Theme, mascot gender, notifications, sidebar, current page |
| `useStreakStore` | `src/store/streakStore.ts` | Streak start/reset/load, duration calculator |
| `useBlockerStore` | `src/store/blockerStore.ts` | Block categories, lock status, custom domains |
| `useAchievementStore` | `src/store/achievementStore.ts` | Achievement progress, unlock tracking |

### Frontend — Data Libraries

| Module | Path | Content |
|--------|------|---------|
| `database` | `src/lib/database.ts` | SQLite init: settings, streaks, block_categories, blocked_domains, achievements, journal_entries, daily_logs, quotes |
| `achievements` | `src/lib/achievements.ts` | 25 achievements: streak(9), blocker(5), journal(5), panic(3), special(3) |
| `blocklists` | `src/lib/blocklists.ts` | 7 categories: adult(150+), social_media(33), gambling(24), news(24), entertainment(19), gaming(19), shopping(15) |
| `quotes` | `src/lib/quotes.ts` | 110 quotes: motivation(30), discipline(30), recovery(25), productivity(25) |
| `mascotDialogues` | `src/lib/mascotDialogues.ts` | Dialogues for: streak milestones, panic, achievements, daily, greetings |

### Backend — Tauri Commands

| Command | Path | Signature |
|---------|------|-----------|
| `apply_blocklist` | `commands/blocker.rs` | `(domains: Vec<String>) -> Result<(), String>` |
| `remove_blocklist` | `commands/blocker.rs` | `() -> Result<(), String>` |
| `get_blocker_status` | `commands/blocker.rs` | `() -> Result<BlockerState, String>` |
| `check_admin` | `commands/blocker.rs` | `() -> Result<bool, String>` |
| `extend_lock` | `commands/blocker.rs` | `(hours: u64) -> Result<String, String>` |
| `get_streak_data` | `commands/streak.rs` | `(start, best, resets) -> Result<StreakData, String>` |
| `save_streak_data` | `commands/streak.rs` | `(start, best, resets) -> Result<StreakData, String>` |

### Backend — Services

| Service | Path | Purpose |
|---------|------|---------|
| `hosts` | `blocker/hosts.rs` | Windows hosts file read/write with `# === TAMASHII START/END ===` markers |
| `watcher` | `blocker/watcher.rs` | Tokio task re-applying hosts entries every 60s |
| `quote_scheduler` | `scheduler/quote_scheduler.rs` | Daily notification at 09:30 with rotating quotes |

## Themes

Three visual themes controlled by `data-theme` attribute on `<html>`:

| Theme | Accent | Background | Font |
|-------|--------|------------|------|
| **Dark** (default) | `#22d3ee` cyan | `#09090b` | Inter |
| **Light** | `#0891b2` teal | `#fafafa` | Inter |
| **Anime** | `#f472b6` pink | `#0d0015` dark purple | Zen Maru Gothic |

Display font: **Orbitron** (headings), Mono font: **JetBrains Mono**

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `DashboardPage` | Home: streak counter, daily quote, quick stats, panic button |
| `/blocker` | `BlockerPage` | Content blocker: categories, lock timer, domain management |
| `/panic` | `PanicPage` | Emergency: breathing exercise, grounding, productive actions |
| `/stats` | `StatsPage` | Statistics: calendar heatmap, streak history, weekly summary |
| `/journal` | `JournalPage` | Journal: entries list, editor, mood tracking |
| `/achievements` | `AchievementsPage` | Achievement gallery with progress tracking |
| `/settings` | `SettingsPage` | Theme, mascot, notifications, autostart |

## Database Schema (SQLite)

7 tables: `settings`, `streaks`, `block_categories`, `blocked_domains`, `achievements`, `journal_entries`, `daily_logs`, `quotes`

## Configuration

| File | Purpose |
|------|---------|
| `tauri.conf.json` | Tauri v2 config: product name, window (1024x700), plugins (sql, notification, autostart, store) |
| `Cargo.toml` | Rust deps: tauri 2, serde, chrono, tokio, tauri-plugin-{sql,notification,autostart,store,log} |
| `package.json` | Node deps: react 19, react-router 7, zustand 5, three.js, @pixiv/three-vrm, framer-motion, gsap, tailwindcss 4, vite 7 |
| `tsconfig.json` | TS: ES2020 target, bundler resolution, `@/*` path alias |
| `vite.config.ts` | Vite 7: React plugin, Tailwind v4 plugin, port 1420 |
| `capabilities/default.json` | Tauri permissions: core, sql, notification, autostart, store |

## Key Dependencies

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.4 | UI framework |
| react-router | ^7.13.0 | Client-side routing |
| zustand | ^5.0.11 | State management |
| @tauri-apps/api | ^2.10.1 | Tauri frontend API |
| @tauri-apps/plugin-sql | ^2.3.2 | SQLite database |
| @tauri-apps/plugin-notification | ^2.3.3 | System notifications |
| @tauri-apps/plugin-store | ^2.4.2 | Key-value store |
| @tauri-apps/plugin-autostart | ^2.5.1 | Launch on startup |
| three | ^0.182.0 | 3D rendering (mascot) |
| @pixiv/three-vrm | ^3.4.5 | VRM model loader |
| @react-three/fiber | ^9.5.0 | React Three.js bridge |
| @react-three/drei | ^10.7.7 | Three.js helpers |
| framer-motion | ^12.34.0 | Animations |
| gsap | ^3.14.2 | Advanced animations |
| lucide-react | ^0.563.0 | Icon library |
| tailwindcss | ^4.1.18 | CSS framework (v4) |
| vite | ^7.3.1 | Build tool |

### Backend (Rust)
| Crate | Version | Purpose |
|-------|---------|---------|
| tauri | 2 | App framework (tray-icon feature) |
| tauri-plugin-sql | 2 | SQLite (sqlite feature) |
| tauri-plugin-notification | 2 | OS notifications |
| tauri-plugin-autostart | 2 | Launch at login |
| tauri-plugin-store | 2 | Persistent KV store |
| tauri-plugin-log | 2 | Logging |
| tokio | 1 | Async runtime (full features) |
| chrono | 0.4 | Date/time (serde feature) |
| serde / serde_json | 1 | Serialization |

## Assets

| Asset | Path | Details |
|-------|------|---------|
| Logo | `public/logo.png` | 1024x1024 Blender-rendered (Cycles), multi-color |
| Girl mascot | `public/models/girl.vrm` + `src/assets/mascot/girl.vrm` | VRM 3D model |
| Boy mascot | `public/models/boy.vrm` + `src/assets/mascot/boy.vrm` | VRM 3D model |
| Fonts | `src/assets/fonts/` | Inter, JetBrains Mono, Orbitron, Zen Maru Gothic (woff2) |
| App icons | `src-tauri/icons/` | 16 variants (png, ico, icns) for all platforms |

## Design Files

| File | Purpose |
|------|---------|
| `design/tamashii_logo_v2.py` | Blender Python script: multi-color logo with kanji, flame, hex shield |
| `design/tamashii_logo.py` | Original monochrome logo script (superseded) |

## Quick Start

```bash
# Install frontend dependencies
cd funtime-app && npm install

# Dev mode (frontend only)
npm run dev

# Dev mode (full Tauri app)
npm run tauri dev

# Production build
npm run tauri build
```

## Platform Support

- **Windows** (primary): Full hosts file blocking with admin elevation
- **Android**: Tauri v2 mobile target (hosts blocking gracefully disabled)
- **macOS/Linux**: Compiles but hosts blocking returns no-op
