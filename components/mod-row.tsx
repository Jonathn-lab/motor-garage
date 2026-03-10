/**
 * ModRow Component - components/mod-row.tsx
 *
 * A pressable list row representing a single car modification.
 * Shows the mod title, a category badge, a coloured status dot, and
 * the cost.  Status colours: green = installed, amber = ordered,
 * blue = planned, grey = removed/other.
 */

import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatCurrency, formatModCategory } from '@/utils/format';

/** Props for the ModRow component. */
interface ModRowProps {
  title: string;
  category: string;
  cost: number;
  status: string;
  onPress: () => void;
}

export function ModRow({ title, category, cost, status, onPress }: ModRowProps) {
  /* Theme colours. */
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'cardBorder');
  const secondaryText = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');

  /** Map mod status to a dot colour for quick visual identification. */
  const statusColor =
    status === 'installed' ? success :
    status === 'ordered' ? warning :
    status === 'planned' ? accent : secondaryText;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: cardBg, borderColor, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={styles.content}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <View style={styles.meta}>
          <View style={[styles.badge, { backgroundColor: `${accent}20` }]}>
            <ThemedText style={[styles.badgeText, { color: accent }]}>
              {formatModCategory(category)}
            </ThemedText>
          </View>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <ThemedText style={[styles.statusText, { color: secondaryText }]}>
            {status}
          </ThemedText>
        </View>
      </View>
      <ThemedText style={[styles.cost, { color: accent }]}>{formatCurrency(cost)}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  cost: {
    fontSize: 15,
    fontWeight: '700',
  },
});
