/**
 * Sound effects manager for Color Dash.
 * Placeholder implementation — sounds can be added later with expo-av.
 * All methods are safe no-ops until sound assets are configured.
 */

/** Whether sound is enabled */
let _soundEnabled = true;

export function setSoundEnabled(enabled: boolean): void {
  _soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return _soundEnabled;
}

/**
 * Play a sound effect. Currently a no-op placeholder.
 * To enable, add sound assets and use expo-av Audio.Sound.
 */
export async function playSound(
  _name: 'gate_pass' | 'gate_miss' | 'combo' | 'game_over' | 'high_score' | 'button_tap'
): Promise<void> {
  if (!_soundEnabled) return;
  // TODO: Implement with expo-av when sound assets are added
}
