import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import { Card, Field, PageTitle, PrimaryButton, Screen } from '../components/ui';
import {
  getGoals,
  saveBodyStats,
  saveGoals,
  savePrRecord,
} from '../db/database';
import { spacing } from '../theme/spacing';

export function SettingsScreen() {
  const today = new Date().toISOString().slice(0, 10);

  const [profile, setProfile] = useState({
    first: '',
    last: '',
    email: '',
  });

  const [goals, setGoals] = useState({
    goal_weight: '',
    training_day_calories: '',
    rest_day_calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
  });

  const [prs, setPrs] = useState({
    date: today,
    squat: '',
    deadlift: '',
    bench: '',
    ohp: '',
    row: '',
  });

  const [body, setBody] = useState({
    date: today,
    weight: '',
    waist: '',
    bicep: '',
    chest: '',
    shoulders: '',
    neck: '',
    quad: '',
    calf: '',
    bmi: '',
    bodyFatPercent: '',
  });

  useEffect(() => {
    const savedGoals = getGoals();

    setGoals({
      goal_weight: String(savedGoals.goal_weight ?? ''),
      training_day_calories: String(savedGoals.training_day_calories ?? ''),
      rest_day_calories: String(savedGoals.rest_day_calories ?? ''),
      protein_g: String(savedGoals.protein_g ?? ''),
      carbs_g: String(savedGoals.carbs_g ?? ''),
      fat_g: String(savedGoals.fat_g ?? ''),
    });
  }, []);

  function saveGoalSettings() {
    saveGoals({
      goal_weight: Number(goals.goal_weight) || null,
      training_day_calories: Number(goals.training_day_calories) || null,
      rest_day_calories: Number(goals.rest_day_calories) || null,
      protein_g: Number(goals.protein_g) || null,
      carbs_g: Number(goals.carbs_g) || null,
      fat_g: Number(goals.fat_g) || null,
    });

    Alert.alert('Saved', 'Goals updated.');
  }

  function savePrs() {
    savePrRecord({
      date: prs.date,
      squat: Number(prs.squat) || undefined,
      deadlift: Number(prs.deadlift) || undefined,
      bench: Number(prs.bench) || undefined,
      ohp: Number(prs.ohp) || undefined,
      row: Number(prs.row) || undefined,
    });

    Alert.alert('Saved', 'PR record saved.');
  }

  function saveBody() {
    saveBodyStats({
      date: body.date,
      weight: Number(body.weight) || undefined,
      waist: Number(body.waist) || undefined,
      bicep: Number(body.bicep) || undefined,
      chest: Number(body.chest) || undefined,
      shoulders: Number(body.shoulders) || undefined,
      neck: Number(body.neck) || undefined,
      quad: Number(body.quad) || undefined,
      calf: Number(body.calf) || undefined,
      bmi: Number(body.bmi) || undefined,
      bodyFatPercent: Number(body.bodyFatPercent) || undefined,
    });

    Alert.alert('Saved', 'Body stats saved.');
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 100  }}>
        <PageTitle
          title="Settings"
          subtitle="Manage goals, PRs, body stats, and profile information"
        />

        <Card title="Profile">
          <Field
            label="First Name"
            value={profile.first}
            onChangeText={value => setProfile({ ...profile, first: value })}
            placeholder="First name"
          />

          <Field
            label="Last Name"
            value={profile.last}
            onChangeText={value => setProfile({ ...profile, last: value })}
            placeholder="Last name"
          />

          <Field
            label="Email"
            value={profile.email}
            onChangeText={value => setProfile({ ...profile, email: value })}
            keyboardType="email-address"
            placeholder="email@example.com"
          />

          <PrimaryButton
            title="Save Profile"
            onPress={() => Alert.alert('Coming Soon', 'Profile saving will be added next.')}
          />
        </Card>

        <Card title="Goals">
          <Field
            label="Goal Weight"
            value={goals.goal_weight}
            onChangeText={value => setGoals({ ...goals, goal_weight: value })}
            keyboardType="numeric"
            placeholder="205"
          />

          <Field
            label="Training Day Calories"
            value={goals.training_day_calories}
            onChangeText={value =>
              setGoals({ ...goals, training_day_calories: value })
            }
            keyboardType="numeric"
            placeholder="2700"
          />

          <Field
            label="Rest Day Calories"
            value={goals.rest_day_calories}
            onChangeText={value => setGoals({ ...goals, rest_day_calories: value })}
            keyboardType="numeric"
            placeholder="2400"
          />

          <Field
            label="Protein Goal"
            value={goals.protein_g}
            onChangeText={value => setGoals({ ...goals, protein_g: value })}
            keyboardType="numeric"
            placeholder="230"
          />

          <Field
            label="Carb Goal"
            value={goals.carbs_g}
            onChangeText={value => setGoals({ ...goals, carbs_g: value })}
            keyboardType="numeric"
            placeholder="265"
          />

          <Field
            label="Fat Goal"
            value={goals.fat_g}
            onChangeText={value => setGoals({ ...goals, fat_g: value })}
            keyboardType="numeric"
            placeholder="80"
          />

          <PrimaryButton title="Save Goals" onPress={saveGoalSettings} />
        </Card>

        <Card title="Current PRs">
          <Field
            label="Date"
            value={prs.date}
            onChangeText={value => setPrs({ ...prs, date: value })}
            placeholder="YYYY-MM-DD"
          />

          <Field
            label="Squat PR"
            value={prs.squat}
            onChangeText={value => setPrs({ ...prs, squat: value })}
            keyboardType="numeric"
            placeholder="275"
          />

          <Field
            label="Deadlift PR"
            value={prs.deadlift}
            onChangeText={value => setPrs({ ...prs, deadlift: value })}
            keyboardType="numeric"
            placeholder="315"
          />

          <Field
            label="Bench PR"
            value={prs.bench}
            onChangeText={value => setPrs({ ...prs, bench: value })}
            keyboardType="numeric"
            placeholder="315"
          />

          <Field
            label="OHP PR"
            value={prs.ohp}
            onChangeText={value => setPrs({ ...prs, ohp: value })}
            keyboardType="numeric"
            placeholder="135"
          />

          <Field
            label="Row PR"
            value={prs.row}
            onChangeText={value => setPrs({ ...prs, row: value })}
            keyboardType="numeric"
            placeholder="185"
          />

          <PrimaryButton title="Save PR Record" onPress={savePrs} />
        </Card>

        <Card title="Body Stats">
          <Field
            label="Date"
            value={body.date}
            onChangeText={value => setBody({ ...body, date: value })}
            placeholder="YYYY-MM-DD"
          />

          <Field
            label="Weight"
            value={body.weight}
            onChangeText={value => setBody({ ...body, weight: value })}
            keyboardType="numeric"
            placeholder="228"
          />

          <Field
            label="Waist"
            value={body.waist}
            onChangeText={value => setBody({ ...body, waist: value })}
            keyboardType="numeric"
            placeholder="40"
          />

          <Field
            label="Bicep"
            value={body.bicep}
            onChangeText={value => setBody({ ...body, bicep: value })}
            keyboardType="numeric"
          />

          <Field
            label="Chest"
            value={body.chest}
            onChangeText={value => setBody({ ...body, chest: value })}
            keyboardType="numeric"
          />

          <Field
            label="Shoulders"
            value={body.shoulders}
            onChangeText={value => setBody({ ...body, shoulders: value })}
            keyboardType="numeric"
          />

          <Field
            label="Neck"
            value={body.neck}
            onChangeText={value => setBody({ ...body, neck: value })}
            keyboardType="numeric"
          />

          <Field
            label="Quad"
            value={body.quad}
            onChangeText={value => setBody({ ...body, quad: value })}
            keyboardType="numeric"
          />

          <Field
            label="Calf"
            value={body.calf}
            onChangeText={value => setBody({ ...body, calf: value })}
            keyboardType="numeric"
          />

          <Field
            label="BMI"
            value={body.bmi}
            onChangeText={value => setBody({ ...body, bmi: value })}
            keyboardType="numeric"
          />

          <Field
            label="Body Fat %"
            value={body.bodyFatPercent}
            onChangeText={value => setBody({ ...body, bodyFatPercent: value })}
            keyboardType="numeric"
          />

          <PrimaryButton title="Save Body Stats" onPress={saveBody} />
        </Card>
      </ScrollView>
    </Screen>
  );
}