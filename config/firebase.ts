/**
 * Firebase initialization checker.
 * Firebase is initialized automatically by @react-native-firebase/app
 * when google-services.json (Android) or GoogleService-Info.plist (iOS) is present.
 * This module provides helpers to check initialization status.
 */
import firebase from '@react-native-firebase/app';

/** Whether Firebase has been successfully initialized */
let _initialized = false;

/**
 * Check if Firebase is available and initialized.
 * Returns false if google-services.json is missing or Firebase failed to init.
 */
export function isFirebaseAvailable(): boolean {
  if (_initialized) return true;

  try {
    const apps = firebase.apps;
    _initialized = apps.length > 0;
    return _initialized;
  } catch {
    return false;
  }
}

/**
 * Get the default Firebase app, or null if not available.
 */
export function getFirebaseApp() {
  if (!isFirebaseAvailable()) return null;
  return firebase.app();
}
