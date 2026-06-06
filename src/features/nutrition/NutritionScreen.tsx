import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import program from '@/data/workoutProgram.json';
import { Card } from '@/components/Card';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { ProgramData } from '@/types/program';

const typedProgram = program as ProgramData;

export function NutritionScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nutrition Plan</Text>
      {typedProgram.nutritionPlan.map(row => (
        <Card key={row.week}>
          <Text style={styles.heading}>Week {row.week}: {row.phase}</Text>
          <Text style={styles.body}>Training day: {row.trainingDayCalories} cal</Text>
          <Text style={styles.body}>Rest day: {row.restDayCalories} cal</Text>
          <Text style={styles.body}>Protein {row.proteinG}g • Fat {row.fatG}g</Text>
          <Text style={styles.body}>Carbs: {row.trainingCarbsG}g training / {row.restCarbsG}g rest</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: '900', color: colors.text, marginBottom: spacing.md },
  heading: { fontSize: 17, fontWeight: '900', color: colors.text, marginBottom: 6 },
  body: { color: colors.text, marginBottom: 4 },
});
