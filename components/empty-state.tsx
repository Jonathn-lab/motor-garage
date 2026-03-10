/**
 * EmptyState Component - components/empty-state.tsx
 *
 * Placeholder UI shown inside FlatLists (or anywhere) when there is no
 * data to display.  Renders a large icon, a descriptive message, and an
 * optional action button (e.g. "Add Your First Car").
 */

import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

/** Props for the EmptyState component. */
interface EmptyStateProps {
  /** SF Symbol name for the large icon (defaults to 'tray.fill'). */
  icon?: React.ComponentProps<typeof IconSymbol>['name'];
  /** Message displayed below the icon. */
  message: string;
  /** Optional label for the CTA button. */
  actionLabel?: string;
  /** Callback fired when the CTA button is pressed. */
  onAction?: () => void;
}

export function EmptyState({ icon = 'tray.fill', message, actionLabel, onAction }: EmptyStateProps) {
  const secondaryText = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');

  return (
    <View style={styles.container}>
      <IconSymbol name={icon} size={48} color={secondaryText} />
      <ThemedText style={[styles.message, { color: secondaryText }]}>{message}</ThemedText>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} style={[styles.button, { backgroundColor: accent }]}>
          <ThemedText style={styles.buttonText}>{actionLabel}</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
