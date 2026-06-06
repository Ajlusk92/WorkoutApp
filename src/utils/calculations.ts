import { WeeklyCheckIn, WorkoutSetLog } from '@/types/program';

export function estimatedOneRepMax(weight: number, reps: number): number {
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30));
}

export function totalVolume(sets: WorkoutSetLog[]): number {
  return sets.reduce((sum, set) => sum + (set.actualWeight || 0) * (set.actualReps || 0), 0);
}

export function targetWeightForWeek(start: number, goal: number, weeks: number, week: number): number {
  if (weeks <= 1) return goal;
  return Math.round((start - ((start - goal) / (weeks - 1)) * (week - 1)) * 10) / 10;
}

export function weeklyLossFlag(loss: number, min = 1.2, max = 2.3): 'Too Slow' | 'On Pace' | 'Too Fast' {
  if (loss < min) return 'Too Slow';
  if (loss > max) return 'Too Fast';
  return 'On Pace';
}

export function coachCalorieAdjustment(checkIns: WeeklyCheckIn[]): string {
  if (checkIns.length < 2) return 'Log at least two check-ins to receive a calorie adjustment.';
  const sorted = [...checkIns].sort((a, b) => a.week - b.week);
  const last = sorted[sorted.length - 1];
  const prior = sorted[sorted.length - 2];
  const loss = prior.bodyWeight - last.bodyWeight;
  const flag = weeklyLossFlag(loss);
  if (flag === 'Too Slow') return 'Loss is below target. If this happens 2 weeks in a row, reduce calories by 150/day or add 10–15 min zone 2.';
  if (flag === 'Too Fast') return 'Loss is above target. Watch strength and recovery; consider adding 100–150 calories on training days.';
  return 'On pace. Keep calories and cardio steady.';
}
