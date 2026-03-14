/**
 * Korean locale strings for Color Dash.
 */
export default {
  // Home screen
  home_title: 'Color Dash',
  home_subtitle: '색을 맞춰보세요. 최고 기록을 깨뜨리세요.',
  home_play: '플레이',
  home_best: '최고',
  home_games: '게임',
  home_league: '리그',

  // Game over
  gameOver_title: '게임 종료',
  gameOver_score: '점수',
  gameOver_gates: '게이트',
  gameOver_bestCombo: '최고 콤보',
  gameOver_newBest: '★ 신기록 ★',
  gameOver_tryAgain: '다시 시도',
  gameOver_mainMenu: '메인 메뉴',
  gameOver_allTimeBest: '역대 최고: {highScore} · {gamesPlayed}게임 플레이됨',

  // League
  league_promoted: '⬆ 승격!',
  league_relegated: '⬇ 강등',

  // Leaderboard
  leaderboard_title: '리더보드',
  leaderboard_league: '리그',
  leaderboard_players: '플레이어',
  leaderboard_myRank: '내 순위',
  leaderboard_bestScore: '최고 점수',
  leaderboard_empty: '플레이어가 없습니다',
  leaderboard_emptyHint: '이 리그를 처음 차지하세요!',

  // Guest user
  guest_scoreNotSaved: '점수가 리더보드에 저장되지 않았습니다. 동기화하려면 연결하세요!',
  guest_connect: '연결 및 저장',

  // Leaderboard states
  leaderboard_error: '리더보드를 로드할 수 없습니다',
  leaderboard_retry: '다시 시도',
  leaderboard_guestHint: '오프라인 상태로 플레이 중입니다. 연결되면 점수가 동기화됩니다.',

  // Network
  offline_banner: '오프라인 상태입니다',

  // General
  loading: '로딩 중...',

  // Accessibility
  a11y_leaderboardButton: '리더보드 열기',
  a11y_playButton: '게임 시작',
  a11y_retryButton: '게임 다시 시도',
  a11y_mainMenuButton: '메인 메뉴로 이동',
} as const;
