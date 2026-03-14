/**
 * League management hook.
 * Determines the player's current league, evaluates promotion/relegation
 * after each game, and syncs results to Firestore.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  getLeagueForScore,
  getLeagueById,
  type LeagueDefinition,
  type LeagueName,
} from '@/config/leagues';
import { loadPlayerStats } from '@/utils/storage';
import {
  writeUserStats,
  getDisplayName,
  isFirebaseAuthenticated,
} from '@/utils/firestore';
import { Analytics } from '@/utils/analytics';

export interface LeagueResult {
  league: LeagueDefinition;
  promoted: boolean;
  relegated: boolean;
  previousLeague: LeagueName;
}

export function useLeague() {
  const [currentLeague, setCurrentLeague] = useState<LeagueDefinition>(
    getLeagueById('bronze')
  );

  // Load current league from saved stats on mount
  useEffect(() => {
    loadPlayerStats().then((stats) => {
      const league = getLeagueForScore(stats.highScore);
      setCurrentLeague(league);
    });
  }, []);

  /**
   * Evaluate the player's league after a game.
   * Compares the new score against the current league to determine
   * if the player was promoted, relegated (not possible with high-score-only),
   * or stayed the same.
   */
  const evaluateAfterGame = useCallback(
    async (newHighScore: number): Promise<LeagueResult> => {
      const previousLeague = currentLeague.id;
      const newLeague = getLeagueForScore(newHighScore);

      const promoted = newLeague.minScore > currentLeague.minScore;
      const relegated = newLeague.minScore < currentLeague.minScore;

      // Update current league state
      setCurrentLeague(newLeague);

      // Track league change in analytics
      if (promoted || relegated) {
        Analytics.leagueChanged(previousLeague, newLeague.id);
      }

      // Sync to Firestore if authenticated
      if (isFirebaseAuthenticated()) {
        try {
          const displayName = await getDisplayName();
          await writeUserStats(newHighScore, newLeague.id, displayName);
        } catch {
          // Silently fail — local state is still correct
        }
      }

      return {
        league: newLeague,
        promoted,
        relegated,
        previousLeague,
      };
    },
    [currentLeague]
  );

  return {
    currentLeague,
    evaluateAfterGame,
  };
}
