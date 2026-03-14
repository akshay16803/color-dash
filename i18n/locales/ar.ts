/**
 * Arabic locale strings for Color Dash.
 */
export default {
  // Home screen
  home_title: 'Color Dash',
  home_subtitle: 'طابق الألوان. اهزم أفضل ما لديك.',
  home_play: 'العب',
  home_best: 'الأفضل',
  home_games: 'الألعاب',
  home_league: 'الدوري',

  // Game over
  gameOver_title: 'انتهت اللعبة',
  gameOver_score: 'النقاط',
  gameOver_gates: 'البوابات',
  gameOver_bestCombo: 'أفضل مجموعة',
  gameOver_newBest: '★ الأفضل الجديد ★',
  gameOver_tryAgain: 'حاول مرة أخرى',
  gameOver_mainMenu: 'القائمة الرئيسية',
  gameOver_allTimeBest: 'الأفضل على الإطلاق: {highScore} · تم لعب {gamesPlayed} لعبة',

  // League
  league_promoted: '⬆ تم الترقية!',
  league_relegated: '⬇ تم الخفض',

  // Leaderboard
  leaderboard_title: 'لوحة المتصدرين',
  leaderboard_league: 'الدوري',
  leaderboard_players: 'لاعبين',
  leaderboard_myRank: 'ترتيبي',
  leaderboard_bestScore: 'أفضل نقاط',
  leaderboard_empty: 'لا يوجد لاعبون بعد',
  leaderboard_emptyHint: 'كن الأول في المطالبة بهذا الدوري!',

  // Guest user
  guest_scoreNotSaved: 'نقاطك لم تُحفظ في لوحة المتصدرين. اتصل لمزامنتها!',
  guest_connect: 'اتصل وحفظ',

  // Leaderboard states
  leaderboard_error: 'تعذر تحميل لوحة المتصدرين',
  leaderboard_retry: 'حاول مرة أخرى',
  leaderboard_guestHint: 'أنت تلعب بدون اتصال. ستتم مزامنة النقاط عند الاتصال.',

  // Network
  offline_banner: 'أنت غير متصل بالإنترنت',

  // General
  loading: 'جاري التحميل...',

  // Accessibility
  a11y_leaderboardButton: 'فتح لوحة المتصدرين',
  a11y_playButton: 'ابدأ اللعبة',
  a11y_retryButton: 'أعد محاولة اللعبة',
  a11y_mainMenuButton: 'انتقل إلى القائمة الرئيسية',
} as const;
