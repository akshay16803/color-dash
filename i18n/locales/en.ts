/**
 * English locale strings for Color Dash.
 */
export default {
  // Home screen
  home_title: 'Color Dash',
  home_subtitle: 'Match colors. Beat your best.',
  home_play: 'PLAY',
  home_best: 'Best',
  home_games: 'Games',
  home_league: 'League',

  // Game over
  gameOver_title: 'Game Over',
  gameOver_score: 'Score',
  gameOver_gates: 'Gates',
  gameOver_bestCombo: 'Best Combo',
  gameOver_newBest: '★ NEW BEST ★',
  gameOver_tryAgain: 'Try Again',
  gameOver_mainMenu: 'Main Menu',
  gameOver_allTimeBest: 'All-time best: {highScore} · {gamesPlayed} games played',

  // League
  league_promoted: '⬆ PROMOTED!',
  league_relegated: '⬇ RELEGATED',

  // Leaderboard
  leaderboard_title: 'Leaderboard',
  leaderboard_league: 'League',
  leaderboard_players: 'players',
  leaderboard_myRank: 'My Rank',
  leaderboard_bestScore: 'Best Score',
  leaderboard_empty: 'No players yet',
  leaderboard_emptyHint: 'Be the first to claim this league!',

  // Guest user
  guest_scoreNotSaved: 'Your score is not saved to the leaderboard. Connect to sync it!',
  guest_connect: 'Connect & Save',

  // Leaderboard states
  leaderboard_error: 'Could not load leaderboard',
  leaderboard_retry: 'Try Again',
  leaderboard_guestHint: 'You are playing offline. Scores will sync when connected.',

  // Network
  offline_banner: 'You are offline',

  // General
  loading: 'Loading...',

  // Accessibility
  a11y_leaderboardButton: 'Open leaderboard',
  a11y_playButton: 'Start game',
  a11y_retryButton: 'Retry game',
  a11y_mainMenuButton: 'Go to main menu',
} as const;
