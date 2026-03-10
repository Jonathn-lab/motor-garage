/**
 * Root Layout - app/_layout.js
 *
 * Top-level layout for the Expo Router application. Initializes the SQLite
 * database before any screen renders, wraps the app in AuthProvider, and
 * gates routing so unauthenticated users see the login screen.
 */
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '@/hooks/use-auth';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDark ? '#0D0D0D' : '#F5F5F5' },
        }}
      >
        {/* Index redirect screen */}
        <Stack.Screen name="index" />

        {/* Auth screens (login / sign-up) */}
        <Stack.Screen name="(auth)" />

        {/* Tab navigator (Garage, etc.) */}
        <Stack.Screen name="(tabs)" />

        {/* Add-car modal -- slides up over the current screen. */}
        <Stack.Screen
          name="car/add"
          options={{
            headerShown: true,
            title: 'Add Car',
            presentation: 'modal',
            headerStyle: { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' },
            headerTintColor: isDark ? '#ECEDEE' : '#11181C',
          }}
        />

        {/* Per-car detail stack (index, edit, mods, maintenance, performance). */}
        <Stack.Screen
          name="car/[id]"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}
