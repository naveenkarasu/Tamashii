// SQLite database setup for FunTime productivity app
// Uses @tauri-apps/plugin-sql to manage a local SQLite database.

import Database from '@tauri-apps/plugin-sql';

/**
 * Initialize the FunTime SQLite database.
 * Creates all required tables if they do not already exist and returns the
 * database connection instance for further queries.
 */
export async function initDatabase(): Promise<Database> {
  const db = await Database.load('sqlite:tamashii.db');

  // ── settings ─────────────────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // ── streaks ──────────────────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS streaks (
      id         INTEGER PRIMARY KEY,
      start_date TEXT,
      end_date   TEXT,
      days       INTEGER
    );
  `);

  // ── block_categories ─────────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS block_categories (
      id              TEXT PRIMARY KEY,
      name            TEXT,
      icon            TEXT,
      is_enabled      INTEGER,
      is_locked       INTEGER,
      lock_expires_at TEXT
    );
  `);

  // ── blocked_domains ──────────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS blocked_domains (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      domain      TEXT,
      category_id TEXT
    );
  `);

  // ── achievements ─────────────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS achievements (
      id          TEXT PRIMARY KEY,
      unlocked_at TEXT,
      progress    INTEGER DEFAULT 0
    );
  `);

  // ── journal_entries ──────────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT,
      content    TEXT,
      mood       TEXT,
      created_at TEXT,
      updated_at TEXT
    );
  `);

  // ── daily_logs ───────────────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS daily_logs (
      date            TEXT PRIMARY KEY,
      had_streak      INTEGER,
      was_reset       INTEGER,
      panic_used      INTEGER,
      journal_written INTEGER
    );
  `);

  // ── quotes ───────────────────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS quotes (
      id       INTEGER PRIMARY KEY,
      text     TEXT,
      author   TEXT,
      category TEXT
    );
  `);

  return db;
}
