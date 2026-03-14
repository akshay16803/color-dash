# Firebase Setup Guide for Color Dash

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" → Name it `color-dash`
3. Disable Google Analytics (or enable if desired)
4. Click "Create project"

## 2. Register Android App

1. From project dashboard, click the Android icon
2. Enter package name: `com.niprasha.colordash`
3. Enter app nickname: `Color Dash` (optional)
4. Skip SHA-1 for now
5. Click "Register app"
6. **Download `google-services.json`**
7. Place it in: `android/app/google-services.json`

## 3. Register iOS App (Optional)

1. Click "Add app" → iOS
2. Enter bundle ID: `com.niprasha.colordash`
3. Download `GoogleService-Info.plist`
4. Place it in: `ios/ColorDash/GoogleService-Info.plist`

## 4. Enable Anonymous Authentication

1. Go to **Build → Authentication → Sign-in method**
2. Find "Anonymous" in the providers list
3. Toggle it **ON** and save

## 5. Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (we'll add rules below)
4. Select a region close to your users

## 6. Firestore Security Rules

Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection — each user can only write their own document
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.data.keys().hasAll(['displayName', 'bestScore', 'league', 'updatedAt'])
                   && request.resource.data.bestScore is int
                   && request.resource.data.bestScore >= 0
                   && request.resource.data.league is string
                   && request.resource.data.displayName is string
                   && request.resource.data.displayName.size() <= 30;
    }

    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 7. Create Composite Index

The leaderboard queries require a composite index:

1. Go to **Firestore → Indexes → Composite**
2. Click "Create index"
3. Configure:
   - **Collection**: `users`
   - **Field 1**: `league` — Ascending
   - **Field 2**: `bestScore` — Descending
   - **Query scope**: Collection
4. Click "Create"
5. Wait for the index to finish building (usually 1-2 minutes)

## 8. File Locations Summary

| File | Location |
|------|----------|
| `google-services.json` | `android/app/google-services.json` |
| `GoogleService-Info.plist` | `ios/ColorDash/GoogleService-Info.plist` |
| Firebase config checker | `config/firebase.ts` |
| Firestore utilities | `utils/firestore.ts` |
| Analytics utilities | `utils/analytics.ts` |

## 9. Verify Setup

Run a development build and check logs for:
```
[Analytics] Firebase Analytics initialized
```

If you see `[Analytics] Firebase not available — using dev logging`, the config file is missing or Firebase failed to initialize.
