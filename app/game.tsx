/**
 * Main game screen for Color Dash.
 * Handles gameplay rendering, tap controls, and game state.
 */
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
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
   * Handle tap to cycle player color.
   */
  const handleScreenTap = useCallback(() => {
    if (engine.session.isActive && !engine.session.isPaused) {
      engine.cycleColor();
      haptics.lightTap();
    }
  }, [engine, haptics]);

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
  }, [engine.isGameOver, engine.playerStats, league]);

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
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View style={styles.container}>
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
            passed={gate.passed}
          />
        ))}

        {/* Player */}
        <Player
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
});
