import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import WeightChart from "../components/WeightChart";

<WeightChart />

import { Card, PageTitle, PrimaryButton, Screen, StatCard } from '../components/ui';
import { getDb, getGoals } from '../db/database';
import { calculateGoalForecast, GoalForecast } from '../services/goalForecastEngine';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export function ProgressScreen() {
  const [prs, setPrs] = useState<any[]>([]);
  const [bodyStats, setBodyStats] = useState<any[]>([]);
  const [forecast, setForecast] = useState<GoalForecast | null>(null);

  function load() {
    const db = getDb();
    const goals = getGoals();

    const prRows = db.getAllSync(`
      SELECT *
      FROM pr
      ORDER BY date DESC, id DESC;
    `);

    const bodyRows = db.getAllSync(`
      SELECT *
      FROM body_stats
      ORDER BY date DESC, id DESC;
    `);

    const bodyRowsAsc = db.getAllSync(`
      SELECT *
      FROM body_stats
      ORDER BY date ASC, id ASC;
    `);

    setPrs(prRows);
    setBodyStats(bodyRows);

    setForecast(
      calculateGoalForecast({
        bodyStats: bodyRowsAsc,
        goalWeight: goals.goal_weight,
      })
    );
  }

  useEffect(() => {
    load();
  }, []);

  const latestPr = prs[0];
  const latestBody = bodyStats[0];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 100  }}>
        <PageTitle
          title="Progress"
          subtitle="Track weight, measurements, PRs, and goal pace"
        />

        <PrimaryButton title="Refresh Progress" onPress={load} />

        <View style={{ marginTop: spacing.xl }}>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <StatCard
              label="Weight"
              value={latestBody?.weight ?? '—'}
              helper="latest"
            />
            <StatCard
              label="Waist"
              value={latestBody?.waist ?? '—'}
              helper="latest"
            />
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
            <StatCard
              label="Avg Loss"
              value={
                forecast?.averageWeeklyLoss !== null &&
                forecast?.averageWeeklyLoss !== undefined
                  ? forecast.averageWeeklyLoss.toFixed(2)
                  : '—'
              }
              helper="lb/week"
            />
            <StatCard
              label="Weeks Left"
              value={
                forecast?.estimatedWeeksRemaining !== null &&
                forecast?.estimatedWeeksRemaining !== undefined
                  ? forecast.estimatedWeeksRemaining.toFixed(1)
                  : '—'
              }
              helper="forecast"
            />
          </View>
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Card title="Goal Forecast">
            <Text style={bodyText}>
              Current Weight: {forecast?.currentWeight ?? 'N/A'} lb
            </Text>
            <Text style={bodyText}>
              Goal Weight: {forecast?.goalWeight ?? 'N/A'} lb
            </Text>
            <Text style={bodyText}>
              Remaining:{' '}
              {forecast?.weightRemaining !== null &&
              forecast?.weightRemaining !== undefined
                ? `${forecast.weightRemaining.toFixed(1)} lb`
                : 'N/A'}
            </Text>
            <Text style={bodyText}>
              Estimated Goal Date: {forecast?.estimatedGoalDate ?? 'N/A'}
            </Text>
            <Text style={{ ...mutedText, marginTop: spacing.sm }}>
              {forecast?.message ?? 'Add body stats to calculate forecast.'}
            </Text>
          </Card>
        </View>

        <Card title="Latest PRs">
          {latestPr ? (
            <>
              <Text style={bodyText}>Bench: {latestPr.bench ?? 'N/A'} lb</Text>
              <Text style={bodyText}>Squat: {latestPr.squat ?? 'N/A'} lb</Text>
              <Text style={bodyText}>Deadlift: {latestPr.deadlift ?? 'N/A'} lb</Text>
              <Text style={bodyText}>OHP: {latestPr.ohp ?? 'N/A'} lb</Text>
              <Text style={bodyText}>Row: {latestPr.row ?? 'N/A'} lb</Text>
            </>
          ) : (
            <Text style={mutedText}>No PR records saved yet.</Text>
          )}
        </Card>

        <Card title="Bodyweight History">
          {bodyStats.length === 0 && (
            <Text style={mutedText}>No body stats saved yet.</Text>
          )}

          {bodyStats.map(row => (
            <View key={`body-${row.id}`} style={historyCard}>
              <Text style={historyTitle}>{row.date}</Text>
              <Text style={bodyText}>Weight: {row.weight ?? 'N/A'} lb</Text>
              <Text style={bodyText}>Waist: {row.waist ?? 'N/A'}</Text>
              <Text style={bodyText}>
                Body Fat: {row.body_fat_percent ?? 'N/A'}%
              </Text>
            </View>
          ))}
        </Card>

        <Card title="PR History">
          {prs.length === 0 && <Text style={mutedText}>No PR records saved yet.</Text>}

          {prs.map(row => (
            <View key={`pr-${row.id}`} style={historyCard}>
              <Text style={historyTitle}>{row.date}</Text>
              <Text style={bodyText}>
                Bench {row.bench ?? 'N/A'} | Squat {row.squat ?? 'N/A'} | Deadlift{' '}
                {row.deadlift ?? 'N/A'}
              </Text>
              <Text style={bodyText}>
                OHP {row.ohp ?? 'N/A'} | Row {row.row ?? 'N/A'}
              </Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const bodyText = {
  color: colors.text,
  fontSize: 15,
  lineHeight: 22,
};

const mutedText = {
  color: colors.muted,
  fontSize: 14,
  lineHeight: 20,
};

const historyCard = {
  backgroundColor: colors.background,
  borderRadius: 14,
  padding: spacing.md,
  marginBottom: spacing.md,
  borderWidth: 1,
  borderColor: colors.border,
};

const historyTitle = {
  color: colors.text,
  fontWeight: '800' as const,
  fontSize: 16,
  marginBottom: spacing.xs,
};