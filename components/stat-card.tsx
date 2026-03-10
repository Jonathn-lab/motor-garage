/**
 * StatCard Component - components/stat-card.tsx
 *
 * A compact card that displays a single numeric or formatted statistic
 * (e.g. "3" with label "Cars", or "$2,725" with label "Invested").
 * Used in rows on the Garage and Car Detail screens for at-a-glance
 * summary info.
 */

import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

/** Props for the StatCard component. */
interface StatCardProps {
  /** Short description shown below the value (e.g. "Mods", "Total"). */
  label: string;
  /** The stat value -- either a number or a pre-formatted string. */
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'cardBorder');
  const accent = useThemeColor({}, 'accent');

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor }]}>
      <ThemedText style={[styles.value, { color: accent }]}>{value}</ThemedText>
      <ThemedText style={styles.label} lightColor="#687076" darkColor="#9BA1A6">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
