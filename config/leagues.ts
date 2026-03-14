/**
 * League tier definitions for the ranking system.
 * Players are assigned to leagues based on their best score.
 * 7 tiers from Bronze to Champion, each with distinct colors and icons.
 */

export type LeagueName =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'master'
  | 'champion';

export interface LeagueDefinition {
  id: LeagueName;
  label: string;
  icon: string;
  color: string;
  minScore: number;
  maxScore: number;
}

/**
 * League definitions ordered from lowest to highest tier.
 * Score ranges are inclusive on both ends.
 */
export const LEAGUES: LeagueDefinition[] = [
  {
    id: 'bronze',
    label: 'Bronze',
    icon: '🥉',
    color: '#CD7F32',
    minScore: 0,
    maxScore: 49,
  },
  {
    id: 'silver',
    label: 'Silver',
    icon: '🥈',
    color: '#C0C0C0',
    minScore: 50,
    maxScore: 149,
  },
  {
    id: 'gold',
    label: 'Gold',
    icon: '🥇',
    color: '#FFD700',
    minScore: 150,
    maxScore: 299,
  },
  {
    id: 'platinum',
    label: 'Platinum',
    icon: '💎',
    color: '#E5E4E2',
    minScore: 300,
    maxScore: 499,
  },
  {
    id: 'diamond',
    label: 'Diamond',
    icon: '💠',
    color: '#B9F2FF',
    minScore: 500,
    maxScore: 749,
  },
  {
    id: 'master',
    label: 'Master',
    icon: '👑',
    color: '#FF6B6B',
    minScore: 750,
    maxScore: 999,
  },
  {
    id: 'champion',
    label: 'Champion',
    icon: '🏆',
    color: '#8B5CF6',
    minScore: 1000,
    maxScore: Infinity,
  },
];

/**
 * Get the league definition for a given score.
 */
export function getLeagueForScore(score: number): LeagueDefinition {
  // Iterate from highest to lowest to find the correct tier
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (score >= LEAGUES[i].minScore) {
      return LEAGUES[i];
    }
  }
  return LEAGUES[0]; // Default to Bronze
}

/**
 * Get a league definition by its ID.
 */
export function getLeagueById(id: LeagueName): LeagueDefinition {
  return LEAGUES.find((l) => l.id === id) ?? LEAGUES[0];
}

/**
 * Get the next league tier above the given league.
 * Returns null if already at Champion tier.
 */
export function getNextLeague(id: LeagueName): LeagueDefinition | null {
  const index = LEAGUES.findIndex((l) => l.id === id);
  if (index < 0 || index >= LEAGUES.length - 1) return null;
  return LEAGUES[index + 1];
}

/**
 * Get the previous league tier below the given league.
 * Returns null if already at Bronze tier.
 */
export function getPreviousLeague(id: LeagueName): LeagueDefinition | null {
  const index = LEAGUES.findIndex((l) => l.id === id);
  if (index <= 0) return null;
  return LEAGUES[index - 1];
}
