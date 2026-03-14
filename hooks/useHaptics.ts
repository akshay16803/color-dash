/**
 * Haptic feedback hook for Color Dash.
 * Provides light, medium, and heavy haptic taps.
 * Falls back gracefully if haptics aren't available.
 */
import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

export function useHaptics() {
  const lightTap = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics not available
    }
  }, []);

  const mediumTap = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics not available
    }
  }, []);

  const heavyTap = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Haptics not available
    }
  }, []);

  const successNotification = useCallback(() => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Haptics not available
    }
  }, []);

  const errorNotification = useCallback(() => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // Haptics not available
    }
  }, []);

  return {
    lightTap,
    mediumTap,
    heavyTap,
    successNotification,
    errorNotification,
  };
}
