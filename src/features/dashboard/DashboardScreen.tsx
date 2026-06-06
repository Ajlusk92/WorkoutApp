import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import program from '@/data/workoutProgram.json';
import { Card } from '@/components/Card';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { getWeeklyCheckIns } from '@/db/checkinRepository';
import { getWorkoutStats } from '@/db/workoutRepository';
import { coachCalorieAdjustment, targetWeightForWeek } from '@/utils/calculations';
import { ProgramData, WeeklyCheckIn } from '@/types/program';

const typedProgram = program as ProgramData;

export function DashboardScreen() {
  const [checkIns, setCheckIns] = useState<WeeklyCheckIn[]>([]);
  const [stats, setStats] = useState({ sessionCount: 0, totalVolume: 0, bestE1rm: 0 });

  useFocusEffect(useCallback(() => {
    async function load() {
      setCheckIns(await getWeeklyCheckIns());
      setStats(await getWorkoutStats());
    }
    load();
  }, []));

  const setup = typedProgram.setup;
  const start = Number(setup.start_weight);
  const goal = Number(setup.goal_weight);
  const weeks = Number(setup.program_weeks);
  const latestCheckIn = checkIns[checkIns.length - 1];
  const currentWeek = latestCheckIn?.week ?? 1;
  const target = targetWeightForWeek(start, goal, weeks, currentWeek);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{typedProgram.meta.title}</Text>
      <Text style={styles.subtitle}>{typedProgram.meta.subtitle}</Text>

      <View style={styles.grid}>
        <Metric label="Current Week" value={`W${currentWeek}`} />
        <Metric label="Target Weight" value={`${target} lb`} />
        <Metric label="Latest Weight" value={latestCheckIn ? `${latestCheckIn.bodyWeight} lb` : 'Not logged'} />
        <Metric label="Sessions Logged" value={`${stats.sessionCount}`} />
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Coach Recommendation</Text>
        <Text style={styles.body}>{coachCalorieAdjustment(checkIns)}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Training Totals</Text>
        <Text style={styles.body}>Total volume logged: {stats.totalVolume.toLocaleString()} lb</Text>
        <Text style={styles.body}>Best estimated 1RM logged: {stats.bestE1rm || '-'} lb</Text>
        <Text style={styles.body}>Daily steps target: {Number(setup.target_steps).toLocaleString()}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Training Maxes</Text>
        {typedProgram.lifts.map(lift => (
          <Text key={lift.lift} style={styles.body}>{lift.lift}: {lift.trainingMax} lb TM from {lift.currentOneRepMax} lb 1RM</Text>
        ))}
      </Card>
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Card style={styles.metricCard}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metric}>{value}</Text></Card>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 26, fontWeight: '900', marginBottom: 4, color: colors.text },
  subtitle: { color: colors.muted, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { width: '48%', marginBottom: 0 },
  metricLabel: { color: colors.muted, marginBottom: 6, fontWeight: '700' },
  metric: { fontSize: 22, fontWeight: '900', color: colors.text },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 10, color: colors.text },
  body: { fontSize: 15, marginBottom: 6, color: colors.text },
});
