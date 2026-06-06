import { db } from './database';
import { WeeklyCheckIn } from '@/types/program';

export async function saveWeeklyCheckIn(checkIn: WeeklyCheckIn): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO weekly_checkins
      (id, week, date, body_weight, waist, average_steps, training_calories, rest_calories, bench_e1rm, squat_e1rm, deadlift_e1rm)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      checkIn.id,
      checkIn.week,
      checkIn.date,
      checkIn.bodyWeight,
      checkIn.waist ?? null,
      checkIn.averageSteps ?? null,
      checkIn.trainingCalories ?? null,
      checkIn.restCalories ?? null,
      checkIn.benchE1rm ?? null,
      checkIn.squatE1rm ?? null,
      checkIn.deadliftE1rm ?? null,
    ]
  );
}

export async function getWeeklyCheckIns(): Promise<WeeklyCheckIn[]> {
  const rows = await db.getAllAsync<any>('SELECT * FROM weekly_checkins ORDER BY week ASC');
  return rows.map(row => ({
    id: row.id,
    week: row.week,
    date: row.date,
    bodyWeight: row.body_weight,
    waist: row.waist ?? undefined,
    averageSteps: row.average_steps ?? undefined,
    trainingCalories: row.training_calories ?? undefined,
    restCalories: row.rest_calories ?? undefined,
    benchE1rm: row.bench_e1rm ?? undefined,
    squatE1rm: row.squat_e1rm ?? undefined,
    deadliftE1rm: row.deadlift_e1rm ?? undefined,
  }));
}
