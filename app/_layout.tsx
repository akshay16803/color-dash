/**
 * Root layout for Color Dash.
 * Initializes Firebase Analytics and defines the navigation stack.
 */
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { initAnalytics } from '@/utils/analytics';
import { ensureAuthenticated } from '@/utils/firestore';
import { THEME } from '@/config/theme';

export default function RootLayout() {
  useEffect(() => {
    // Initialize Firebase Analytics and authenticate user on app start
    initAnalytics();
    ensureAuthenticated();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: THEME.colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
        <Stack.Screen
          name="leaderboard"
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
});
