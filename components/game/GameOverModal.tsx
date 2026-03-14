/**
 * Game Over modal with score display, league badge, and guest user prompt.
 * Shows promotion/relegation animations for league changes.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { THEME } from '@/config/theme';
import { useTranslation } from '@/hooks/useTranslation';
import {
  isFirebaseAuthenticated,
  retryAuthentication,
  writeUserStats,
  getDisplayName,
} from '@/utils/firestore';
import { getLeagueForScore } from '@/config/leagues';
import type { GameSession, PlayerStats } from '@/types';
import type { LeagueDefinition, LeagueName } from '@/config/leagues';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface LeagueResult {
  league: LeagueDefinition;
  promoted: boolean;
  relegated: boolean;
  previousLeague: LeagueName;
}

interface GameOverModalProps {
  session: GameSession;
  isNewHighScore: boolean;
  playerStats: PlayerStats | null;
  leagueResult?: LeagueResult | null;
  onRetry: () => void;
  onMainMenu: () => void;
}

export function GameOverModal({
  session,
  isNewHighScore,
  playerStats,
  leagueResult,
  onRetry,
  onMainMenu,
}: GameOverModalProps) {
  const { t } = useTranslation();
  const highScoreScale = useSharedValue(0);
  const leagueBadgeScale = useSharedValue(0);

  // Guest user state: show prompt if not Firebase-authenticated
  const [isGuest, setIsGuest] = useState(!isFirebaseAuthenticated());
  const [retrying, setRetrying] = useState(false);

  /**
   * Attempt to connect the guest user to Firebase and sync their score.
   */
  const handleConnectAndSync = useCallback(async () => {
    setRetrying(true);
    try {
      const success = await retryAuthentication();
      if (success && playerStats) {
        const displayName = await getDisplayName();
        const league = getLeagueForScore(playerStats.highScore);
        await writeUserStats(playerStats.highScore, league.id, displayName);
        setIsGuest(false);
      }
    } catch {
      // Stays guest — user can try again
    } finally {
      setRetrying(false);
    }
  }, [playerStats]);

  useEffect(() => {
    if (isNewHighScore) {
      highScoreScale.value = withDelay(
        400,
        withSpring(1, { damping: 6, stiffness: 150 })
      );
    }
  }, [isNewHighScore]);

  useEffect(() => {
    if (leagueResult?.promoted || leagueResult?.relegated) {
      leagueBadgeScale.value = withDelay(
        600,
        withSequence(
          withSpring(1.15, { damping: 5, stiffness: 200 }),
          withSpring(1, { damping: 8, stiffness: 150 })
        )
      );
    } else if (leagueResult) {
      leagueBadgeScale.value = withDelay(
        500,
        withSpring(1, { damping: 10, stiffness: 200 })
      );
    }
  }, [leagueResult]);

  const highScoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: highScoreScale.value }],
  }));

  const leagueBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: leagueBadgeScale.value }],
  }));

  return (
    <Animated.View style={styles.overlay} entering={FadeIn.duration(300)}>
      <Animated.View style={styles.modal} entering={SlideInDown.springify().damping(12)}>
        {isNewHighScore && (
          <Animated.View style={[styles.newHighScoreBadge, highScoreStyle]}>
            <Text style={styles.newHighScoreText}>{t('gameOver_newBest')}</Text>
          </Animated.View>
        )}

        <Text style={styles.title}>{t('gameOver_title')}</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{session.score}</Text>
            <Text style={styles.statLabel}>{t('gameOver_score')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{session.gatesPassed}</Text>
            <Text style={styles.statLabel}>{t('gameOver_gates')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{session.maxCombo}</Text>
            <Text style={styles.statLabel}>{t('gameOver_bestCombo')}</Text>
          </View>
        </View>

        {/* League Badge */}
        {leagueResult && (
          <Animated.View style={[styles.leagueSection, leagueBadgeStyle]}>
            <View style={[styles.leagueBadge, { borderColor: leagueResult.league.color }]}>
              <Text style={styles.leagueIcon}>{leagueResult.league.icon}</Text>
              <Text style={[styles.leagueName, { color: leagueResult.league.color }]}>
                {leagueResult.league.label}
              </Text>
            </View>
            {leagueResult.promoted && (
              <View style={styles.promotionBadge}>
                <Text style={styles.promotionText}>{t('league_promoted')}</Text>
              </View>
            )}
            {leagueResult.relegated && (
              <View style={styles.relegationBadge}>
                <Text style={styles.relegationText}>{t('league_relegated')}</Text>
              </View>
            )}
          </Animated.View>
        )}

        {playerStats && (
          <View style={styles.allTimeStats}>
            <Text style={styles.allTimeLabel}>
              {t('gameOver_allTimeBest', { highScore: playerStats.highScore, gamesPlayed: playerStats.totalGamesPlayed })}
            </Text>
          </View>
        )}

        {/* Guest user prompt — shown when Firebase auth failed */}
        {isGuest && (
          <View style={styles.guestBanner}>
            <Text style={styles.guestText}>{t('guest_scoreNotSaved')}</Text>
            <Pressable
              style={styles.guestButton}
              onPress={handleConnectAndSync}
              disabled={retrying}
              accessibilityRole="button"
              accessibilityLabel={t('guest_connect')}
            >
              {retrying ? (
                <ActivityIndicator size="small" color={THEME.colors.text} />
              ) : (
                <Text style={styles.guestButtonText}>{t('guest_connect')}</Text>
              )}
            </Pressable>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.retryButton]}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel={t('gameOver_tryAgain')}
          >
            <Text style={styles.buttonText}>{t('gameOver_tryAgain')}</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.menuButton]}
            onPress={onMainMenu}
            accessibilityRole="button"
            accessibilityLabel={t('gameOver_mainMenu')}
          >
            <Text style={[styles.buttonText, styles.menuButtonText]}>{t('gameOver_mainMenu')}</Text>
          </Pressable>
        </View>
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
    zIndex: 100,
  },
  modal: {
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 380,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  newHighScoreBadge: {
    backgroundColor: THEME.colors.warning,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.full,
    marginBottom: 12,
  },
  newHighScoreText: {
    fontSize: THEME.fontSize.md,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: 2,
  },
  title: {
    fontSize: THEME.fontSize.xl,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 70,
  },
  statValue: {
    fontSize: THEME.fontSize.xl,
    fontWeight: '800',
    color: THEME.colors.accent,
  },
  statLabel: {
    fontSize: THEME.fontSize.xs,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  allTimeStats: {
    marginBottom: THEME.spacing.lg,
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    width: '100%',
    alignItems: 'center',
  },
  allTimeLabel: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: THEME.spacing.sm,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  retryButton: {
    backgroundColor: THEME.colors.accent,
  },
  menuButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  buttonText: {
    fontSize: THEME.fontSize.md,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  menuButtonText: {
    color: THEME.colors.textSecondary,
  },
  leagueSection: {
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    gap: 6,
  },
  leagueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  leagueIcon: {
    fontSize: 22,
  },
  leagueName: {
    fontSize: THEME.fontSize.md,
    fontWeight: '800',
    letterSpacing: 1,
  },
  promotionBadge: {
    backgroundColor: THEME.colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
  },
  promotionText: {
    fontSize: THEME.fontSize.xs,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  relegationBadge: {
    backgroundColor: THEME.colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
  },
  relegationText: {
    fontSize: THEME.fontSize.xs,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  guestBanner: {
    width: '100%',
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
    alignItems: 'center',
    gap: 8,
  },
  guestText: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.warning,
    textAlign: 'center',
    lineHeight: 18,
  },
  guestButton: {
    backgroundColor: THEME.colors.warning,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    minWidth: 80,
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: THEME.fontSize.xs,
    fontWeight: '700',
    color: '#1A1A2E',
  },
});
