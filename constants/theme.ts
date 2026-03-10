/**
 * Theme Constants - constants/theme.ts
 *
 * Defines the colour palette for light and dark modes and platform-aware
 * font family mappings.  Colours are consumed by the `useThemeColor` hook
 * and directly in layout files.
 */

import { Platform } from 'react-native';

/** Tint colour used for interactive elements in light mode. */
const tintColorLight = '#0a7ea4';
/** Tint colour used for interactive elements in dark mode. */
const tintColorDark = '#fff';

/**
 * Full colour palettes for both light and dark themes.
 * Keys are referenced via the `useThemeColor` hook throughout the app.
 */
export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    background: '#F5F5F5',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    accent: '#3B82F6',
    danger: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
    inputBackground: '#FFFFFF',
    inputBorder: '#CBD5E1',
    separator: '#E2E8F0',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#0D0D0D',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#1A1A1A',
    cardBorder: '#2A2A2A',
    accent: '#3B82F6',
    danger: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
    inputBackground: '#1A1A1A',
    inputBorder: '#333333',
    separator: '#2A2A2A',
  },
};

/**
 * Platform-specific font families.
 * iOS uses system-ui variants; Android/default falls back to generic
 * family names; web uses a full CSS font stack.
 */
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
