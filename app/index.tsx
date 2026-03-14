/**
 * Home screen for Color Dash.
 * Shows title, player stats, and navigation buttons.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { THEME } from '@/config/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useHaptics } from '@/hooks/useHaptics';
import { useLeague } from '@/hooks/useLeague';
import { loadPlayerStats } from '@/utils/storage';
import { logScreenView } from '@/utils/analytics';
import { Button } from '@/components/ui/Button';
import type { PlayerStats } from '@/types';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const haptics = useHaptics();
  const { currentLeague } = useLeague();
  const [stats, setStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    logScreenView('Home');
    loadPlayerStats().then(setStats);
  }, []);

  const handlePlay = () => {
    haptics.mediumTap();
    router.push('/game');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={styles.titleSection} entering={FadeIn.duration(600)}>
        <Text style={styles.title}>{t('home_title')}</Text>
        <Text style={styles.subtitle}>{t('home_subtitle')}</Text>
      </Animated.View>

      {/* Stats row */}
      {stats && stats.totalGamesPlayed > 0 && (
        <Animated.View
          style={styles.statsContainer}
          entering={FadeInDown.delay(200).duration(400)}
        >
          <View style={styles.statColumn}>
            <Text style={styles.statValue}>{stats.highScore}</Text>
            <Text style={styles.statLabel}>{t('home_best')}</Text>
          </View>
          <View style={styles.statColumn}>
            <Text style={styles.statValue}>{stats.totalGamesPlayed}</Text>
            <Text style={styles.statLabel}>{t('home_games')}</Text>
          </View>
          <View style={styles.statColumn}>
            <Text style={styles.statValue}>{currentLeague.icon}</Text>
            <Text style={styles.statLabel}>{t('home_league')}</Text>
          </View>
        </Animated.View>
      )}

      {/* Play button */}
      <Animated.View
        style={styles.playSection}
        entering={FadeInDown.delay(400).duration(400)}
      >
        <Pressable
          style={styles.playButton}
          onPress={handlePlay}
          accessibilityRole="button"
          accessibilityLabel={t('home_play')}
        >
          <Text style={styles.playButtonText}>{t('home_play')}</Text>
        </Pressable>
      </Animated.View>

      {/* Secondary buttons */}
      <Animated.View
        style={styles.secondaryButtons}
        entering={FadeInDown.delay(600).duration(400)}
      >
        <Button
          title="🏆"
          onPress={() => {
            haptics.lightTap();
            router.push('/leaderboard');
          }}
          variant="ghost"
          size="md"
          accessibilityLabel={t('a11y_leaderboardButton')}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xxl,
  },
  title: {
    fontSize: THEME.fontSize.hero,
    fontWeight: '900',
    color: THEME.colors.text,
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: THEME.spacing.xl,
    marginBottom: THEME.spacing.xxl,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    backgroundColor: THEME.colors.surfaceLight,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  statColumn: {
    alignItems: 'center',
    minWidth: 60,
  },
  statValue: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '800',
    color: THEME.colors.accent,
  },
  statLabel: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  playSection: {
    marginBottom: THEME.spacing.xl,
  },
  playButton: {
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: THEME.borderRadius.full,
    ...THEME.shadow.md,
  },
  playButtonText: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '800',
    color: THEME.colors.text,
    letterSpacing: 2,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
});
