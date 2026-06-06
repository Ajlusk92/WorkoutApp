import React, { useMemo, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import program from '@/data/workoutProgram.json';
import { AppButton } from '@/components/AppButton';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { saveWorkoutLog } from '@/db/workoutRepository';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { ProgramData, WorkoutSetLog } from '@/types/program';
import { estimatedOneRepMax, totalVolume } from '@/utils/calculations';

const typedProgram = program as ProgramData;

export function WorkoutLoggerScreen() {
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState('Mon');
  const rows = useMemo(() => typedProgram.trainingPlan.filter(r => r.week === week && r.day === day), [week, day]);
  const [setsByExercise, setSetsByExercise] = useState<Record<string, WorkoutSetLog[]>>({});

  const getSets = (exercise: string, target: number | string, setCount: number | string) => {
    if (setsByExercise[exercise]) return setsByExercise[exercise];
    const count = Number(setCount) || 3;
    return Array.from({ length: count }, (_, index) => ({ setNumber: index + 1, targetWeight: Number(target) || undefined, actualWeight: Number(target) || 0, actualReps: 0, completed: false }));
  };

  const updateSet = (exercise: string, sets: WorkoutSetLog[], setNumber: number, field: 'actualWeight' | 'actualReps' | 'rpe', value: string) => {
    const numericValue = Number(value) || 0;
    const updated = sets.map(set => set.setNumber === setNumber ? { ...set, [field]: numericValue, completed: true } : set);
    setSetsByExercise(prev => ({ ...prev, [exercise]: updated }));
  };

  const save = async () => {
    const date = new Date().toISOString();
    for (const row of rows) {
      const sets = getSets(row.exercise, row.targetWt, row.sets);
      await saveWorkoutLog({
        id: `${date}-${week}-${day}-${row.exercise}`,
        date,
        week,
        day,
        session: row.session,
        exercise: row.exercise,
        sets,
        notes: row.progressionRule,
      });
    }
    Alert.alert('Workout saved', `${rows.length} exercises saved to SQLite.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <FlatList horizontal showsHorizontalScrollIndicator={false} data={Array.from({ length: 12 }, (_, i) => i + 1)} keyExtractor={w => String(w)} renderItem={({ item }) => <Chip label={`W${item}`} selected={item === week} onPress={() => setWeek(item)} />} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayRow}>{['Mon', 'Wed', 'Fri'].map(d => <Chip key={d} label={d} selected={d === day} onPress={() => setDay(d)} />)}</ScrollView>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {rows.map(row => {
          const sets = getSets(row.exercise, row.targetWt, row.sets);
          const best = sets.reduce((max, set) => Math.max(max, estimatedOneRepMax(set.actualWeight, set.actualReps)), 0);
          return (
            <Card key={`${row.week}-${row.day}-${row.exercise}`}>
              <Text style={styles.exercise}>{row.exercise}</Text>
              <Text style={styles.detail}>Target {row.targetWt} lb • {row.sets} x {row.reps}</Text>
              {sets.map(set => (
                <View key={set.setNumber} style={styles.setRow}>
                  <Text style={styles.setLabel}>Set {set.setNumber}</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={set.actualWeight ? String(set.actualWeight) : ''} placeholder="Weight" onChangeText={v => updateSet(row.exercise, sets, set.setNumber, 'actualWeight', v)} />
                  <TextInput style={styles.input} keyboardType="numeric" value={set.actualReps ? String(set.actualReps) : ''} placeholder="Reps" onChangeText={v => updateSet(row.exercise, sets, set.setNumber, 'actualReps', v)} />
                  <TextInput style={styles.inputSmall} keyboardType="numeric" value={set.rpe ? String(set.rpe) : ''} placeholder="RPE" onChangeText={v => updateSet(row.exercise, sets, set.setNumber, 'rpe', v)} />
                </View>
              ))}
              <Text style={styles.summary}>Volume: {totalVolume(sets).toLocaleString()} lb • Best e1RM: {best || '-'}</Text>
            </Card>
          );
        })}
        <AppButton title="Save Workout" onPress={save} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filters: { padding: spacing.md, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  dayRow: { marginTop: spacing.sm },
  content: { padding: spacing.lg, paddingBottom: 40 },
  exercise: { fontSize: 20, fontWeight: '900', marginBottom: 4, color: colors.text },
  detail: { color: colors.muted, marginBottom: 10 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  setLabel: { width: 48, fontWeight: '800' },
  input: { flex: 1, backgroundColor: colors.input, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10 },
  inputSmall: { width: 64, backgroundColor: colors.input, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10 },
  summary: { marginTop: 6, fontWeight: '800', color: colors.text },
});
