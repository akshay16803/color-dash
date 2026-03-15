# Color Dash — Complete Project History & Context

Use this document to onboard a new Cowork session. Paste this entire file as your first message so Claude has full context of everything built, every decision made, and the current blockers.

---

## Project Overview

**Color Dash** is a fast-paced mobile arcade game built with **React Native + Expo SDK 50** using expo-router for navigation. The player controls a color-changing orb, swiping between 4 lanes to pass through matching color gates. The game features a 7-tier league system, real-time Firestore leaderboards, Firebase Analytics, and i18n support for 12 languages.

**GitHub Repo**: https://github.com/akshay16803/color-dash
**Package Name**: `com.niprasha.colordash`
**Expo Account**: `akshaychouhan`

---

## Tech Stack

- React Native 0.73.4 + Expo SDK 50 (managed workflow with expo-router)
- TypeScript (strict mode)
- react-native-reanimated ~3.6.0 for animations
- @react-native-firebase/app, auth, analytics, firestore ~18.8.0
- Firebase Anonymous Auth for user identity
- Firestore for leaderboard data (real-time onSnapshot)
- expo-haptics for vibration feedback
- expo-localization for device locale detection
- EAS Build for Android APK/AAB generation

---

## Complete File Structure (55 files)

```
ColorDash/
├── app/
│   ├── _layout.tsx          # Root layout — inits Firebase Analytics + Auth
│   ├── index.tsx            # Home screen — title, stats, play button, leaderboard button
│   ├── game.tsx             # Game screen — gameplay, touch controls, game over flow
│   └── leaderboard.tsx      # Leaderboard — league tabs, top 50, real-time Firestore
├── components/
│   ├── game/
│   │   ├── ColorGate.tsx    # Horizontal color gate with lane gap
│   │   ├── ComboIndicator.tsx  # Animated combo multiplier display
│   │   ├── CountdownOverlay.tsx # 3-2-1-GO countdown before game starts
│   │   ├── GameOverModal.tsx   # Game over modal with league badge + guest prompt
│   │   ├── Player.tsx       # Player orb with spring lane transitions
│   │   └── ScoreDisplay.tsx # In-game score + combo counter
│   └── ui/
│       └── Button.tsx       # Reusable button (primary/secondary/ghost/danger)
├── config/
│   ├── firebase.ts          # Firebase availability checker
│   ├── leagues.ts           # 7 league tiers (Bronze→Champion) with score thresholds
│   └── theme.ts             # Dark theme colors, spacing, typography, shadows
├── hooks/
│   ├── useAccessibility.ts  # Screen reader + reduced motion detection
│   ├── useGameEngine.ts     # Core game loop (requestAnimationFrame), collision, scoring
│   ├── useHaptics.ts        # Haptic feedback helpers
│   ├── useLeague.ts         # League evaluation, promotion/relegation, Firestore sync
│   └── useTranslation.ts    # i18n hook with interpolation, 12 locales
├── utils/
│   ├── analytics.ts         # Firebase Analytics with dev-mode fallback logging
│   ├── firestore.ts         # Auth, leaderboard queries, guest detection, retry
│   ├── sound.ts             # Sound placeholder (no-op until assets added)
│   └── storage.ts           # AsyncStorage for player stats, display name, locale
├── types/
│   └── index.ts             # GameColor, ColorGate, GameSession, PlayerStats, etc.
├── i18n/locales/
│   ├── en.ts                # English (source)
│   ├── ar.ts, de.ts, es.ts, fr.ts, hi.ts, it.ts, ja.ts, ko.ts, pt.ts, ru.ts, zh.ts
├── __tests__/i18n/
│   └── i18n.test.ts         # Locale completeness tests
├── scripts/
│   └── generate-keystore.sh # Release keystore generation script
├── assets/
│   ├── icon.png             # 1024x1024 app icon (purple gradient)
│   ├── adaptive-icon.png    # Same as icon
│   ├── splash.png           # 2048x2048 splash screen
│   └── favicon.png          # 48x48 favicon
├── app.json                 # Expo config with Firebase plugins
├── babel.config.js          # Babel + reanimated plugin
├── eas.json                 # EAS build profiles (dev/preview/production)
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config with path aliases
├── .gitignore               # Ignores node_modules, keystores, Firebase configs
├── STORE_LISTING.md         # Google Play Store listing copy
├── FIREBASE_SETUP.md        # Step-by-step Firebase setup guide
└── SESSION_HISTORY.md       # This file
```

---

## What Was Built Across All Sessions

### Session 1-3: Core Game
- Built the complete game engine (useGameEngine.ts) with requestAnimationFrame game loop
- 4-lane swipe/tap controls with PanResponder
- Color gates that scroll down, collision detection, scoring
- Combo system (consecutive correct gates multiply score)
- Difficulty progression (speed increases per gate passed)
- Game over detection, high score tracking via AsyncStorage
- Animated UI: countdown overlay, score display, combo indicator, game over modal
- Dark purple theme throughout
- Haptic feedback on interactions

### Session 3-4: QA, i18n, Accessibility
- Added i18n with 12 locales (en, ar, de, es, fr, hi, it, ja, ko, pt, ru, zh)
- Translation hook with interpolation ({highScore}, {gamesPlayed} placeholders)
- Accessibility: screen reader announcements, reduced motion detection
- Fixed game crash: replaced useFrameCallback with requestAnimationFrame

### Session 5: Firebase Integration
- Firebase Anonymous Auth for unique user IDs
- Fallback to local IDs (prefixed "local_") when Firebase unavailable
- Firebase Analytics: game_started, game_over, new_high_score, leaderboard_viewed, league_changed events
- Dev-mode fallback logging when Firebase not initialized

### Session 5-6: League System
- 7 leagues: Bronze (0-49), Silver (50-149), Gold (150-299), Platinum (300-499), Diamond (500-749), Master (750-999), Champion (1000+)
- useLeague hook evaluates promotion/relegation after each game
- Animated league badge in GameOverModal (bouncy animation for promotion/relegation)
- League synced to Firestore for leaderboard

### Session 5-6: Leaderboard
- Full leaderboard screen with horizontal league tab selector
- Real-time Firestore subscription (onSnapshot) — top 50 per league
- Pinned "My Ranking" bar at bottom
- Medal icons for top 3 (🥇🥈🥉), "YOU" badge for current user
- Loading, error, and empty states
- Leaderboard navigation from home screen (🏆 button)

### Session 6: Google Play Store Readiness (Phase 4)
- Fixed package name: com.yourstudio.colordash → com.niprasha.colordash
- Release keystore generation script (scripts/generate-keystore.sh)
- Gradle signing config (conditional: release keystore if available, falls back to debug)
- ProGuard/R8 enabled with keep rules for Firebase, Hermes, Expo, React Native
- Android permissions audited: kept INTERNET, VIBRATE, ACCESS_NETWORK_STATE; removed 4 unnecessary
- EAS build profiles configured (development/preview/production with AAB)
- STORE_LISTING.md with complete Play Store listing copy
- FIREBASE_SETUP.md with step-by-step guide

### Session 6: Guest User Handling
- isFirebaseAuthenticated() — checks if user has real Firebase UID vs local_ fallback
- retryAuthentication() — attempts to reconnect to Firebase
- GameOverModal: shows warning banner for guest users with "Connect & Save" button
- Leaderboard: shows guest hint banner, error state with retry button
- All guest/error strings translated across 12 locales

### Session 6: Project Rebuild & GitHub Push
- Original code was lost when Cowork VM sessions expired
- Rebuilt entire project (55 files) from detailed session summaries
- Generated valid PNG assets (icon, splash, adaptive-icon, favicon)
- Pushed to GitHub: https://github.com/akshay16803/color-dash
- npm install completed (1,138 packages)

---

## Current Blockers (What Needs to Be Done Next)

### BLOCKER 1: Firebase google-services.json (CRITICAL)
The EAS build fails because `google-services.json` is missing. The @react-native-firebase/app plugin requires it at build time.

**To fix:**
1. Go to https://console.firebase.google.com
2. Create project → Add Android app → package name: `com.niprasha.colordash`
3. Download `google-services.json`
4. Place it in the project root (or `android/app/` after prebuild)
5. Add `"expo.android.googleServicesFile": "./google-services.json"` to app.json
6. Also enable Anonymous Auth and create Firestore database (see FIREBASE_SETUP.md)

**Alternative:** Remove Firebase plugins from app.json to build without Firebase (game works offline, but no leaderboard/analytics).

### BLOCKER 2: Android native directory
We removed the manually-created `android/` directory because it was incomplete (missing gradlew, Java files, resources). EAS cloud builds run `npx expo prebuild` automatically to generate it, so this is fine for cloud builds. But local builds (`npx expo run:android`) will need `npx expo prebuild --platform android` first.

### BLOCKER 3: EAS Build Execution
The actual EAS build hasn't succeeded yet. Sequence to build:
```
npx eas login          # Already done (user: akshaychouhan)
# Fix google-services.json first (Blocker 1)
npx eas build --platform android --profile preview   # For APK
npx eas build --platform android --profile production # For AAB (Play Store)
```

---

## Key Design Decisions & Assumptions

1. **Firebase Anonymous Auth** — No email/password signup. Every user gets an anonymous UID automatically. "Guest" = user where auth failed (offline/no config), falling back to a local_ prefixed ID.

2. **requestAnimationFrame over useFrameCallback** — We switched from react-native-reanimated's useFrameCallback to plain requestAnimationFrame because useFrameCallback caused crashes on some devices.

3. **League thresholds are based on best score only** — You can only be promoted, never truly relegated (since your best score never decreases). The "relegated" state exists for future scenarios where league decay could be added.

4. **EAS cloud builds generate native directories** — We don't commit the android/ directory. EAS runs prebuild on their servers. Custom native config (ProGuard, permissions, signing) should be applied via Expo config plugins or eas.json, not by manually editing build.gradle.

5. **Conditional signing config** — Release builds use release keystore if COLORDASH_UPLOAD_STORE_FILE is set in gradle.properties, otherwise fall back to debug signing.

6. **Sound is a no-op placeholder** — utils/sound.ts has the API surface but no implementation. Sound assets need to be added and wired up with expo-av.

7. **Asset images are programmatically generated** — The icon/splash PNGs are simple purple gradients generated with Python PIL. They should be replaced with proper designed assets before Play Store submission.

---

## Remaining Work (Priority Order)

1. **Fix google-services.json blocker** — Either set up Firebase or remove Firebase plugins
2. **Successful EAS build** — Get a working APK/AAB
3. **Replace placeholder assets** — Design proper app icon, splash screen, feature graphic
4. **Add sound effects** — Wire up expo-av with sound assets for gate_pass, gate_miss, game_over, etc.
5. **Host privacy policy** — Required for Play Store submission
6. **Play Store submission** — Upload AAB, screenshots, listing from STORE_LISTING.md
7. **Install @types/jest** — Fixes the only pre-existing TypeScript test errors
8. **Optional: Release keystore** — Run scripts/generate-keystore.sh before production build

---

## Important Commands

```bash
# Install dependencies
npm install

# TypeScript check (should show 0 app errors, only test file errors)
npx tsc --noEmit

# EAS login
npx eas login

# Build preview APK
npx eas build --platform android --profile preview

# Build production AAB
npx eas build --platform android --profile production

# Generate release keystore
bash scripts/generate-keystore.sh

# Run prebuild (generates android/ directory locally)
npx expo prebuild --platform android
```

---

## User Info
- **Name**: Ricky (Akshay Chouhan)
- **Email**: akshaychouhan16803@gmail.com
- **GitHub**: akshay16803
- **Expo**: akshaychouhan
