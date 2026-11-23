import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';

/** The interface has a single dark theme (see src/theme.ts): light status bar on every screen. */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ contentStyle: { backgroundColor: colors.app }, headerShown: false }} />
    </>
  );
}
