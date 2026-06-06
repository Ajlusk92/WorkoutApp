import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AppButton } from '@/components/AppButton';
import { Card } from '@/components/Card';
import { getWeeklyCheckIns, saveWeeklyCheckIn } from '@/db/checkinRepository';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { WeeklyCheckIn } from '@/types/program';
import program from '@/data/workoutProgram.json';
import { ProgramData } from '@/types/program';
import { targetWeightForWeek } from '@/utils/calculations';

const typedProgram = program as ProgramData;

export function WeeklyCheckInScreen() {
  const [history, setHistory] = useState<WeeklyCheckIn[]>([]);
  const [week, setWeek] = useState('1');
  const [bodyWeight, setBodyWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [averageSteps, setAverageSteps] = useState('');

  useFocusEffect(useCallback(() => { getWeeklyCheckIns().then(setHistory); }, []));

  const setup = typedProgram.setup;
  const target = targetWeightForWeek(Number(setup.start_weight), Number(setup.goal_weight), Number(setup.program_weeks), Number(week));

  const save = async () => {
    const entry: WeeklyCheckIn = {
      id: `week-${week}`,
      week: Number(week),
      date: new Date().toISOString(),
      bodyWeight: Number(bodyWeight),
      waist: waist ? Number(waist) : undefined,
      averageSteps: averageSteps ? Number(averageSteps) : undefined,
    };
    await saveWeeklyCheckIn(entry);
    setHistory(await getWeeklyCheckIns());
    Alert.alert('Check-in saved', `Week ${week} saved.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.title}>Weekly Check-In</Text>
        <Text style={styles.help}>Target for week {week}: {target} lb</Text>
        <Field label="Week" value={week} onChangeText={setWeek} />
        <Field label="Body Weight" value={bodyWeight} onChangeText={setBodyWeight} />
        <Field label="Waist" value={waist} onChangeText={setWaist} />
        <Field label="Average Steps" value={averageSteps} onChangeText={setAverageSteps} />
        <AppButton title="Save Check-In" onPress={save} />
      </Card>
      <Text style={styles.historyTitle}>History</Text>
      {history.map(item => (
        <Card key={item.id}>
          <Text style={styles.history}>Week {item.week}: {item.bodyWeight} lb • Waist {item.waist ?? '-'} • Steps {item.averageSteps ?? '-'}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

function Field({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput style={styles.input} keyboardType="numeric" value={value} onChangeText={onChangeText} /></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 22, fontWeight: '900', color: colors.text, marginBottom: 6 },
  help: { color: colors.muted, marginBottom: spacing.md },
  field: { marginBottom: spacing.md },
  label: { fontWeight: '800', marginBottom: 6, color: colors.text },
  input: { backgroundColor: colors.input, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12 },
  historyTitle: { fontSize: 18, fontWeight: '900', marginVertical: spacing.sm, color: colors.text },
  history: { color: colors.text },
});
