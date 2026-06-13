import { getActiveProgram, getProgramExercises } from '../db/database';

export type ScheduledWorkout =
  | { type: 'strength'; label: string; exercises: any[] }
  | { type: 'cardio'; label: string; targetMinutes: number }
  | { type: 'rest'; label: string };

export function getProgramWeek(startDate?: string | null) {
  const start = startDate ? new Date(startDate) : new Date();
  const now = new Date();

  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / 86400000));

  return Math.min(12, Math.floor(diffDays / 7) + 1);
}

export function getScheduledWorkout(): ScheduledWorkout {
  const day = new Date().getDay();
  const activeProgram = getActiveProgram();
  const week = getProgramWeek(activeProgram?.start_date);

  if (day === 1 || day === 3 || day === 5) {
    const strengthDay = day === 1 ? 'Mon' : day === 3 ? 'Wed' : 'Fri';

    const exercises = activeProgram
      ? getProgramExercises(activeProgram.id, week, strengthDay)
      : [];

    return {
      type: 'strength',
      label:
        day === 1
          ? 'Monday Strength - Session A'
          : day === 3
            ? 'Wednesday Strength - Session B'
            : 'Friday Strength - Session C',
      exercises,
    };
  }

  if (day === 2 || day === 4) {
    return {
      type: 'cardio',
      label: day === 2 ? 'Tuesday Cardio' : 'Thursday Cardio',
      targetMinutes: 45,
    };
  }

  if (day === 6) {
    return {
      type: 'cardio',
      label: 'Saturday Cardio',
      targetMinutes: 60,
    };
  }

  return {
    type: 'rest',
    label: 'Sunday Rest Day',
  };
}

export function getTodayWorkout() {
  const scheduled = getScheduledWorkout();
  return scheduled.type === 'strength' ? scheduled.exercises : [];
}

export function getCurrentNutrition() {
  return {
    week: 1,
    phase: 'User Goals',
    trainingDayCalories: 2700,
    restDayCalories: 2400,
    proteinG: 230,
    fatG: 80,
    trainingCarbsG: 265,
    restCarbsG: 190,
    refeedCalories: 3000,
    adjustmentNote: 'Controlled from Settings goals',
  };
}