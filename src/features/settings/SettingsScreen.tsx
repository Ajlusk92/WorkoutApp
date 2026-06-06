import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Card } from '@/components/Card';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.title}>Production Setup Notes</Text>
        <Text style={styles.body}>1. Replace placeholder Firebase values in src/config/firebase.ts.</Text>
        <Text style={styles.body}>2. Keep SQLite as the offline-first source of truth.</Text>
        <Text style={styles.body}>3. Add authentication before enabling cloud sync.</Text>
        <Text style={styles.body}>4. Use EAS Build when ready to create Android and iOS release builds.</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 22, fontWeight: '900', color: colors.text, marginBottom: spacing.md },
  body: { color: colors.text, marginBottom: spacing.sm },
});
