/**
 * Spanish locale strings for Color Dash.
 */
export default {
  // Home screen
  home_title: 'Color Dash',
  home_subtitle: 'Empareja colores. Vence tu mejor marca.',
  home_play: 'JUGAR',
  home_best: 'Mejor',
  home_games: 'Juegos',
  home_league: 'Liga',

  // Game over
  gameOver_title: 'Fin del juego',
  gameOver_score: 'Puntuación',
  gameOver_gates: 'Puertas',
  gameOver_bestCombo: 'Mejor combo',
  gameOver_newBest: '★ NUEVO RÉCORD ★',
  gameOver_tryAgain: 'Intentar de nuevo',
  gameOver_mainMenu: 'Menú principal',
  gameOver_allTimeBest: 'Mejor de todos los tiempos: {highScore} · {gamesPlayed} juegos jugados',

  // League
  league_promoted: '⬆ ¡ASCENDIDO!',
  league_relegated: '⬇ DESCENDIDO',

  // Leaderboard
  leaderboard_title: 'Tabla de clasificación',
  leaderboard_league: 'Liga',
  leaderboard_players: 'jugadores',
  leaderboard_myRank: 'Mi rango',
  leaderboard_bestScore: 'Mejor puntuación',
  leaderboard_empty: 'Sin jugadores aún',
  leaderboard_emptyHint: '¡Sé el primero en reclamar esta liga!',

  // Guest user
  guest_scoreNotSaved: 'Tu puntuación no se guardó en la tabla de clasificación. ¡Conéctate para sincronizarla!',
  guest_connect: 'Conectar y guardar',

  // Leaderboard states
  leaderboard_error: 'No se pudo cargar la tabla de clasificación',
  leaderboard_retry: 'Intentar de nuevo',
  leaderboard_guestHint: 'Estás jugando sin conexión. Los puntajes se sincronizarán cuando te conectes.',

  // Network
  offline_banner: 'Estás sin conexión',

  // General
  loading: 'Cargando...',

  // Accessibility
  a11y_leaderboardButton: 'Abrir tabla de clasificación',
  a11y_playButton: 'Iniciar juego',
  a11y_retryButton: 'Reintentar juego',
  a11y_mainMenuButton: 'Ir al menú principal',
} as const;
