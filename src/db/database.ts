import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('reg_park_cut_coach.db');

export async function initializeDatabase() {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workout_logs (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      week INTEGER NOT NULL,
      day TEXT NOT NULL,
      session TEXT NOT NULL,
      exercise TEXT NOT NULL,
      sets_json TEXT NOT NULL,
      volume INTEGER NOT NULL DEFAULT 0,
      best_e1rm INTEGER NOT NULL DEFAULT 0,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS weekly_checkins (
      id TEXT PRIMARY KEY NOT NULL,
      week INTEGER NOT NULL UNIQUE,
      date TEXT NOT NULL,
      body_weight REAL NOT NULL,
      waist REAL,
      average_steps INTEGER,
      training_calories INTEGER,
      rest_calories INTEGER,
      bench_e1rm INTEGER,
      squat_e1rm INTEGER,
      deadlift_e1rm INTEGER
    );

    CREATE TABLE IF NOT EXISTS bodyweight_logs (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL UNIQUE,
      body_weight REAL NOT NULL
    );
  `);
}
