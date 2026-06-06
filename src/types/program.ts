export type DayCode = 'Mon' | 'Wed' | 'Fri' | string;

export type TrainingRow = {
  week: number;
  day: DayCode;
  session: string;
  exercise: string;
  sets: number | string;
  reps: number | string;
  percentTrainingMax?: number | null;
  targetWt: number | string;
  rpeTarget: string;
  progressionRule: string;
  warmUpSets: string;
  notes: string;
};

export type NutritionRow = {
  week: number;
  phase: string;
  trainingDayCalories: number;
  restDayCalories: number;
  proteinG: number;
  fatG: number;
  trainingCarbsG: number;
  restCarbsG: number;
  refeedCalories?: number;
  coachNotes?: string;
};

export type Lift = {
  lift: string;
  currentOneRepMax: number;
  trainingMaxPercent: number;
  trainingMax: number;
  notes?: string;
};

export type ProgramData = {
  meta: { title: string; subtitle: string; sourceWorkbook: string };
  setup: Record<string, number | string>;
  lifts: Lift[];
  trainingPlan: TrainingRow[];
  nutritionPlan: NutritionRow[];
  cardioRecovery: unknown[];
  mobility: unknown[];
  progressionRules: unknown[];
};

export type WorkoutSetLog = {
  setNumber: number;
  targetWeight?: number;
  actualWeight: number;
  actualReps: number;
  rpe?: number;
  completed: boolean;
};

export type WorkoutLog = {
  id: string;
  date: string;
  week: number;
  day: DayCode;
  exercise: string;
  session: string;
  sets: WorkoutSetLog[];
  notes?: string;
};

export type WeeklyCheckIn = {
  id: string;
  week: number;
  date: string;
  bodyWeight: number;
  waist?: number;
  averageSteps?: number;
  trainingCalories?: number;
  restCalories?: number;
  benchE1rm?: number;
  squatE1rm?: number;
  deadliftE1rm?: number;
};
