/**
 * MaintenanceRow Component - components/maintenance-row.tsx
 *
 * A pressable list row representing a single maintenance record.
 * Displays the service type (human-readable label), date, optional
 * mileage, and cost.  Tapping the row navigates to the edit screen.
 */

import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatCurrency, formatDate, formatServiceType, formatMileage } from '@/utils/format';

/** Props for the MaintenanceRow component. */
interface MaintenanceRowProps {
  serviceType: string;
  date: string;
  mileage: number | null;
  cost: number;
  onPress: () => void;
}

export function MaintenanceRow({ serviceType, date, mileage, cost, onPress }: MaintenanceRowProps) {
  /* Theme colours. */
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'cardBorder');
  const secondaryText = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: cardBg, borderColor, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={styles.content}>
        <ThemedText style={styles.title}>{formatServiceType(serviceType)}</ThemedText>
        <ThemedText style={[styles.meta, { color: secondaryText }]}>
          {formatDate(date)}
          {mileage ? ` \u00B7 ${formatMileage(mileage)}` : ''}
        </ThemedText>
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
    fontSize: 13,
    marginTop: 4,
  },
  cost: {
    fontSize: 15,
    fontWeight: '700',
  },
});
