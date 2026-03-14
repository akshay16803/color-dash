/**
 * Accessibility hook for Color Dash.
 * Provides helpers for screen reader announcements,
 * reduced motion preferences, and accessible labels.
 */
import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

export function useAccessibility() {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);

  useEffect(() => {
    // Check initial state
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);
    AccessibilityInfo.isReduceMotionEnabled().then(setIsReduceMotionEnabled);

    // Listen for changes
    const srSub = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );
    const rmSub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReduceMotionEnabled
    );

    return () => {
      srSub.remove();
      rmSub.remove();
    };
  }, []);

  /**
   * Announce a message to screen readers.
   */
  const announce = useCallback((message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  }, []);

  return {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    announce,
  };
}
