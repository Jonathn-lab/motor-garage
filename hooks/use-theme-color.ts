/**
 * useThemeColor Hook - hooks/use-theme-color.ts
 *
 * Resolves a colour value for the current colour scheme (light or dark).
 *
 * Usage:
 *   const bg = useThemeColor({}, 'background');
 *   const customBg = useThemeColor({ light: '#FFF', dark: '#000' }, 'background');
 *
 * If per-scheme overrides are passed via `props`, those take priority.
 * Otherwise the value is looked up from the shared Colors palette.
 *
 * @see https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  /** Default to 'light' when the system scheme is indeterminate. */
  const theme = useColorScheme() ?? 'light';

  /** Check for a caller-supplied override for the active scheme. */
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    /* Fall back to the palette defined in constants/theme.ts. */
    return Colors[theme][colorName];
  }
}
