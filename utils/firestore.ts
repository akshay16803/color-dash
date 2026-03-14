/**
 * Firestore integration for Color Dash.
 * Handles user authentication, stats syncing, and leaderboard queries.
 * Uses Firebase Anonymous Auth for unique user identification.
 * Falls back to local IDs when Firebase is unavailable.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isFirebaseAvailable } from '@/config/firebase';
import type { LeagueName } from '@/config/leagues';

const USER_ID_KEY = 'color_dash_user_id';
const DISPLAY_NAME_KEY = 'color_dash_display_name';

/** Module-level cached user ID */
let _currentUserId: string | null = null;

/** Leaderboard entry shape */
export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  bestScore: number;
  league: LeagueName;
  updatedAt: number;
}

/**
 * Generate a random local fallback ID (used when Firebase auth fails).
 */
function generateLocalId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `local_${timestamp}_${random}`;
}

/**
 * Get Firebase Auth module lazily.
 */
function getAuth() {
  const auth = require('@react-native-firebase/auth').default;
  return auth();
}

/**
 * Get Firestore module lazily.
 */
function getFirestore() {
  const firestore = require('@react-native-firebase/firestore').default;
  return firestore();
}

/**
 * Ensure the user is authenticated (anonymously).
 * Returns the user ID (Firebase UID or local fallback).
 */
export async function ensureAuthenticated(): Promise<string> {
  // Return cached ID if available
  if (_currentUserId) return _currentUserId;

  // Try loading from storage first
  try {
    const stored = await AsyncStorage.getItem(USER_ID_KEY);
    if (stored) {
      _currentUserId = stored;
      return stored;
    }
  } catch {
    // Continue to auth
  }

  // Try Firebase Anonymous Auth
  if (isFirebaseAvailable()) {
    try {
      const auth = getAuth();

      // Check for existing signed-in user
      if (auth.currentUser) {
        const uid: string = auth.currentUser.uid;
        _currentUserId = uid;
        await AsyncStorage.setItem(USER_ID_KEY, uid);
        return uid;
      }

      // Sign in anonymously
      const credential = await auth.signInAnonymously();
      const uid: string = credential.user.uid;
      _currentUserId = uid;
      await AsyncStorage.setItem(USER_ID_KEY, uid);
      return uid;
    } catch (error) {
      console.warn('[Firestore] Anonymous auth failed, using local ID:', error);
    }
  }

  // Fallback to local ID
  const localId = generateLocalId();
  _currentUserId = localId;
  await AsyncStorage.setItem(USER_ID_KEY, localId);
  return localId;
}

/**
 * Get the current user ID (must call ensureAuthenticated first).
 */
export function getCurrentUserId(): string | null {
  return _currentUserId;
}

/**
 * Check whether the user has a real Firebase UID (not a local fallback).
 * Local fallback IDs start with "local_" and cannot sync to Firestore.
 */
export function isFirebaseAuthenticated(): boolean {
  return _currentUserId != null && !_currentUserId.startsWith('local_');
}

/**
 * Attempt to re-authenticate with Firebase.
 * Useful for retrying after a network error.
 * Returns true if successfully authenticated with Firebase.
 */
export async function retryAuthentication(): Promise<boolean> {
  _currentUserId = null;
  try {
    const auth = getAuth();
    const credential = await auth.signInAnonymously();
    const uid: string = credential.user.uid;
    _currentUserId = uid;
    await AsyncStorage.setItem(USER_ID_KEY, uid);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the user's display name from local storage.
 */
export async function getDisplayName(): Promise<string> {
  try {
    const name = await AsyncStorage.getItem(DISPLAY_NAME_KEY);
    return name ?? 'Player';
  } catch {
    return 'Player';
  }
}

/**
 * Set the user's display name.
 */
export async function setDisplayName(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(DISPLAY_NAME_KEY, name);
  } catch {
    // Silently fail
  }
}

/**
 * Write user stats to Firestore (for leaderboard).
 * Only works when Firebase is authenticated (not local fallback).
 */
export async function writeUserStats(
  bestScore: number,
  league: LeagueName,
  displayName: string
): Promise<void> {
  if (!isFirebaseAuthenticated() || !_currentUserId) return;

  try {
    const db = getFirestore();
    await db.collection('users').doc(_currentUserId).set(
      {
        displayName,
        bestScore,
        league,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('[Firestore] Failed to write user stats:', error);
  }
}

/**
 * Subscribe to real-time leaderboard updates for a given league.
 * Returns an unsubscribe function.
 */
export function subscribeToLeaderboard(
  league: LeagueName,
  limit: number,
  onData: (entries: LeaderboardEntry[]) => void,
  onError: (error: any) => void
): () => void {
  if (!isFirebaseAvailable()) {
    // No Firebase — return empty and a no-op unsubscribe
    onData([]);
    return () => {};
  }

  try {
    const db = getFirestore();
    return db
      .collection('users')
      .where('league', '==', league)
      .orderBy('bestScore', 'desc')
      .limit(limit)
      .onSnapshot(
        (snapshot: any) => {
          const entries: LeaderboardEntry[] = snapshot.docs.map((doc: any) => ({
            userId: doc.id,
            ...doc.data(),
          }));
          onData(entries);
        },
        (error: any) => {
          console.warn('[Firestore] Leaderboard subscription error:', error);
          onError(error);
        }
      );
  } catch (error) {
    onError(error);
    return () => {};
  }
}

/**
 * Get the current user's rank within a league.
 * Returns -1 if not found or not authenticated.
 */
export async function getMyRank(league: LeagueName): Promise<number> {
  if (!isFirebaseAuthenticated() || !_currentUserId) return -1;

  try {
    const db = getFirestore();

    // Get the user's score
    const userDoc = await db.collection('users').doc(_currentUserId).get();
    if (!userDoc.exists) return -1;

    const myScore = userDoc.data()?.bestScore ?? 0;

    // Count users with higher scores in the same league
    const higherCount = await db
      .collection('users')
      .where('league', '==', league)
      .where('bestScore', '>', myScore)
      .count()
      .get();

    return (higherCount.data()?.count ?? 0) + 1;
  } catch {
    return -1;
  }
}
