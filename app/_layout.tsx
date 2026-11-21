import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerBackTitle: 'Retour' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="ticket/new"
          options={{ title: 'Nouveau ticket ITIL', presentation: 'modal' }}
        />
        <Stack.Screen name="ticket/[id]" options={{ title: 'Detail du ticket' }} />
        <Stack.Screen name="settings" options={{ title: 'Serveur On-Prem & Auth' }} />
      </Stack>
    </>
  );
}
