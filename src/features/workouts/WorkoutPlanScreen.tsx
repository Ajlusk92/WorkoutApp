import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import program from '@/data/workoutProgram.json';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { ProgramData, TrainingRow } from '@/types/program';

const typedProgram = program as ProgramData;
const plan = typedProgram.trainingPlan;

export function WorkoutPlanScreen() {
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState('Mon');
  const rows = useMemo(() => plan.filter(r => r.week === week && r.day === day), [week, day]);

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <FlatList horizontal showsHorizontalScrollIndicator={false} data={Array.from({ length: 12 }, (_, i) => i + 1)} keyExtractor={w => String(w)} renderItem={({ item }) => <Chip label={`W${item}`} selected={item === week} onPress={() => setWeek(item)} />} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayRow}>{['Mon', 'Wed', 'Fri'].map(d => <Chip key={d} label={d} selected={d === day} onPress={() => setDay(d)} />)}</ScrollView>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={rows}
        keyExtractor={(item, index) => `${item.week}-${item.day}-${item.exercise}-${index}`}
        renderItem={({ item }) => <WorkoutCard row={item} />}
      />
    </View>
  );
}

function WorkoutCard({ row }: { row: TrainingRow }) {
  return (
    <Card>
      <Text style={styles.exercise}>{row.exercise}</Text>
      <Text style={styles.detail}>{row.session} • {row.sets} x {row.reps} • Target {row.targetWt} lb • RPE {row.rpeTarget}</Text>
      <Text style={styles.note}>{row.progressionRule}</Text>
      <Text style={styles.warmup}>Warm-up: {row.warmUpSets || 'As needed'}</Text>
      {row.notes ? <Text style={styles.warmup}>Notes: {row.notes}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filters: { padding: spacing.md, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  dayRow: { marginTop: spacing.sm },
  list: { padding: spacing.lg, paddingBottom: 40 },
  exercise: { fontSize: 20, fontWeight: '900', color: colors.text, marginBottom: 6 },
  detail: { color: colors.text, marginBottom: 8 },
  note: { color: colors.muted, marginBottom: 8 },
  warmup: { color: colors.muted, fontSize: 13, marginBottom: 3 },
});
