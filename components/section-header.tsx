/**
 * SectionHeader Component - components/section-header.tsx
 *
 * A simple row used to separate content sections on detail screens.
 * Displays a bold title on the left and an optional action link
 * (e.g. "See All") on the right.
 */

import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

/** Props for the SectionHeader component. */
interface SectionHeaderProps {
  /** Section title (e.g. "Mods", "Maintenance"). */
  title: string;
  /** Optional action-link label (e.g. "See All"). */
  actionLabel?: string;
  /** Callback fired when the action link is pressed. */
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  const accent = useThemeColor({}, 'accent');

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <ThemedText style={[styles.action, { color: accent }]}>{actionLabel}</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
  },
});
