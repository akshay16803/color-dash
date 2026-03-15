/**
 * Color gate component.
 * Renders a full-width horizontal line (thin bar).
 */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLOR_MAP, type GameColor } from '@/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GATE_HEIGHT = 8;
const HORIZONTAL_PADDING = 16;

interface ColorGateProps {
  color: GameColor;
  y: number;
  passed: boolean;
}

export function ColorGate({ color, y, passed }: ColorGateProps) {
  const gateColor = COLOR_MAP[color];

  return (
    <View
      style={[
        styles.gateBar,
        {
          top: y,
          backgroundColor: gateColor,
          opacity: passed ? 0.2 : 0.9,
        },
      ]}
      pointerEvents="none"
      accessibilityLabel={`${color} gate`}
    />
  );
}

const styles = StyleSheet.create({
  gateBar: {
    position: 'absolute',
    left: HORIZONTAL_PADDING,
    right: HORIZONTAL_PADDING,
    height: GATE_HEIGHT,
    borderRadius: 2,
  },
});
