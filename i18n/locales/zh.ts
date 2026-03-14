/**
 * Chinese locale strings for Color Dash.
 */
export default {
  // Home screen
  home_title: 'Color Dash',
  home_subtitle: '匹配颜色。打破你的最好成绩。',
  home_play: '开始游戏',
  home_best: '最佳',
  home_games: '游戏',
  home_league: '排行榜',

  // Game over
  gameOver_title: '游戏结束',
  gameOver_score: '得分',
  gameOver_gates: '关卡',
  gameOver_bestCombo: '最佳连击',
  gameOver_newBest: '★ 新的最高分 ★',
  gameOver_tryAgain: '重新开始',
  gameOver_mainMenu: '主菜单',
  gameOver_allTimeBest: '历史最高分：{highScore} · 已玩 {gamesPlayed} 局',

  // League
  league_promoted: '⬆ 晋级!',
  league_relegated: '⬇ 降级',

  // Leaderboard
  leaderboard_title: '排行榜',
  leaderboard_league: '排行榜',
  leaderboard_players: '玩家',
  leaderboard_myRank: '我的排名',
  leaderboard_bestScore: '最高分数',
  leaderboard_empty: '暂无玩家',
  leaderboard_emptyHint: '成为第一个加入这个排行榜的玩家！',

  // Guest user
  guest_scoreNotSaved: '你的得分未保存到排行榜。连接以同步！',
  guest_connect: '连接并保存',

  // Leaderboard states
  leaderboard_error: '无法加载排行榜',
  leaderboard_retry: '重新尝试',
  leaderboard_guestHint: '你正在离线玩游戏。连接后得分将同步。',

  // Network
  offline_banner: '你处于离线状态',

  // General
  loading: '加载中...',

  // Accessibility
  a11y_leaderboardButton: '打开排行榜',
  a11y_playButton: '开始游戏',
  a11y_retryButton: '重新开始游戏',
  a11y_mainMenuButton: '返回主菜单',
} as const;
