/**
 * Countdown overlay shown before game starts (3, 2, 1, GO!).
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { THEME } from '@/config/theme';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 8, stiffness: 200 });

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Small delay then fire onComplete
          setTimeout(onComplete, 400);
          return 0;
        }
        // Reset scale animation for each number
        scale.value = 0.5;
        scale.value = withSpring(1, { damping: 8, stiffness: 200 });
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={styles.overlay}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <Animated.View style={animatedStyle}>
        <Text style={styles.count}>
          {count > 0 ? count : 'GO!'}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: THEME.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  count: {
    fontSize: 80,
    fontWeight: '900',
    color: THEME.colors.text,
    textShadowColor: THEME.colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
