import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import {
  applyProgression,
  getPendingProgressions,
  saveCardioLog,
  saveExerciseProgression,
  saveWorkoutLog,
} from '../db/database';

import { Card, Field, PageTitle, PrimaryButton, Screen, SecondaryButton } from '../components/ui';
import { evaluateProgression, ProgressionResult } from '../services/progressionEngine';
import { getScheduledWorkout } from '../services/workoutEngine';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export function WorkoutScreen() {
  const scheduled = getScheduledWorkout();

  const [logs, setLogs] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [cardioMinutes, setCardioMinutes] = useState('');
  const [cardioNotes, setCardioNotes] = useState('');
  const [progressionResults, setProgressionResults] = useState<ProgressionResult[]>([]);
  const [pendingProgressions, setPendingProgressions] = useState<any[]>(getPendingProgressions());

  function updateLog(id: string, value: string) {
    setLogs(current => ({ ...current, [id]: value }));
  }

  function updateNotes(id: string, value: string) {
    setNotes(current => ({ ...current, [id]: value }));
  }

  function applyRecommendation(id: number) {
    applyProgression(id);
    setPendingProgressions(getPendingProgressions());
    Alert.alert('Applied', 'Progression applied to the program.');
  }

  function saveWorkout() {
    const workoutDate = new Date().toISOString().slice(0, 10);

    if (scheduled.type === 'cardio') {
      saveCardioLog({
        date: workoutDate,
        timeMinutes: Number(cardioMinutes) || 0,
        notes: cardioNotes,
      });

      setProgressionResults([]);
      Alert.alert('Saved', 'Cardio session saved.');
      return;
    }

    if (scheduled.type === 'rest') {
      setProgressionResults([]);
      Alert.alert('Rest Day', 'Sunday is a scheduled rest day.');
      return;
    }

    const results: ProgressionResult[] = [];

    scheduled.exercises.forEach((item: any) => {
      const actualLog = logs[String(item.id)]?.trim();

      if (!actualLog) return;

      saveWorkoutLog({
        exerciseId: String(item.id),
        exerciseName: item.exercise,
        workoutDate,
        targetSets: item.sets,
        targetReps: item.reps,
        targetWeight: item.target_weight,
        actualLog,
        notes: notes[String(item.id)] ?? '',
      });

      const progression = evaluateProgression({
        exercise: item.exercise,
        sets: item.sets,
        reps: item.reps,
        targetWeight: item.target_weight,
        actualLog,
      });

      results.push(progression);

      saveExerciseProgression({
        programExerciseId: item.id,
        date: workoutDate,
        exercise: item.exercise,
        targetWeight: progression.targetWeight,
        completed: progression.completed,
        nextWeight: progression.nextWeight,
        recommendation: progression.recommendation,
      });
    });

    setProgressionResults(results);
    setPendingProgressions(getPendingProgressions());

    if (results.length === 0) {
      Alert.alert('Nothing Saved', 'Enter at least one exercise log before saving.');
      return;
    }

    Alert.alert('Saved', 'Workout log saved. Progression updated.');
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 100  }}>
        <PageTitle title="Workout" subtitle={scheduled.label} />

        {scheduled.type === 'rest' && (
          <Card title="Rest Day">
            <Text style={bodyText}>
              No workout scheduled today. Recover, walk, stretch, and prepare for the next training day.
            </Text>
          </Card>
        )}

        {scheduled.type === 'cardio' && (
          <Card title={scheduled.label}>
            <Text style={bodyText}>Target: {scheduled.targetMinutes} minutes Zone 2 cardio</Text>

            <View style={{ marginTop: spacing.lg }}>
              <Field
                label="Actual Minutes"
                value={cardioMinutes}
                onChangeText={setCardioMinutes}
                keyboardType="numeric"
                placeholder="45"
              />

              <Field
                label="Notes"
                value={cardioNotes}
                onChangeText={setCardioNotes}
                placeholder="Pace, heart rate, machine, recovery..."
                multiline
              />
            </View>

            <PrimaryButton title="Save Cardio" onPress={saveWorkout} />
          </Card>
        )}

        {scheduled.type === 'strength' && (
          <>
            {scheduled.exercises.length === 0 && (
              <Card title="No Exercises Found">
                <Text style={mutedText}>
                  No exercises are scheduled for this active program today.
                </Text>
              </Card>
            )}

            {scheduled.exercises.map((item: any) => (
              <Card key={item.id} title={item.exercise}>
                <View style={targetBox}>
                  <Text style={targetText}>
                    {item.sets || '—'} x {item.reps || '—'} @ {item.target_weight || 'N/A'}
                  </Text>
                  <Text style={mutedText}>RPE Target: {item.rpe_target || 'N/A'}</Text>
                </View>

                {item.warmup_sets ? (
                  <Text style={bodyText}>Warm-up: {item.warmup_sets}</Text>
                ) : null}

                {item.progression_rule ? (
                  <Text style={bodyText}>Rule: {item.progression_rule}</Text>
                ) : null}

                <View style={{ marginTop: spacing.lg }}>
                  <Field
                    label="Actual Sets"
                    value={logs[String(item.id)] ?? ''}
                    onChangeText={value => updateLog(String(item.id), value)}
                    placeholder="175x5, 175x5, 175x5, 175x5, 175x5"
                    multiline
                  />

                  <Field
                    label="Notes"
                    value={notes[String(item.id)] ?? ''}
                    onChangeText={value => updateNotes(String(item.id), value)}
                    placeholder="Bar speed, pain, form, RPE..."
                    multiline
                  />
                </View>
              </Card>
            ))}

            <PrimaryButton title="Save Workout" onPress={saveWorkout} />
          </>
        )}

        {progressionResults.length > 0 && (
          <Card title="Progression Results">
            {progressionResults.map(result => (
              <View key={result.exercise} style={{ marginBottom: spacing.md }}>
                <Text style={sectionTitle}>{result.exercise}</Text>
                <Text style={bodyText}>{result.recommendation}</Text>
              </View>
            ))}
          </Card>
        )}

        {pendingProgressions.length > 0 && (
          <Card title="Pending Progressions">
            {pendingProgressions.map(item => (
              <View key={item.id} style={pendingCard}>
                <Text style={sectionTitle}>{item.exercise}</Text>
                <Text style={bodyText}>{item.recommendation}</Text>
                <Text style={mutedText}>
                  Target: {item.target_weight ?? 'N/A'} → Next: {item.next_weight ?? 'N/A'}
                </Text>

                <SecondaryButton
                  title="Apply Progression"
                  onPress={() => applyRecommendation(item.id)}
                />
              </View>
            ))}
          </Card>
        )}
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
  lineHeight: 20,
};

const sectionTitle = {
  color: colors.text,
  fontSize: 16,
  fontWeight: '800' as const,
  marginBottom: spacing.xs,
};

const targetBox = {
  backgroundColor: colors.surfaceAlt,
  borderRadius: 14,
  padding: spacing.md,
  marginBottom: spacing.md,
};

const targetText = {
  color: colors.primary,
  fontSize: 18,
  fontWeight: '800' as const,
};

const pendingCard = {
  backgroundColor: colors.background,
  borderRadius: 14,
  padding: spacing.md,
  marginBottom: spacing.md,
  borderWidth: 1,
  borderColor: colors.border,
};