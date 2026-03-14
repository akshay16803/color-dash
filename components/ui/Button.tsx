/**
 * Reusable button component with multiple variants and sizes.
 */
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { THEME } from '@/config/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  accessibilityLabel,
  style,
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
    >
      <Text
        style={[
          styles.text,
          textSizeStyles[size],
          variantTextStyles[variant],
          disabled && styles.disabledText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: THEME.borderRadius.md,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '700',
  },
  disabledText: {
    color: THEME.colors.textMuted,
  },
});

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { paddingHorizontal: 12, paddingVertical: 8 },
  md: { paddingHorizontal: 20, paddingVertical: 12 },
  lg: { paddingHorizontal: 28, paddingVertical: 16, minWidth: 200 },
};

const textSizeStyles: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: THEME.fontSize.sm },
  md: { fontSize: THEME.fontSize.md },
  lg: { fontSize: THEME.fontSize.lg },
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: THEME.colors.accent },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: THEME.colors.danger },
};

const variantTextStyles: Record<ButtonVariant, TextStyle> = {
  primary: { color: THEME.colors.text },
  secondary: { color: THEME.colors.textSecondary },
  ghost: { color: THEME.colors.textSecondary },
  danger: { color: THEME.colors.text },
};
