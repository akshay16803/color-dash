/**
 * In-game score display.
 * Shows current score and combo counter at the top of the screen.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '@/config/theme';

interface ScoreDisplayProps {
  score: number;
  combo: number;
}

export function ScoreDisplay({ score, combo }: ScoreDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.score}>{score}</Text>
      {combo > 1 && (
        <View style={styles.comboBadge}>
          <Text style={styles.comboText}>×{combo}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  score: {
    fontSize: THEME.fontSize.xxl,
    fontWeight: '900',
    color: THEME.colors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  comboBadge: {
    backgroundColor: THEME.colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    marginTop: 4,
  },
  comboText: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '800',
    color: '#1A1A2E',
  },
});
