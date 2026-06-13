import React from 'react';
import { ScrollView } from 'react-native';
import { Card, PageTitle, Screen, SecondaryButton } from '../components/ui';
import { spacing } from '../theme/spacing';

export function MoreScreen({ navigation }: any) {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 100  }}>
        <PageTitle title="More" subtitle="Additional tools and tracking" />

        <Card title="Tracking">
          <SecondaryButton title="Nutrition" onPress={() => navigation.navigate('Nutrition')} />
          <SecondaryButton title="History" onPress={() => navigation.navigate('History')} />
        </Card>

        <Card title="App">
          <SecondaryButton title="Settings" onPress={() => navigation.navigate('Settings')} />
        </Card>
      </ScrollView>
    </Screen>
  );
}