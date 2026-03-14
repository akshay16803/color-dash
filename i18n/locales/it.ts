/**
 * Italian locale strings for Color Dash.
 */
export default {
  // Home screen
  home_title: 'Color Dash',
  home_subtitle: 'Abbina i colori. Batti il tuo record.',
  home_play: 'GIOCA',
  home_best: 'Miglior',
  home_games: 'Giochi',
  home_league: 'Lega',

  // Game over
  gameOver_title: 'Fine del gioco',
  gameOver_score: 'Punteggio',
  gameOver_gates: 'Porte',
  gameOver_bestCombo: 'Miglior combo',
  gameOver_newBest: '★ NUOVO RECORD ★',
  gameOver_tryAgain: 'Riprova',
  gameOver_mainMenu: 'Menu principale',
  gameOver_allTimeBest: 'Miglior risultato di sempre: {highScore} · {gamesPlayed} giochi giocati',

  // League
  league_promoted: '⬆ PROMOSSO!',
  league_relegated: '⬇ RETROCESSO',

  // Leaderboard
  leaderboard_title: 'Classifica',
  leaderboard_league: 'Lega',
  leaderboard_players: 'giocatori',
  leaderboard_myRank: 'Il mio rango',
  leaderboard_bestScore: 'Miglior punteggio',
  leaderboard_empty: 'Nessun giocatore ancora',
  leaderboard_emptyHint: 'Sii il primo a rivendicare questa lega!',

  // Guest user
  guest_scoreNotSaved: 'Il tuo punteggio non è salvato nella classifica. Connettiti per sincronizzarlo!',
  guest_connect: 'Connetti e salva',

  // Leaderboard states
  leaderboard_error: 'Impossibile caricare la classifica',
  leaderboard_retry: 'Riprova',
  leaderboard_guestHint: 'Stai giocando offline. I punteggi si sincronizzeranno quando sarai connesso.',

  // Network
  offline_banner: 'Sei offline',

  // General
  loading: 'Caricamento in corso...',

  // Accessibility
  a11y_leaderboardButton: 'Apri classifica',
  a11y_playButton: 'Avvia gioco',
  a11y_retryButton: 'Riprova il gioco',
  a11y_mainMenuButton: 'Vai al menu principale',
} as const;
