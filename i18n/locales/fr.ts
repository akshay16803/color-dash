/**
 * French locale strings for Color Dash.
 */
export default {
  // Home screen
  home_title: 'Color Dash',
  home_subtitle: 'Associez les couleurs. Battez votre meilleur score.',
  home_play: 'JOUER',
  home_best: 'Meilleur',
  home_games: 'Jeux',
  home_league: 'Ligue',

  // Game over
  gameOver_title: 'Fin du jeu',
  gameOver_score: 'Score',
  gameOver_gates: 'Portes',
  gameOver_bestCombo: 'Meilleure combo',
  gameOver_newBest: '★ NOUVEAU RECORD ★',
  gameOver_tryAgain: 'Réessayer',
  gameOver_mainMenu: 'Menu principal',
  gameOver_allTimeBest: 'Meilleur résultat : {highScore} · {gamesPlayed} parties jouées',

  // League
  league_promoted: '⬆ PROMO !',
  league_relegated: '⬇ RÉTROGRADÉ',

  // Leaderboard
  leaderboard_title: 'Classement',
  leaderboard_league: 'Ligue',
  leaderboard_players: 'joueurs',
  leaderboard_myRank: 'Mon rang',
  leaderboard_bestScore: 'Meilleur score',
  leaderboard_empty: 'Aucun joueur pour le moment',
  leaderboard_emptyHint: 'Soyez le premier à revendiquer cette ligue !',

  // Guest user
  guest_scoreNotSaved: 'Votre score n\'est pas sauvegardé au classement. Connectez-vous pour le synchroniser !',
  guest_connect: 'Se connecter et enregistrer',

  // Leaderboard states
  leaderboard_error: 'Impossible de charger le classement',
  leaderboard_retry: 'Réessayer',
  leaderboard_guestHint: 'Vous jouez hors ligne. Les scores seront synchronisés une fois connecté.',

  // Network
  offline_banner: 'Vous êtes hors ligne',

  // General
  loading: 'Chargement...',

  // Accessibility
  a11y_leaderboardButton: 'Ouvrir le classement',
  a11y_playButton: 'Démarrer le jeu',
  a11y_retryButton: 'Réessayer le jeu',
  a11y_mainMenuButton: 'Aller au menu principal',
} as const;
