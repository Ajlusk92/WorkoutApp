import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {children}
    </View>
  );
}

export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: '900',
          color: colors.text,
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>

      {subtitle && (
        <Text
          style={{
            marginTop: spacing.xs,
            fontSize: 15,
            color: colors.muted,
            lineHeight: 21,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}

export function HeroCard({
  title,
  value,
  subtitle,
  footer,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  footer?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        borderRadius: 26,
        padding: spacing.xl,
        marginBottom: spacing.lg,
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
      }}
    >
      <Text
        style={{
          color: '#BFDBFE',
          fontSize: 14,
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: '#FFFFFF',
          fontSize: 44,
          fontWeight: '900',
          marginTop: spacing.sm,
          letterSpacing: -1,
        }}
      >
        {value}
      </Text>

      {subtitle && (
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 17,
            fontWeight: '700',
            marginTop: spacing.sm,
          }}
        >
          {subtitle}
        </Text>
      )}

      {footer && (
        <Text
          style={{
            color: '#BFDBFE',
            fontSize: 14,
            marginTop: spacing.md,
            lineHeight: 20,
          }}
        >
          {footer}
        </Text>
      )}
    </View>
  );
}

export function Card({
  children,
  title,
  accent = true,
  style,
}: {
  children: React.ReactNode;
  title?: string;
  accent?: boolean;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 22,
          padding: spacing.lg,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 5 },
          elevation: 3,
        },
        style,
      ]}
    >
      {accent && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 5,
            backgroundColor: colors.accent,
          }}
        />
      )}

      {title && (
        <Text
          style={{
            fontSize: 20,
            fontWeight: '900',
            color: colors.text,
            marginBottom: spacing.md,
            letterSpacing: 0.2,
          }}
        >
          {title}
        </Text>
      )}

      {children}
    </View>
  );
}

export function StatCard({
  label,
  value,
  helper,
  accent,
}: {
  label: string;
  value: string | number;
  helper?: string;
  accent?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: accent ? colors.primary : colors.border,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <Text
        style={{
          color: colors.muted,
          fontSize: 12,
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: 0.7,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          marginTop: spacing.xs,
          color: accent ? colors.primary : colors.text,
          fontSize: 27,
          fontWeight: '900',
          letterSpacing: -0.5,
        }}
      >
        {value}
      </Text>

      {helper && (
        <Text
          style={{
            marginTop: spacing.xs,
            color: colors.muted,
            fontSize: 12,
            lineHeight: 17,
          }}
        >
          {helper}
        </Text>
      )}
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: colors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.sm,
        shadowColor: colors.primary,
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <Text
        style={{
          color: '#FFFFFF',
          fontWeight: '900',
          fontSize: 16,
          letterSpacing: 0.3,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: colors.primarySoft,
        borderRadius: 16,
        paddingVertical: 13,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.sm,
      }}
    >
      <Text
        style={{
          color: colors.primary,
          fontWeight: '900',
          fontSize: 15,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function AccentButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: colors.accent,
        borderRadius: 16,
        paddingVertical: 15,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.sm,
        shadowColor: colors.accent,
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <Text
        style={{
          color: '#FFFFFF',
          fontWeight: '900',
          fontSize: 16,
          letterSpacing: 0.3,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function DangerButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: '#FEE2E2',
        borderRadius: 16,
        paddingVertical: 13,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.sm,
      }}
    >
      <Text
        style={{
          color: colors.danger,
          fontWeight: '900',
          fontSize: 15,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text
        style={{
          color: colors.text,
          fontWeight: '800',
          marginBottom: spacing.xs,
          fontSize: 14,
        }}
      >
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={{
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 16,
          padding: 13,
          minHeight: multiline ? 82 : 48,
          color: colors.text,
          fontSize: 15,
        }}
      />
    </View>
  );
}

export function Pill({
  text,
  tone = 'primary',
}: {
  text: string;
  tone?: 'primary' | 'accent' | 'success' | 'danger';
}) {
  const toneMap = {
    primary: {
      background: colors.primarySoft,
      text: colors.primary,
    },
    accent: {
      background: '#FFEDD5',
      text: colors.accent,
    },
    success: {
      background: '#DCFCE7',
      text: colors.success,
    },
    danger: {
      background: '#FEE2E2',
      text: colors.danger,
    },
  };

  const selected = toneMap[tone];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: selected.background,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
      }}
    >
      <Text
        style={{
          color: selected.text,
          fontWeight: '900',
          fontSize: 12,
          letterSpacing: 0.4,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

export function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.md,
      }}
    />
  );
}