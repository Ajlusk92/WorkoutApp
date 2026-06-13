export type ComplianceResult = {
  scheduledSessions: number;
  completedSessions: number;
  compliancePercent: number;
  message: string;
};

export function calculateWeeklyCompliance(input: {
  strengthLogCount: number;
  cardioMinutes: number;
}): ComplianceResult {
  const scheduledStrengthDays = 3;
  const scheduledCardioDays = 3;
  const scheduledSessions = scheduledStrengthDays + scheduledCardioDays;

  const completedStrengthSessions = Math.min(input.strengthLogCount, scheduledStrengthDays);
  const completedCardioSessions = input.cardioMinutes >= 150 ? scheduledCardioDays : Math.floor(input.cardioMinutes / 45);

  const completedSessions = Math.min(
    scheduledSessions,
    completedStrengthSessions + completedCardioSessions
  );

  const compliancePercent = Math.round((completedSessions / scheduledSessions) * 100);

  return {
    scheduledSessions,
    completedSessions,
    compliancePercent,
    message:
      compliancePercent >= 85
        ? 'Excellent consistency this week.'
        : compliancePercent >= 65
          ? 'Solid week. Keep building momentum.'
          : 'Focus on completing the next scheduled session.',
  };
}