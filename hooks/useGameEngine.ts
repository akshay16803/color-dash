/**
 * Core game engine hook for Color Dash.
 * Manages game state, gate spawning, collision detection, scoring,
 * and difficulty progression using requestAnimationFrame.
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { updateStatsAfterGame, loadPlayerStats } from '@/utils/storage';
import { Analytics } from '@/utils/analytics';
import type {
  GameSession,
  GameColor,
  ColorGate,
  PlayerStats,
  GameEngineState,
  DifficultyConfig,
  GAME_COLORS,
} from '@/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Player position from bottom */
const PLAYER_Y = SCREEN_HEIGHT - 140;

/** Height of each color gate (thin line) */
const GATE_HEIGHT = 8;

/** Default difficulty configuration */
const DIFFICULTY: DifficultyConfig = {
  baseSpeed: 3,
  speedIncrement: 0.15,
  maxSpeed: 12,
  minGateSpacing: 200,
  maxGateSpacing: 350,
};

/** All game colors */
const COLORS: GameColor[] = ['red', 'blue', 'green', 'yellow'];

/** Generate a unique ID */
function uid(): string {
  return Math.random().toString(36).substring(2, 10);
}

/** Pick a random color */
function randomColor(): GameColor {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

/** Create a new gate at the top of the screen */
function createGate(y: number): ColorGate {
  return {
    id: uid(),
    color: randomColor(),
    y,
    passed: false,
  };
}

/** Initial game session state */
function createSession(): GameSession {
  return {
    score: 0,
    gatesPassed: 0,
    maxCombo: 0,
    currentCombo: 0,
    isActive: false,
    isPaused: false,
    playerColor: randomColor(),
    speed: DIFFICULTY.baseSpeed,
    startedAt: Date.now(),
  };
}

export function useGameEngine() {
  const [session, setSession] = useState<GameSession>(createSession);
  const [gates, setGates] = useState<ColorGate[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);

  // Refs for the game loop (avoid stale closures)
  const sessionRef = useRef(session);
  const gatesRef = useRef(gates);
  const rafRef = useRef<number | null>(null);
  const lastSpawnY = useRef(-DIFFICULTY.maxGateSpacing);

  // Keep refs in sync
  sessionRef.current = session;
  gatesRef.current = gates;

  /**
   * Load player stats on mount.
   */
  useEffect(() => {
    loadPlayerStats().then(setPlayerStats);
  }, []);

  /**
   * Cycle player color to the next color in the sequence.
   */
  const cycleColor = useCallback(() => {
    setSession((prev) => {
      const currentIndex = COLORS.indexOf(prev.playerColor);
      const nextIndex = (currentIndex + 1) % COLORS.length;
      return {
        ...prev,
        playerColor: COLORS[nextIndex],
      };
    });
  }, []);

  /**
   * The main game loop — runs every frame via requestAnimationFrame.
   */
  const gameLoop = useCallback(() => {
    const s = sessionRef.current;
    if (!s.isActive || s.isPaused) return;

    setGates((prevGates) => {
      let updatedGates = prevGates
        .map((gate) => ({ ...gate, y: gate.y + s.speed }))
        .filter((gate) => gate.y < SCREEN_HEIGHT + GATE_HEIGHT);

      // Check for gate collisions
      let scoreIncrease = 0;
      let gatesPassed = 0;
      let missed = false;

      updatedGates = updatedGates.map((gate) => {
        if (gate.passed) return gate;

        // Check if gate has reached the player's Y position
        const gateBottom = gate.y + GATE_HEIGHT;
        if (gateBottom >= PLAYER_Y && gate.y <= PLAYER_Y + 40) {
          const isCorrectColor = s.playerColor === gate.color;

          if (isCorrectColor) {
            scoreIncrease += 10 + s.currentCombo * 2;
            gatesPassed += 1;
          } else {
            // Color mismatch — game over
            missed = true;
          }
          return { ...gate, passed: true };
        }
        return gate;
      });

      // Update session based on results
      if (missed) {
        setSession((prev) => ({
          ...prev,
          isActive: false,
          endedAt: Date.now(),
        }));
        setIsGameOver(true);
        return updatedGates;
      }

      if (scoreIncrease > 0) {
        setSession((prev) => {
          const newCombo = prev.currentCombo + gatesPassed;
          const newSpeed = Math.min(
            DIFFICULTY.maxSpeed,
            DIFFICULTY.baseSpeed + prev.gatesPassed * DIFFICULTY.speedIncrement
          );
          return {
            ...prev,
            score: prev.score + scoreIncrease,
            gatesPassed: prev.gatesPassed + gatesPassed,
            currentCombo: newCombo,
            maxCombo: Math.max(prev.maxCombo, newCombo),
            speed: newSpeed,
          };
        });
      }

      return updatedGates;
    });

    // Spawn new gates
    setGates((prevGates) => {
      const topGate = prevGates.reduce(
        (min, g) => Math.min(min, g.y),
        SCREEN_HEIGHT
      );

      if (topGate > DIFFICULTY.minGateSpacing) {
        const spacing =
          DIFFICULTY.minGateSpacing +
          Math.random() * (DIFFICULTY.maxGateSpacing - DIFFICULTY.minGateSpacing);
        const newGate = createGate(-spacing);
        return [...prevGates, newGate];
      }
      return prevGates;
    });

    rafRef.current = requestAnimationFrame(gameLoop);
  }, []);

  /**
   * Start a new game.
   */
  const startGame = useCallback(() => {
    const newSession = createSession();
    newSession.isActive = true;

    setSession(newSession);
    setGates([createGate(-100), createGate(-350)]);
    setIsGameOver(false);
    setIsNewHighScore(false);

    Analytics.gameStarted();

    // Start the game loop
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    // Small delay to let state settle
    setTimeout(() => {
      rafRef.current = requestAnimationFrame(gameLoop);
    }, 100);
  }, [gameLoop]);

  /**
   * Handle game over — update stats and check for high score.
   */
  useEffect(() => {
    if (!isGameOver) return;

    const s = sessionRef.current;
    Analytics.gameOver(s.score, s.gatesPassed, s.maxCombo);

    // Cancel animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Update persistent stats
    updateStatsAfterGame(s.score, s.gatesPassed, s.maxCombo).then(
      ({ stats, isNewHighScore: isNew }) => {
        setPlayerStats(stats);
        setIsNewHighScore(isNew);
        if (isNew) {
          Analytics.newHighScore(s.score);
        }
      }
    );
  }, [isGameOver]);

  /**
   * Pause the game.
   */
  const pause = useCallback(() => {
    setSession((prev) => ({ ...prev, isPaused: true }));
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  /**
   * Resume the game.
   */
  const resume = useCallback(() => {
    setSession((prev) => ({ ...prev, isPaused: false }));
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  /**
   * Clean up on unmount.
   */
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    // State
    session,
    gates,
    playerY: PLAYER_Y,
    isGameOver,
    isNewHighScore,
    playerStats,

    // Actions
    startGame,
    cycleColor,
    pause,
    resume,

    // Constants
    gateHeight: GATE_HEIGHT,
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
  };
}
