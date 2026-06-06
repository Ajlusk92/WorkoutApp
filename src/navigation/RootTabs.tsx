import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '@/features/dashboard/DashboardScreen';
import { WorkoutPlanScreen } from '@/features/workouts/WorkoutPlanScreen';
import { WorkoutLoggerScreen } from '@/features/workouts/WorkoutLoggerScreen';
import { WeeklyCheckInScreen } from '@/features/checkins/WeeklyCheckInScreen';
import { NutritionScreen } from '@/features/nutrition/NutritionScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';

const Tab = createBottomTabNavigator();

export function RootTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerTitleStyle: { fontWeight: '800' }, tabBarLabelStyle: { fontWeight: '700' } }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Plan" component={WorkoutPlanScreen} />
      <Tab.Screen name="Log" component={WorkoutLoggerScreen} />
      <Tab.Screen name="Check-In" component={WeeklyCheckInScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
