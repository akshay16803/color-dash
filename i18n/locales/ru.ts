/**
 * Russian locale strings for Color Dash.
 */
export default {
  // Home screen
  home_title: 'Color Dash',
  home_subtitle: 'Совпадайте цветам. Побейте свой рекорд.',
  home_play: 'ИГРАТЬ',
  home_best: 'Лучший',
  home_games: 'Игры',
  home_league: 'Лига',

  // Game over
  gameOver_title: 'Конец игры',
  gameOver_score: 'Очки',
  gameOver_gates: 'Ворота',
  gameOver_bestCombo: 'Лучший комбо',
  gameOver_newBest: '★ НОВЫЙ РЕКОРД ★',
  gameOver_tryAgain: 'Попробовать снова',
  gameOver_mainMenu: 'Главное меню',
  gameOver_allTimeBest: 'Лучший результат: {highScore} · {gamesPlayed} игр сыграно',

  // League
  league_promoted: '⬆ ПОВЫШЕН!',
  league_relegated: '⬇ ПОНИЖЕН',

  // Leaderboard
  leaderboard_title: 'Таблица лидеров',
  leaderboard_league: 'Лига',
  leaderboard_players: 'игроков',
  leaderboard_myRank: 'Мой ранг',
  leaderboard_bestScore: 'Лучший результат',
  leaderboard_empty: 'Игроков еще нет',
  leaderboard_emptyHint: 'Будьте первым, кто заявит эту лигу!',

  // Guest user
  guest_scoreNotSaved: 'Ваш результат не сохранен в таблице лидеров. Подключитесь для синхронизации!',
  guest_connect: 'Подключиться и сохранить',

  // Leaderboard states
  leaderboard_error: 'Не удалось загрузить таблицу лидеров',
  leaderboard_retry: 'Попробовать снова',
  leaderboard_guestHint: 'Вы играете в режиме офлайн. Результаты синхронизируются при подключении.',

  // Network
  offline_banner: 'Вы в режиме офлайн',

  // General
  loading: 'Загрузка...',

  // Accessibility
  a11y_leaderboardButton: 'Открыть таблицу лидеров',
  a11y_playButton: 'Начать игру',
  a11y_retryButton: 'Повторить игру',
  a11y_mainMenuButton: 'Перейти в главное меню',
} as const;
