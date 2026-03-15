/**
 * Firebase Analytics integration with fallback dev logging.
 * All analytics calls are safe to call even without Firebase initialized.
 */
import { isFirebaseAvailable } from '@/config/firebase';

let analyticsModule: any = null;

/**
 * Initialize analytics. Call once at app startup.
 */
export async function initAnalytics(): Promise<void> {
  if (!isFirebaseAvailable()) {
    console.log('[Analytics] Firebase not available — using dev logging');
    return;
  }

  try {
    const mod = require('@react-native-firebase/analytics');
    analyticsModule = mod.default();
    console.log('[Analytics] Firebase Analytics initialized');
  } catch {
    console.log('[Analytics] Failed to initialize — using dev logging');
  }
}

/**
 * Log a custom analytics event.
 */
export async function logEvent(
  name: string,
  params?: Record<string, string | number | boolean>
): Promise<void> {
  if (analyticsModule) {
    try {
      await analyticsModule.logEvent(name, params);
    } catch {
      // Silently fail
    }
  } else if (__DEV__) {
    console.log(`[Analytics] ${name}`, params ?? '');
  }
}

/**
 * Log a screen view event.
 */
export async function logScreenView(screenName: string): Promise<void> {
  if (analyticsModule) {
    try {
      await analyticsModule.logScreenView({
        screen_name: screenName,
        screen_class: screenName,
      });
    } catch {
      // Silently fail
    }
  } else if (__DEV__) {
    console.log(`[Analytics] Screen: ${screenName}`);
  }
}

// Pre-defined event helpers
export const Analytics = {
  gameStarted: () => logEvent('game_started'),
  gameOver: (score: number, gatesPassed: number, combo: number) =>
    logEvent('game_over', { score, gates_passed: gatesPassed, max_combo: combo }),
  newHighScore: (score: number) => logEvent('new_high_score', { score }),
  leaderboardViewed: (league: string) =>
    logEvent('leaderboard_viewed', { league }),
  leagueChanged: (from: string, to: string) =>
    logEvent('league_changed', { from_league: from, to_league: to }),
};
