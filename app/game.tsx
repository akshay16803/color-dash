/**
 * Main game screen for Color Dash.
 * Handles gameplay rendering, touch controls, and game state.
 */
import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions, PanResponder } from 'react-native';
import { useRouter } from 'expo-router';
import { THEME } from '@/config/theme';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useHaptics } from '@/hooks/useHaptics';
import { useLeague } from '@/hooks/useLeague';
import { logScreenView } from '@/utils/analytics';
import { Player } from '@/components/game/Player';
import { ColorGate } from '@/components/game/ColorGate';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { ComboIndicator } from '@/components/game/ComboIndicator';
import { CountdownOverlay } from '@/components/game/CountdownOverlay';
import { GameOverModal, type LeagueResult } from '@/components/game/GameOverModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GameScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const league = useLeague();
  const engine = useGameEngine();
  const [showCountdown, setShowCountdown] = useState(true);
  const [leagueResult, setLeagueResult] = useState<LeagueResult | null>(null);

  // Track screen view
  React.useEffect(() => {
    logScreenView('Game');
  }, []);

  /**
   * Handle swipe gestures for lane movement.
   */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        if (Math.abs(dx) > 20) {
          if (dx > 0) {
            engine.moveRight();
          } else {
            engine.moveLeft();
          }
          haptics.lightTap();
        }
      },
      onPanResponderGrant: (evt) => {
        // Tap-to-move: tap left/right half of screen
        const x = evt.nativeEvent.locationX;
        const targetLane = Math.floor(x / engine.laneWidth);
        engine.moveToLane(targetLane);
        haptics.lightTap();
      },
    })
  ).current;

  /**
   * Start the game after countdown completes.
   */
  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    engine.startGame();
  }, [engine]);

  /**
   * Evaluate league after game over.
   */
  React.useEffect(() => {
    if (engine.isGameOver && engine.playerStats) {
      league
        .evaluateAfterGame(engine.playerStats.highScore)
        .then((result) => setLeagueResult(result))
        .catch(() => {});
    }
  }, [engine.isGameOver]);

  /**
   * Handle retry — reset everything.
   */
  const handleRetry = useCallback(() => {
    setLeagueResult(null);
    setShowCountdown(true);
  }, []);

  /**
   * Handle main menu navigation.
   */
  const handleMainMenu = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Lane dividers */}
      {Array.from({ length: engine.numLanes - 1 }, (_, i) => (
        <View
          key={`lane-${i}`}
          style={[
            styles.laneDivider,
            { left: (i + 1) * engine.laneWidth },
          ]}
        />
      ))}

      {/* Score display */}
      <ScoreDisplay
        score={engine.session.score}
        combo={engine.session.currentCombo}
      />

      {/* Combo indicator */}
      <ComboIndicator
        combo={engine.session.currentCombo}
        playerY={engine.playerY}
      />

      {/* Color gates */}
      {engine.gates.map((gate) => (
        <ColorGate
          key={gate.id}
          color={gate.color}
          y={gate.y}
          laneIndex={gate.laneIndex}
          laneWidth={engine.laneWidth}
          passed={gate.passed}
        />
      ))}

      {/* Player */}
      <Player
        lane={engine.playerLane}
        laneWidth={engine.laneWidth}
        y={engine.playerY}
        color={engine.session.playerColor}
      />

      {/* Countdown overlay */}
      {showCountdown && (
        <CountdownOverlay onComplete={handleCountdownComplete} />
      )}

      {/* Game over modal */}
      {engine.isGameOver && (
        <GameOverModal
          session={engine.session}
          isNewHighScore={engine.isNewHighScore}
          playerStats={engine.playerStats}
          leagueResult={leagueResult}
          onRetry={handleRetry}
          onMainMenu={handleMainMenu}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  laneDivider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
