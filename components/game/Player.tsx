/**
 * Player character component.
 * Renders a colored circle that slides between lanes.
 */
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { COLOR_MAP, type GameColor } from '@/types';

const PLAYER_SIZE = 40;

interface PlayerProps {
  lane: number;
  laneWidth: number;
  y: number;
  color: GameColor;
}

export function Player({ lane, laneWidth, y, color }: PlayerProps) {
  const translateX = useSharedValue(lane * laneWidth + laneWidth / 2 - PLAYER_SIZE / 2);

  useEffect(() => {
    translateX.value = withSpring(
      lane * laneWidth + laneWidth / 2 - PLAYER_SIZE / 2,
      { damping: 15, stiffness: 300 }
    );
  }, [lane, laneWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.player,
        animatedStyle,
        {
          top: y,
          backgroundColor: COLOR_MAP[color],
          shadowColor: COLOR_MAP[color],
        },
      ]}
      accessibilityLabel={`Player, color: ${color}`}
    />
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
});
