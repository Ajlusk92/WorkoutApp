import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export function Card({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
