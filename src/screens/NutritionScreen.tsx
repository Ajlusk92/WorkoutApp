import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Card, Field, PageTitle, PrimaryButton, Screen, StatCard } from '../components/ui';
import { getGoals, getNutritionLogs, saveNutritionLog } from '../db/database';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export function NutritionScreen() {
  const today = new Date().toISOString().slice(0, 10);
  const [goals, setGoals] = useState(getGoals());

  const [form, setForm] = useState({
    date: today,
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const [logs, setLogs] = useState<any[]>([]);

  function load() {
    setGoals(getGoals());
    setLogs(getNutritionLogs());
  }

  useEffect(() => {
    load();
  }, []);

  function save() {
    saveNutritionLog({
      date: form.date,
      calories: Number(form.calories) || undefined,
      protein: Number(form.protein) || undefined,
      carbs: Number(form.carbs) || undefined,
      fat: Number(form.fat) || undefined,
    });

    Alert.alert('Saved', 'Nutrition log saved.');

    setForm({
      date: today,
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    });

    load();
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 100  }}>
        <PageTitle
          title="Nutrition"
          subtitle="Track calories and macros against your goals"
        />

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <StatCard
            label="Training"
            value={goals.training_day_calories ?? '—'}
            helper="Calories"
          />
          <StatCard
            label="Rest"
            value={goals.rest_day_calories ?? '—'}
            helper="Calories"
          />
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
          <StatCard label="Protein" value={goals.protein_g ?? '—'} helper="grams" />
          <StatCard label="Carbs" value={goals.carbs_g ?? '—'} helper="grams" />
        </View>

        <View style={{ marginTop: spacing.md }}>
          <StatCard label="Fat" value={goals.fat_g ?? '—'} helper="grams" />
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Card title="Log Nutrition">
            <Field
              label="Date"
              value={form.date}
              onChangeText={value => setForm({ ...form, date: value })}
              placeholder="YYYY-MM-DD"
            />

            <Field
              label="Calories"
              value={form.calories}
              onChangeText={value => setForm({ ...form, calories: value })}
              keyboardType="numeric"
              placeholder="2700"
            />

            <Field
              label="Protein"
              value={form.protein}
              onChangeText={value => setForm({ ...form, protein: value })}
              keyboardType="numeric"
              placeholder="230"
            />

            <Field
              label="Carbs"
              value={form.carbs}
              onChangeText={value => setForm({ ...form, carbs: value })}
              keyboardType="numeric"
              placeholder="265"
            />

            <Field
              label="Fat"
              value={form.fat}
              onChangeText={value => setForm({ ...form, fat: value })}
              keyboardType="numeric"
              placeholder="80"
            />

            <PrimaryButton title="Save Nutrition" onPress={save} />
          </Card>
        </View>

        <Card title="Recent Logs">
          {logs.length === 0 && (
            <Text style={mutedText}>No nutrition logs yet.</Text>
          )}

          {logs.map(log => (
            <View key={log.id} style={logCard}>
              <Text style={logDate}>{log.date}</Text>
              <Text style={bodyText}>Calories: {log.calories ?? 'N/A'}</Text>
              <Text style={bodyText}>Protein: {log.protein ?? 'N/A'}g</Text>
              <Text style={bodyText}>Carbs: {log.carbs ?? 'N/A'}g</Text>
              <Text style={bodyText}>Fat: {log.fat ?? 'N/A'}g</Text>
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
  lineHeight: 21,
};

const mutedText = {
  color: colors.muted,
  fontSize: 14,
};

const logCard = {
  backgroundColor: colors.background,
  borderRadius: 14,
  padding: spacing.md,
  marginBottom: spacing.md,
  borderWidth: 1,
  borderColor: colors.border,
};

const logDate = {
  color: colors.text,
  fontSize: 16,
  fontWeight: '800' as const,
  marginBottom: spacing.xs,
};