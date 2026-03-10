/**
 * Tabs Layout - app/(tabs)/_layout.js
 *
 * Configures the bottom-tab navigator with Garage, Market, and Profile tabs.
 * Uses custom PNG icons for the tab bar and the project's shared
 * Colors theme for consistent dark/light styling.
 */

import { Tabs } from 'expo-router';
import { Image, useColorScheme } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';

const garageIcon = require('@/assets/images/tab-garage.png');
const marketIcon = require('@/assets/images/tab-market.png');
const profileIcon = require('@/assets/images/tab-profile.png');

export default function TabsLayout() {
  /** Resolve the current color scheme, defaulting to 'light'. */
  const colorScheme = useColorScheme() ?? 'light';

  /** Pull the full palette for the active scheme. */
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        /* Center-align header titles on both platforms. */
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        /* Active / inactive tab icon colours. */
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.cardBorder,
        },
        /* HapticTab provides light haptic feedback on every tab press. */
        tabBarButton: HapticTab,
      }}
    >
      {/* Garage tab -- the main list of user cars. */}
      <Tabs.Screen
        name="garage"
        options={{
          title: 'Garage',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={garageIcon}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* Market tab -- cars listed for sale. */}
      <Tabs.Screen
        name="market"
        options={{
          title: 'Market',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={marketIcon}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* Profile tab -- user profile and settings. */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={profileIcon}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
