/**
 * Auth Layout - app/(auth)/_layout.tsx
 *
 * Simple Stack layout for the authentication screens.
 * No header, themed background matching the rest of the app.
 */

import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? '#0D0D0D' : '#F5F5F5' },
      }}
    />
  );
}
