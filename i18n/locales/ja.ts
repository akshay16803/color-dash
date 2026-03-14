/**
 * Japanese locale strings for Color Dash.
 */
export default {
  // Home screen
  home_title: 'Color Dash',
  home_subtitle: '色を合わせる。自分の最高記録を破る。',
  home_play: 'プレイ',
  home_best: '最高',
  home_games: 'ゲーム',
  home_league: 'リーグ',

  // Game over
  gameOver_title: 'ゲーム終了',
  gameOver_score: 'スコア',
  gameOver_gates: 'ゲート',
  gameOver_bestCombo: 'ベストコンボ',
  gameOver_newBest: '★ 新記録 ★',
  gameOver_tryAgain: 'もう一度試す',
  gameOver_mainMenu: 'メインメニュー',
  gameOver_allTimeBest: '史上最高: {highScore} · {gamesPlayed}ゲームプレイ済み',

  // League
  league_promoted: '⬆ 昇格!',
  league_relegated: '⬇ 降格',

  // Leaderboard
  leaderboard_title: 'リーダーボード',
  leaderboard_league: 'リーグ',
  leaderboard_players: 'プレイヤー',
  leaderboard_myRank: 'マイランク',
  leaderboard_bestScore: 'ベストスコア',
  leaderboard_empty: 'プレイヤーがまだいません',
  leaderboard_emptyHint: 'このリーグを最初に要求してください!',

  // Guest user
  guest_scoreNotSaved: 'あなたのスコアはリーダーボードに保存されていません。同期するために接続してください!',
  guest_connect: '接続して保存',

  // Leaderboard states
  leaderboard_error: 'リーダーボードを読み込めませんでした',
  leaderboard_retry: 'もう一度試す',
  leaderboard_guestHint: 'あなたはオフラインでプレイしています。接続されると、スコアが同期されます。',

  // Network
  offline_banner: 'オフラインです',

  // General
  loading: '読み込み中...',

  // Accessibility
  a11y_leaderboardButton: 'リーダーボードを開く',
  a11y_playButton: 'ゲームを開始',
  a11y_retryButton: 'ゲームを再試行',
  a11y_mainMenuButton: 'メインメニューへ移動',
} as const;
