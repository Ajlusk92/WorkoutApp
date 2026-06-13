export type ProgressionResult = {
  exercise: string;
  targetWeight: number | null;
  completed: boolean;
  nextWeight: number | null;
  recommendation: string;
};

function parseActualReps(actualLog: string) {
  return actualLog
    .split(',')
    .map(part => part.trim())
    .map(part => {
      const match = part.match(/x\s*(\d+)/i);
      return match ? Number(match[1]) : null;
    })
    .filter((value): value is number => value !== null);
}

function getIncreaseAmount(exercise: string) {
  const lower = exercise.toLowerCase();

  if (lower.includes('deadlift')) return 10;
  if (lower.includes('squat')) return 5;
  if (lower.includes('bench')) return 5;
  if (lower.includes('press') || lower.includes('ohp')) return 2.5;
  if (lower.includes('row')) return 5;

  return 5;
}

export function evaluateProgression(input: {
  exercise: string;
  sets: number;
  reps: string | number;
  targetWeight: string | number | null;
  actualLog: string;
}): ProgressionResult {
  const targetReps = Number(input.reps);
  const targetWeight = Number(input.targetWeight);
  const actualReps = parseActualReps(input.actualLog);

  if (!targetReps || !targetWeight || actualReps.length === 0) {
    return {
      exercise: input.exercise,
      targetWeight: Number.isFinite(targetWeight) ? targetWeight : null,
      completed: false,
      nextWeight: Number.isFinite(targetWeight) ? targetWeight : null,
      recommendation: 'Unable to calculate progression. Check reps and target weight.',
    };
  }

  const requiredSetsCompleted = actualReps.length >= input.sets;
  const allRepsHit = actualReps.slice(0, input.sets).every(reps => reps >= targetReps);
  const completed = requiredSetsCompleted && allRepsHit;

  const increase = getIncreaseAmount(input.exercise);
  const nextWeight = completed ? targetWeight + increase : targetWeight;

  return {
    exercise: input.exercise,
    targetWeight,
    completed,
    nextWeight,
    recommendation: completed
      ? `Success. Increase ${input.exercise} to ${nextWeight} next exposure.`
      : `Repeat ${targetWeight} for ${input.exercise} next exposure.`,
  };
}