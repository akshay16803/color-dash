/**
 * Combo indicator that shows animated combo multiplier during gameplay.
 */
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { THEME } from '@/config/theme';

interface ComboIndicatorProps {
  combo: number;
  playerY: number;
}

export function ComboIndicator({ combo, playerY }: ComboIndicatorProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (combo > 1) {
      scale.value = withSequence(
        withSpring(1.4, { damping: 4, stiffness: 300 }),
        withSpring(1, { damping: 8, stiffness: 200 })
      );
    }
  }, [combo]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (combo <= 1) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        { top: playerY - 50 },
      ]}
    >
      <Text style={styles.text}>🔥 {combo}x</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  text: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '800',
    color: THEME.colors.warning,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
