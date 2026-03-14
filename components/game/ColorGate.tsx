/**
 * Color gate component.
 * Renders a horizontal bar across the screen with the gate color
 * and a gap at the correct lane position.
 */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLOR_MAP, type GameColor } from '@/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GATE_HEIGHT = 60;
const GAP_PADDING = 8;

interface ColorGateProps {
  color: GameColor;
  y: number;
  laneIndex: number;
  laneWidth: number;
  passed: boolean;
}

export function ColorGate({ color, y, laneIndex, laneWidth, passed }: ColorGateProps) {
  const gateColor = COLOR_MAP[color];
  const gapStart = laneIndex * laneWidth + GAP_PADDING;
  const gapEnd = (laneIndex + 1) * laneWidth - GAP_PADDING;

  return (
    <View
      style={[styles.container, { top: y }]}
      pointerEvents="none"
      accessibilityLabel={`${color} gate`}
    >
      {/* Left side of gate */}
      {gapStart > 0 && (
        <View
          style={[
            styles.gateBar,
            {
              left: 0,
              width: gapStart,
              backgroundColor: gateColor,
              opacity: passed ? 0.3 : 0.85,
            },
          ]}
        />
      )}
      {/* Right side of gate */}
      {gapEnd < SCREEN_WIDTH && (
        <View
          style={[
            styles.gateBar,
            {
              left: gapEnd,
              width: SCREEN_WIDTH - gapEnd,
              backgroundColor: gateColor,
              opacity: passed ? 0.3 : 0.85,
            },
          ]}
        />
      )}
      {/* Gap indicator — subtle glow showing where to go */}
      {!passed && (
        <View
          style={[
            styles.gapIndicator,
            {
              left: gapStart,
              width: gapEnd - gapStart,
              borderColor: gateColor,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: GATE_HEIGHT,
  },
  gateBar: {
    position: 'absolute',
    top: 0,
    height: GATE_HEIGHT,
    borderRadius: 4,
  },
  gapIndicator: {
    position: 'absolute',
    top: 0,
    height: GATE_HEIGHT,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 4,
    opacity: 0.4,
  },
});
