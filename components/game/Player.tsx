/**
 * Player character component.
 * Renders a centered colored ball with color indicator dots below it.
 */
import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { COLOR_MAP, GAME_COLORS, type GameColor } from '@/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PLAYER_SIZE = 30; // 40% smaller than original 50
const INDICATOR_SIZE = 14; // scaled down proportionally
const ACTIVE_INDICATOR_SIZE = 20; // scaled down proportionally
const INDICATOR_SPACING = 8;

interface PlayerProps {
  y: number;
  color: GameColor;
}

export function Player({ y, color }: PlayerProps) {
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    scaleValue.value = withSpring(1.1, { damping: 12, stiffness: 200 }, () => {
      scaleValue.value = withSpring(1, { damping: 12, stiffness: 200 });
    });
  }, [color]);

  const animatedBallStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  // Calculate center position for indicators
  const totalIndicatorWidth =
    GAME_COLORS.length * ACTIVE_INDICATOR_SIZE +
    (GAME_COLORS.length - 1) * INDICATOR_SPACING;
  const indicatorStartX = (SCREEN_WIDTH - totalIndicatorWidth) / 2;

  return (
    <>
      {/* Player ball (centered) */}
      <Animated.View
        style={[
          styles.player,
          animatedBallStyle,
          {
            top: y,
            left: (SCREEN_WIDTH - PLAYER_SIZE) / 2,
            backgroundColor: COLOR_MAP[color],
            shadowColor: COLOR_MAP[color],
          },
        ]}
        accessibilityLabel={`Player ball, color: ${color}`}
      />

      {/* Color indicator dots */}
      {GAME_COLORS.map((col, index) => {
        const isActive = col === color;
        const dotSize = isActive ? ACTIVE_INDICATOR_SIZE : INDICATOR_SIZE;
        const xOffset =
          indicatorStartX +
          index * (ACTIVE_INDICATOR_SIZE + INDICATOR_SPACING) +
          (ACTIVE_INDICATOR_SIZE - dotSize) / 2;

        return (
          <Animated.View
            key={col}
            style={[
              styles.indicator,
              {
                top: y + PLAYER_SIZE + 20,
                left: xOffset,
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: COLOR_MAP[col],
                opacity: isActive ? 1 : 0.4,
              },
            ]}
            accessibilityLabel={`${col} indicator${isActive ? ' (active)' : ''}`}
          />
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: PLAYER_SIZE / 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  indicator: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
});
