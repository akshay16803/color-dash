/**
 * Local storage utilities using AsyncStorage.
 * Handles player stats, settings, and game preferences.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PlayerStats } from '@/types';

const KEYS = {
  PLAYER_STATS: 'color_dash_player_stats',
  SETTINGS: 'color_dash_settings',
  DISPLAY_NAME: 'color_dash_display_name',
  LOCALE: 'color_dash_locale',
} as const;

const DEFAULT_STATS: PlayerStats = {
  highScore: 0,
  totalGamesPlayed: 0,
  totalGatesPassed: 0,
  bestCombo: 0,
  averageScore: 0,
  totalScore: 0,
};

/**
 * Load player stats from local storage.
 * Returns default stats if none exist.
 */
export async function loadPlayerStats(): Promise<PlayerStats> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PLAYER_STATS);
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

/**
 * Save player stats to local storage.
 */
export async function savePlayerStats(stats: PlayerStats): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.PLAYER_STATS, JSON.stringify(stats));
  } catch {
    // Silently fail — stats will still be in memory
  }
}

/**
 * Update player stats after a completed game session.
 * Returns the updated stats with new high score flag.
 */
export async function updateStatsAfterGame(
  score: number,
  gatesPassed: number,
  maxCombo: number
): Promise<{ stats: PlayerStats; isNewHighScore: boolean }> {
  const current = await loadPlayerStats();
  const isNewHighScore = score > current.highScore;

  const updated: PlayerStats = {
    highScore: Math.max(current.highScore, score),
    totalGamesPlayed: current.totalGamesPlayed + 1,
    totalGatesPassed: current.totalGatesPassed + gatesPassed,
    bestCombo: Math.max(current.bestCombo, maxCombo),
    totalScore: current.totalScore + score,
    averageScore: Math.round(
      (current.totalScore + score) / (current.totalGamesPlayed + 1)
    ),
  };

  await savePlayerStats(updated);
  return { stats: updated, isNewHighScore };
}

/**
 * Load the user's display name.
 */
export async function loadDisplayName(): Promise<string> {
  try {
    const name = await AsyncStorage.getItem(KEYS.DISPLAY_NAME);
    return name ?? 'Player';
  } catch {
    return 'Player';
  }
}

/**
 * Save the user's display name.
 */
export async function saveDisplayName(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.DISPLAY_NAME, name);
  } catch {
    // Silently fail
  }
}

/**
 * Load saved locale preference.
 */
export async function loadLocale(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.LOCALE);
  } catch {
    return null;
  }
}

/**
 * Save locale preference.
 */
export async function saveLocale(locale: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.LOCALE, locale);
  } catch {
    // Silently fail
  }
}
