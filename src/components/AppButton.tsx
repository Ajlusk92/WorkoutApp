import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';

export function AppButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 14, alignItems: 'center' },
  text: { color: colors.primaryText, fontWeight: '800', fontSize: 16 },
});
