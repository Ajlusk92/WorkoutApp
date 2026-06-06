import { db } from './database';
import { WorkoutLog, WorkoutSetLog } from '@/types/program';
import { estimatedOneRepMax, totalVolume } from '@/utils/calculations';

function bestE1rm(sets: WorkoutSetLog[]): number {
  return sets.reduce((best, set) => Math.max(best, estimatedOneRepMax(set.actualWeight, set.actualReps)), 0);
}

export async function saveWorkoutLog(log: WorkoutLog): Promise<void> {
  const volume = totalVolume(log.sets);
  const e1rm = bestE1rm(log.sets);
  await db.runAsync(
    `INSERT OR REPLACE INTO workout_logs
      (id, date, week, day, session, exercise, sets_json, volume, best_e1rm, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [log.id, log.date, log.week, log.day, log.session, log.exercise, JSON.stringify(log.sets), volume, e1rm, log.notes ?? null]
  );
}

export async function getWorkoutLogs(): Promise<WorkoutLog[]> {
  const rows = await db.getAllAsync<any>('SELECT * FROM workout_logs ORDER BY date DESC, exercise ASC');
  return rows.map(row => ({
    id: row.id,
    date: row.date,
    week: row.week,
    day: row.day,
    session: row.session,
    exercise: row.exercise,
    sets: JSON.parse(row.sets_json),
    notes: row.notes ?? undefined,
  }));
}

export async function getWorkoutStats(): Promise<{ sessionCount: number; totalVolume: number; bestE1rm: number }> {
  const row = await db.getFirstAsync<any>('SELECT COUNT(*) as sessionCount, COALESCE(SUM(volume),0) as totalVolume, COALESCE(MAX(best_e1rm),0) as bestE1rm FROM workout_logs');
  return { sessionCount: row?.sessionCount ?? 0, totalVolume: row?.totalVolume ?? 0, bestE1rm: row?.bestE1rm ?? 0 };
}
