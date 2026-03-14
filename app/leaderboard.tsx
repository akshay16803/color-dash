/**
 * Leaderboard screen with league tabs and real-time Firestore data.
 * Shows top 50 players per league with pinned "My Ranking" bar.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { THEME } from '@/config/theme';
import { LEAGUES, type LeagueName, type LeagueDefinition } from '@/config/leagues';
import { useTranslation } from '@/hooks/useTranslation';
import { useLeague } from '@/hooks/useLeague';
import {
  subscribeToLeaderboard,
  getMyRank,
  getCurrentUserId,
  isFirebaseAuthenticated,
  type LeaderboardEntry,
} from '@/utils/firestore';
import { Analytics } from '@/utils/analytics';

/** League tab component */
function LeagueTab({
  league,
  selected,
  onPress,
}: {
  league: LeagueDefinition;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.leagueTab,
        selected && { backgroundColor: league.color + '20', borderColor: league.color },
      ]}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={`${league.label} league`}
    >
      <Text style={styles.leagueTabIcon}>{league.icon}</Text>
      <Text
        style={[
          styles.leagueTabLabel,
          selected && { color: league.color },
        ]}
      >
        {league.label}
      </Text>
    </Pressable>
  );
}

/** Leaderboard row component */
function LeaderboardRow({
  entry,
  rank,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
}) {
  const medals = ['🥇', '🥈', '🥉'];
  const rankDisplay = rank <= 3 ? medals[rank - 1] : `#${rank}`;

  return (
    <View style={[styles.row, isCurrentUser && styles.rowHighlighted]}>
      <Text style={styles.rowRank}>{rankDisplay}</Text>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>
          {entry.displayName}
          {isCurrentUser && (
            <Text style={styles.youBadge}> YOU</Text>
          )}
        </Text>
      </View>
      <Text style={styles.rowScore}>{entry.bestScore.toLocaleString()}</Text>
    </View>
  );
}

export default function LeaderboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentLeague } = useLeague();
  const [selectedLeague, setSelectedLeague] = useState<LeagueName>(currentLeague.id);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myRank, setMyRank] = useState<number>(-1);
  const [myBestScore, setMyBestScore] = useState(0);
  const unsubRef = useRef<(() => void) | null>(null);
  const userId = getCurrentUserId();
  const isGuest = !isFirebaseAuthenticated();

  const selectedDef = LEAGUES.find((l) => l.id === selectedLeague) ?? LEAGUES[0];

  // Track analytics when league changes
  useEffect(() => {
    Analytics.leaderboardViewed(selectedLeague);
  }, [selectedLeague]);

  // Fetch user's rank in selected league
  useEffect(() => {
    getMyRank(selectedLeague).then(setMyRank);
  }, [selectedLeague, entries]);

  // Find user's best score from entries
  useEffect(() => {
    if (userId) {
      const myEntry = entries.find((e) => e.userId === userId);
      if (myEntry) setMyBestScore(myEntry.bestScore);
    }
  }, [entries, userId]);

  // Subscribe to real-time leaderboard
  const loadLeaderboard = useCallback(() => {
    setLoading(true);
    setError(null);
    setEntries([]);

    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    unsubRef.current = subscribeToLeaderboard(
      selectedLeague,
      50,
      (newEntries) => {
        setEntries(newEntries);
        setLoading(false);
        setError(null);
      },
      (_err) => {
        setLoading(false);
        setError(t('leaderboard_error'));
      }
    );
  }, [selectedLeague, t]);

  useEffect(() => {
    loadLeaderboard();
    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [loadLeaderboard]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeIn.duration(300)}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{t('leaderboard_title')}</Text>
        <View style={styles.backButton} />
      </Animated.View>

      {/* League tabs */}
      <FlatList
        horizontal
        data={LEAGUES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeagueTab
            league={item}
            selected={item.id === selectedLeague}
            onPress={() => setSelectedLeague(item.id)}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.leagueTabs}
        style={styles.leagueTabsContainer}
      />

      {/* Guest banner — shown when user is not Firebase-authenticated */}
      {isGuest && (
        <Animated.View style={styles.guestBanner} entering={FadeIn.duration(300)}>
          <Text style={styles.guestText}>{t('leaderboard_guestHint')}</Text>
        </Animated.View>
      )}

      {/* Leaderboard List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={selectedDef.color} />
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadLeaderboard}>
            <Text style={styles.retryText}>{t('leaderboard_retry')}</Text>
          </Pressable>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>{selectedDef.icon}</Text>
          <Text style={styles.emptyTitle}>{t('leaderboard_empty')}</Text>
          <Text style={styles.emptySubtitle}>{t('leaderboard_emptyHint')}</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.userId}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 30).duration(200)}>
              <LeaderboardRow
                entry={item}
                rank={index + 1}
                isCurrentUser={item.userId === userId}
              />
            </Animated.View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Pinned "My Ranking" bar */}
      {!isGuest && myRank > 0 && (
        <View style={[styles.myRankBar, { borderTopColor: selectedDef.color }]}>
          <View style={styles.myRankLeft}>
            <Text style={styles.myRankLabel}>{t('leaderboard_myRank')}</Text>
            <Text style={[styles.myRankValue, { color: selectedDef.color }]}>
              #{myRank}
            </Text>
          </View>
          <View style={styles.myRankRight}>
            <Text style={styles.myRankScoreLabel}>{t('leaderboard_bestScore')}</Text>
            <Text style={styles.myRankScore}>{myBestScore.toLocaleString()}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: THEME.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: THEME.fontSize.xl,
    color: THEME.colors.text,
  },
  headerTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '800',
    color: THEME.colors.text,
    letterSpacing: 1,
  },
  leagueTabsContainer: {
    maxHeight: 56,
  },
  leagueTabs: {
    paddingHorizontal: THEME.spacing.md,
    gap: 8,
  },
  leagueTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surfaceLight,
  },
  leagueTabIcon: {
    fontSize: 16,
  },
  leagueTabLabel: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: THEME.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: THEME.fontSize.md,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.sm,
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  rowHighlighted: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: THEME.borderRadius.md,
    borderBottomColor: 'transparent',
  },
  rowRank: {
    width: 40,
    fontSize: THEME.fontSize.md,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  rowInfo: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
  },
  rowName: {
    fontSize: THEME.fontSize.md,
    fontWeight: '600',
    color: THEME.colors.text,
  },
  youBadge: {
    fontSize: THEME.fontSize.xs,
    fontWeight: '800',
    color: THEME.colors.accent,
  },
  rowScore: {
    fontSize: THEME.fontSize.md,
    fontWeight: '800',
    color: THEME.colors.accent,
    minWidth: 60,
    textAlign: 'right',
  },
  myRankBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceLight,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    paddingBottom: 34,
    borderTopWidth: 2,
  },
  myRankLeft: {
    gap: 2,
  },
  myRankRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  myRankLabel: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  myRankValue: {
    fontSize: THEME.fontSize.xl,
    fontWeight: '900',
  },
  myRankScore: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  myRankScoreLabel: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  guestBanner: {
    marginHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.25)',
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
  },
  guestText: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.warning,
    textAlign: 'center',
    lineHeight: 18,
  },
  retryButton: {
    marginTop: THEME.spacing.md,
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.full,
  },
  retryText: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '700',
    color: THEME.colors.text,
  },
});
