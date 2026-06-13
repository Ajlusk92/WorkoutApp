import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Card, PageTitle, PrimaryButton, Screen } from '../components/ui';
import { getCardioLogs, getWorkoutLogs } from '../db/database';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export function HistoryScreen() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [cardio, setCardio] = useState<any[]>([]);

  function load() {
    setWorkouts(getWorkoutLogs());
    setCardio(getCardioLogs());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 100  }}>
        <PageTitle
          title="History"
          subtitle="Review completed workouts and cardio sessions"
        />

        <PrimaryButton title="Refresh History" onPress={load} />

        <View style={{ marginTop: spacing.xl }}>
          <Card title="Strength Logs">
            {workouts.length === 0 && (
              <Text style={mutedText}>No strength logs yet.</Text>
            )}

            {workouts.map(log => (
              <View key={`w-${log.id}`} style={historyCard}>
                <Text style={historyTitle}>{log.exercise_name}</Text>
                <Text style={bodyText}>Date: {log.workout_date}</Text>
                <Text style={bodyText}>
                  Target Weight: {log.target_weight ?? 'N/A'}
                </Text>
                <Text style={bodyText}>Notes: {log.notes || 'None'}</Text>
              </View>
            ))}
          </Card>
        </View>

        <Card title="Cardio Logs">
          {cardio.length === 0 && (
            <Text style={mutedText}>No cardio logs yet.</Text>
          )}

          {cardio.map(log => (
            <View key={`c-${log.id}`} style={historyCard}>
              <Text style={historyTitle}>Cardio</Text>
              <Text style={bodyText}>Date: {log.date}</Text>
              <Text style={bodyText}>Time: {log.time_minutes} minutes</Text>
              <Text style={bodyText}>Distance: {log.distance ?? 'N/A'}</Text>
              <Text style={bodyText}>Pace: {log.pace || 'N/A'}</Text>
              <Text style={bodyText}>Notes: {log.notes || 'None'}</Text>
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