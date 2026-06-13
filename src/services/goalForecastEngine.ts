export type GoalForecast = {
  currentWeight: number | null;
  goalWeight: number | null;
  weightRemaining: number | null;
  averageWeeklyLoss: number | null;
  estimatedWeeksRemaining: number | null;
  estimatedGoalDate: string | null;
  message: string;
};

export function calculateGoalForecast(input: {
  bodyStats: any[];
  goalWeight: number | null;
}): GoalForecast {
  const validWeights = input.bodyStats
    .filter(row => row.weight !== null && row.weight !== undefined)
    .map(row => ({
      date: new Date(row.date),
      weight: Number(row.weight),
    }))
    .filter(row => !Number.isNaN(row.weight))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (validWeights.length === 0 || !input.goalWeight) {
    return {
      currentWeight: null,
      goalWeight: input.goalWeight,
      weightRemaining: null,
      averageWeeklyLoss: null,
      estimatedWeeksRemaining: null,
      estimatedGoalDate: null,
      message: 'Add at least one bodyweight entry and a goal weight.',
    };
  }

  const current = validWeights[validWeights.length - 1];
  const first = validWeights[0];

  const weightRemaining = current.weight - input.goalWeight;

  if (weightRemaining <= 0) {
    return {
      currentWeight: current.weight,
      goalWeight: input.goalWeight,
      weightRemaining,
      averageWeeklyLoss: null,
      estimatedWeeksRemaining: 0,
      estimatedGoalDate: current.date.toISOString().slice(0, 10),
      message: 'Goal reached.',
    };
  }

  if (validWeights.length < 2) {
    return {
      currentWeight: current.weight,
      goalWeight: input.goalWeight,
      weightRemaining,
      averageWeeklyLoss: null,
      estimatedWeeksRemaining: null,
      estimatedGoalDate: null,
      message: 'Add more weigh-ins to calculate a forecast.',
    };
  }

  const daysBetween = Math.max(
    1,
    Math.round((current.date.getTime() - first.date.getTime()) / 86400000)
  );

  const totalLoss = first.weight - current.weight;
  const averageWeeklyLoss = totalLoss / (daysBetween / 7);

  if (averageWeeklyLoss <= 0) {
    return {
      currentWeight: current.weight,
      goalWeight: input.goalWeight,
      weightRemaining,
      averageWeeklyLoss,
      estimatedWeeksRemaining: null,
      estimatedGoalDate: null,
      message: 'Weight trend is not moving toward the goal yet.',
    };
  }

  const estimatedWeeksRemaining = weightRemaining / averageWeeklyLoss;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + Math.ceil(estimatedWeeksRemaining * 7));

  return {
    currentWeight: current.weight,
    goalWeight: input.goalWeight,
    weightRemaining,
    averageWeeklyLoss,
    estimatedWeeksRemaining,
    estimatedGoalDate: estimatedDate.toISOString().slice(0, 10),
    message: `Estimated goal date: ${estimatedDate.toISOString().slice(0, 10)}`,
  };
}