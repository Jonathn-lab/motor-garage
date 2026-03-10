/**
 * Car Detail Layout - app/car/[id]/_layout.tsx
 *
 * Nested Stack navigator for a single car.  All sub-screens (car detail,
 * edit, mods CRUD, maintenance CRUD, performance CRUD) live here.
 * "Add" screens use the 'modal' presentation so they slide up from the bottom.
 * The car detail index uses a transparent header so the hero section
 * extends behind the navigation bar.
 */

import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function CarLayout() {
  /** Resolve dark/light mode for header styling. */
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const headerBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const headerTint = isDark ? '#ECEDEE' : '#11181C';

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: headerBg },
        headerTintColor: headerTint,
      }}
    >
      {/* Car detail -- transparent header so the hero fills the top. */}
      <Stack.Screen name="index" options={{ title: '', headerTransparent: true }} />

      {/* Edit car form. */}
      <Stack.Screen name="edit" options={{ title: 'Edit Car' }} />

      {/* Mods sub-routes. */}
      <Stack.Screen name="mods/index" options={{ title: 'Mods' }} />
      <Stack.Screen name="mods/add" options={{ title: 'Add Mod', presentation: 'modal' }} />
      <Stack.Screen name="mods/[modId]" options={{ title: 'Edit Mod' }} />

      {/* Maintenance sub-routes. */}
      <Stack.Screen name="maintenance/index" options={{ title: 'Maintenance' }} />
      <Stack.Screen name="maintenance/add" options={{ title: 'Add Maintenance', presentation: 'modal' }} />
      <Stack.Screen name="maintenance/[entryId]" options={{ title: 'Edit Maintenance' }} />

      {/* Performance sub-routes. */}
      <Stack.Screen name="performance/index" options={{ title: 'Performance' }} />
      <Stack.Screen name="performance/add" options={{ title: 'Add Entry', presentation: 'modal' }} />
      <Stack.Screen name="performance/[entryId]" options={{ title: 'Edit Entry' }} />
    </Stack>
  );
}
