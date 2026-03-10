/**
 * Maintenance List Screen - app/car/[id]/maintenance/index.tsx
 *
 * Displays all maintenance records for a given car in a FlatList, sorted
 * by date descending.  A cost-summary header shows the record count and
 * total spend.  A floating action button (FAB) in the bottom-right
 * corner opens the "Add Maintenance" modal.  The list also offers an
 * empty-state placeholder when no records exist yet.
 */

import { useCallback, useState } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getMaintenanceForCar } from '@/app/_db/db';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaintenanceRow } from '@/components/maintenance-row';
import { EmptyState } from '@/components/empty-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatCurrency } from '@/utils/format';
import { ThemedText } from '@/components/themed-text';
import type { MaintenanceEntry } from '@/types/models';

export default function MaintenanceList() {
  /** Extract the car id from the URL. */
  const { id } = useLocalSearchParams();
  const carId = id as string;
  const router = useRouter();

  /** All maintenance records for this car. */
  const [entries, setEntries] = useState<MaintenanceEntry[]>([]);

  /* Theme colours. */
  const bg = useThemeColor({}, 'background');
  const accent = useThemeColor({}, 'accent');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'cardBorder');
  const secondaryText = useThemeColor({}, 'textSecondary');

  /** Refresh the list every time the screen regains focus. */
  useFocusEffect(
    useCallback(() => {
      getMaintenanceForCar(carId).then(setEntries);
    }, [carId])
  );

  /** Sum of all maintenance costs for the header. */
  const totalCost = entries.reduce((sum, e) => sum + (e.cost || 0), 0);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          entries.length > 0 ? (
            <View style={[styles.costSummary, { backgroundColor: cardBg, borderColor }]}>
              <ThemedText style={[styles.costLabel, { color: secondaryText }]}>
                {entries.length} record{entries.length !== 1 ? 's' : ''}
              </ThemedText>
              <ThemedText style={[styles.costValue, { color: accent }]}>
                {formatCurrency(totalCost)}
              </ThemedText>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="wrench.fill"
            message="No maintenance records"
            actionLabel="Add First Record"
            onAction={() => router.push(`/car/${carId}/maintenance/add` as any)}
          />
        }
        renderItem={({ item }) => (
          <MaintenanceRow
            serviceType={item.serviceType}
            date={item.date}
            mileage={item.mileage}
            cost={item.cost}
            onPress={() => router.push(`/car/${carId}/maintenance/${item.id}` as any)}
          />
        )}
      />
      <Pressable
        onPress={() => router.push(`/car/${carId}/maintenance/add` as any)}
        style={[styles.fab, { backgroundColor: accent }]}
      >
        <IconSymbol name="plus" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  costSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  costLabel: {
    fontSize: 14,
  },
  costValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
