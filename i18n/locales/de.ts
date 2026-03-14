/**
 * German locale strings for Color Dash.
 */
export default {
  // Home screen
  home_title: 'Color Dash',
  home_subtitle: 'Farben zuordnen. Schlag deinen besten Rekord.',
  home_play: 'SPIELEN',
  home_best: 'Beste',
  home_games: 'Spiele',
  home_league: 'Liga',

  // Game over
  gameOver_title: 'Spiel vorbei',
  gameOver_score: 'Punkte',
  gameOver_gates: 'Tore',
  gameOver_bestCombo: 'Beste Combo',
  gameOver_newBest: '★ NEUER REKORD ★',
  gameOver_tryAgain: 'Nochmal spielen',
  gameOver_mainMenu: 'Hauptmenü',
  gameOver_allTimeBest: 'Persönlicher Rekord: {highScore} · {gamesPlayed} Spiele gespielt',

  // League
  league_promoted: '⬆ AUFGESTIEGEN!',
  league_relegated: '⬇ ABGESTIEGEN',

  // Leaderboard
  leaderboard_title: 'Bestenliste',
  leaderboard_league: 'Liga',
  leaderboard_players: 'Spieler',
  leaderboard_myRank: 'Mein Rang',
  leaderboard_bestScore: 'Beste Punktzahl',
  leaderboard_empty: 'Noch keine Spieler',
  leaderboard_emptyHint: 'Sei der Erste, der diese Liga beansprucht!',

  // Guest user
  guest_scoreNotSaved: 'Dein Ergebnis wird nicht in der Bestenliste gespeichert. Verbinde dich zum Synchronisieren!',
  guest_connect: 'Verbinden & Speichern',

  // Leaderboard states
  leaderboard_error: 'Bestenliste konnte nicht geladen werden',
  leaderboard_retry: 'Nochmal versuchen',
  leaderboard_guestHint: 'Du spielst offline. Ergebnisse werden synchronisiert, wenn du verbunden bist.',

  // Network
  offline_banner: 'Du bist offline',

  // General
  loading: 'Wird geladen...',

  // Accessibility
  a11y_leaderboardButton: 'Bestenliste öffnen',
  a11y_playButton: 'Spiel starten',
  a11y_retryButton: 'Spiel wiederholen',
  a11y_mainMenuButton: 'Zum Hauptmenü gehen',
} as const;
