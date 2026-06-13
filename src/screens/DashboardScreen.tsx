import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { getActiveProgram, getDb, getGoals } from '../db/database';
import { calculateGoalForecast, GoalForecast } from '../services/goalForecastEngine';
import { getProgramWeek, getScheduledWorkout } from '../services/workoutEngine';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { calculateWeeklyCompliance } from '../services/complianceEngine';
import { branding } from '../theme/branding';
import { Card, HeroCard, PageTitle, PrimaryButton, Screen, StatCard } from '../components/ui';

export function DashboardScreen() {
  const [latestBody, setLatestBody] = useState<any>(null);
  const [latestPr, setLatestPr] = useState<any>(null);
  const [weeklyCardio, setWeeklyCardio] = useState(0);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(0);
  const [goals, setGoals] = useState(getGoals());
  const [activeProgram, setActiveProgramState] = useState<any>(null);
  const [forecast, setForecast] = useState<GoalForecast | null>(null);
  const compliance = calculateWeeklyCompliance({
  strengthLogCount: weeklyWorkouts,
  cardioMinutes: weeklyCardio,
});

  const scheduled = getScheduledWorkout();
  const week = getProgramWeek(activeProgram?.start_date);

  function load() {
    const db = getDb();
    const savedGoals = getGoals();

    setActiveProgramState(getActiveProgram());
    setGoals(savedGoals);

    const body = db.getFirstSync(`
      SELECT *
      FROM body_stats
      ORDER BY date DESC, id DESC
      LIMIT 1;
    `);

    const bodyRows = db.getAllSync(`
      SELECT *
      FROM body_stats
      ORDER BY date ASC, id ASC;
    `);

    setLatestBody(body);

    setForecast(
      calculateGoalForecast({
        bodyStats: bodyRows,
        goalWeight: savedGoals.goal_weight,
      })
    );

    setLatestPr(
      db.getFirstSync(`
        SELECT *
        FROM pr
        ORDER BY date DESC, id DESC
        LIMIT 1;
      `)
    );

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString().slice(0, 10);

    const cardio = db.getFirstSync<{ total: number }>(
      `
      SELECT COALESCE(SUM(time_minutes), 0) AS total
      FROM cardio
      WHERE date >= ?;
      `,
      [startDate]
    );

    const workouts = db.getFirstSync<{ total: number }>(
      `
      SELECT COUNT(*) AS total
      FROM workout_base
      WHERE date >= ?;
      `,
      [startDate]
    );

    setWeeklyCardio(cardio?.total ?? 0);
    setWeeklyWorkouts(workouts?.total ?? 0);
  }

  useEffect(() => {
    load();
  }, []);

  const currentWeight = Number(latestBody?.weight);
  const goalWeight = Number(goals.goal_weight ?? 205);
  const remaining = currentWeight ? currentWeight - goalWeight : null;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 100  }}>
        <PageTitle
          title={branding.appName}
          subtitle={branding.tagline}
        />

        <View style={{ marginBottom: spacing.xl }}>
          <PrimaryButton title="Refresh Dashboard" onPress={load} />
        </View>

        <HeroCard
          title="Cut Goal"
          value={`${latestBody?.weight ?? '—'} lb`}
          subtitle={`Goal: ${goalWeight || '—'} lb • Remaining: ${
            remaining !== null ? `${remaining.toFixed(1)} lb` : '—'
          }`}
          footer={
            forecast?.estimatedGoalDate
              ? `Estimated goal date: ${forecast.estimatedGoalDate}`
              : 'Add more body stats to forecast your goal date.'
          }
        />

        <View style={{ marginTop: spacing.xl }}>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <StatCard
              label="Current"
              value={latestBody?.weight ?? '—'}
              helper="Bodyweight"
            />
            <StatCard
              label="Goal"
              value={goalWeight || '—'}
              helper="Target weight"
            />
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
            <StatCard
              label="Remaining"
              value={remaining !== null ? remaining.toFixed(1) : '—'}
              helper="lb to goal"
            />
            <StatCard
              label="Week"
              value={`${week}/12`}
              helper="Program week"
            />
          </View>
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Card title="Today's Workout">
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>
              {scheduled.label}
            </Text>

            {scheduled.type === 'strength' && (
              <View style={{ marginTop: spacing.md }}>
                {scheduled.exercises.length === 0 && (
                  <Text style={{ color: colors.muted }}>
                    No exercises found for today.
                  </Text>
                )}

                {scheduled.exercises.map((item: any) => (
                  <Text key={item.id} style={{ color: colors.text, marginBottom: 4 }}>
                    {item.exercise}: {item.sets}x{item.reps} @ {item.target_weight || 'N/A'}
                  </Text>
                ))}
              </View>
            )}

            {scheduled.type === 'cardio' && (
              <Text style={{ marginTop: spacing.md, color: colors.text }}>
                Target: {scheduled.targetMinutes} minutes Zone 2 cardio
              </Text>
            )}

            {scheduled.type === 'rest' && (
              <Text style={{ marginTop: spacing.md, color: colors.text }}>
                Recover and prepare for the next training day.
              </Text>
            )}
          </Card>
        </View>

        <Card title="Goal Forecast">
          <Text style={{ color: colors.text }}>
            Average Loss:{' '}
            {forecast?.averageWeeklyLoss !== null && forecast?.averageWeeklyLoss !== undefined
              ? `${forecast.averageWeeklyLoss.toFixed(2)} lb/week`
              : 'N/A'}
          </Text>

          <Text style={{ color: colors.text }}>
            Estimated Goal Date: {forecast?.estimatedGoalDate ?? 'N/A'}
          </Text>

          <Text style={{ marginTop: spacing.sm, color: colors.muted }}>
            {forecast?.message ?? 'Add body stats to calculate forecast.'}
          </Text>
        </Card>

        <Card title="Nutrition Goals">
          <Text>Training Calories: {goals.training_day_calories ?? 'N/A'}</Text>
          <Text>Rest Calories: {goals.rest_day_calories ?? 'N/A'}</Text>
          <Text>Protein: {goals.protein_g ?? 'N/A'}g</Text>
          <Text>Carbs: {goals.carbs_g ?? 'N/A'}g</Text>
          <Text>Fat: {goals.fat_g ?? 'N/A'}g</Text>
        </Card>

        <Card title="Latest PRs">
          {latestPr ? (
            <>
              <Text>Bench: {latestPr.bench ?? 'N/A'} lb</Text>
              <Text>Squat: {latestPr.squat ?? 'N/A'} lb</Text>
              <Text>Deadlift: {latestPr.deadlift ?? 'N/A'} lb</Text>
              <Text>OHP: {latestPr.ohp ?? 'N/A'} lb</Text>
              <Text>Row: {latestPr.row ?? 'N/A'} lb</Text>
            </>
          ) : (
            <Text style={{ color: colors.muted }}>No PRs saved yet.</Text>
          )}
        </Card>

        <Card title="Last 7 Days">
          <Text>Cardio Minutes: {weeklyCardio}</Text>
          <Text>Strength Log Entries: {weeklyWorkouts}</Text>
        </Card>

        <Card title="Weekly Compliance">
          <Text style={{ fontSize: 34, fontWeight: '800', color: colors.primary }}>
            {compliance.compliancePercent}%
          </Text>
          <Text style={{ color: colors.text }}>
            Completed {compliance.completedSessions} of {compliance.scheduledSessions} planned sessions
          </Text>
          <Text style={{ marginTop: spacing.sm, color: colors.muted }}>
            {compliance.message}
          </Text>
        </Card>

        <Card title="Active Program">
          <Text>{activeProgram?.name ?? 'No active program selected'}</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}