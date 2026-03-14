/**
 * Core game types for Color Dash.
 */

/** The four game colors */
export type GameColor = 'red' | 'blue' | 'green' | 'yellow';

/** All available game colors */
export const GAME_COLORS: GameColor[] = ['red', 'blue', 'green', 'yellow'];

/** Maps game colors to their hex values */
export const COLOR_MAP: Record<GameColor, string> = {
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#FBBF24',
};

/** A color gate the player must pass through */
export interface ColorGate {
  id: string;
  color: GameColor;
  y: number;
  passed: boolean;
  /** Position of the correct-color lane (0-3) */
  laneIndex: number;
}

/** Current state of a game session */
export interface GameSession {
  score: number;
  gatesPassed: number;
  maxCombo: number;
  currentCombo: number;
  isActive: boolean;
  isPaused: boolean;
  playerColor: GameColor;
  speed: number;
  startedAt: number;
  endedAt?: number;
}

/** Persistent player statistics */
export interface PlayerStats {
  highScore: number;
  totalGamesPlayed: number;
  totalGatesPassed: number;
  bestCombo: number;
  averageScore: number;
  totalScore: number;
}

/** Game difficulty scaling parameters */
export interface DifficultyConfig {
  /** Base speed (pixels per frame) */
  baseSpeed: number;
  /** Speed increase per gate passed */
  speedIncrement: number;
  /** Maximum speed cap */
  maxSpeed: number;
  /** Minimum distance between gates */
  minGateSpacing: number;
  /** Maximum distance between gates */
  maxGateSpacing: number;
}

/** Game engine state returned by useGameEngine hook */
export interface GameEngineState {
  session: GameSession;
  gates: ColorGate[];
  playerY: number;
  playerLane: number;
  isGameOver: boolean;
  isNewHighScore: boolean;
  playerStats: PlayerStats | null;
}
