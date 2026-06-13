import { NutritionWeek, WorkoutExercise } from '../types/workout';

export const START_WEIGHT = 228;
export const GOAL_WEIGHT = 205;
export const PROGRAM_WEEKS = 12;

export const nutritionWeeks: NutritionWeek[] = [
  {
    week: 1,
    phase: 'Foundation',
    trainingDayCalories: 2700,
    restDayCalories: 2400,
    proteinG: 230,
    fatG: 80,
    trainingCarbsG: 265,
    restCarbsG: 190,
    refeedCalories: 3000,
    adjustmentNote: 'Hold target'
  }
];

export const workoutProgram: WorkoutExercise[] = [
  {
    id: 'w1-mon-squat',
    week: 1,
    day: 'Mon',
    session: 'A',
    exercise: 'Squat',
    sets: 5,
    reps: 5,
    percentTrainingMax: 0.7,
    targetWeight: 175,
    rpeTarget: '7-8',
    progressionRule: 'Add 5 lb next exposure if all reps hit',
    warmUpSets: '45% x5, 60% x3, 75% x2, then work sets',
    notes: 'Log actual sets'
  },
  {
    id: 'w1-mon-bench',
    week: 1,
    day: 'Mon',
    session: 'A',
    exercise: 'Bench Press',
    sets: 5,
    reps: 5,
    percentTrainingMax: 0.7,
    targetWeight: 200,
    rpeTarget: '7-8',
    progressionRule: 'Add 5 lb next exposure if all reps hit',
    warmUpSets: '45% x5, 60% x3, 75% x2, then work sets',
    notes: 'Log actual sets'
  },
  {
    id: 'w1-mon-row',
    week: 1,
    day: 'Mon',
    session: 'A',
    exercise: 'Barbell Row',
    sets: 5,
    reps: 5,
    percentTrainingMax: 0.7,
    targetWeight: 145,
    rpeTarget: '7',
    progressionRule: 'Add 5 lb when clean',
    warmUpSets: 'Ramp up gradually',
    notes: 'Strict form'
  }
];