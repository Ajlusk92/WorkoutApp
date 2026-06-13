export type WorkoutDayName = 'Mon' | 'Wed' | 'Fri';

export type WorkoutExercise = {
  id: string;
  week: number;
  day: WorkoutDayName;
  session: string;
  exercise: string;
  sets: number;
  reps: number | string;
  percentTrainingMax?: number | null;
  targetWeight: number | string;
  rpeTarget: string;
  progressionRule: string;
  warmUpSets: string;
  notes: string;
};

export type NutritionWeek = {
  week: number;
  phase: string;
  trainingDayCalories: number;
  restDayCalories: number;
  proteinG: number;
  fatG: number;
  trainingCarbsG: number;
  restCarbsG: number;
  refeedCalories: number;
  adjustmentNote: string;
};