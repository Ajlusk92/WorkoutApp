import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { RootTabs } from './src/navigation/RootTabs';
import { initializeDatabase } from './src/db/database';
import { seedProgramIfNeeded } from './src/db/seedProgram';
import { colors } from './src/theme/colors';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function boot() {
      await initializeDatabase();
      await seedProgramIfNeeded();
      setReady(true);
    }
    boot();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootTabs />
    </NavigationContainer>
  );
}
