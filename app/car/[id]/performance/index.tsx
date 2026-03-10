/**
 * Performance List Screen - app/car/[id]/performance/index.tsx
 *
 * Displays all performance entries for a given car in a FlatList, sorted
 * by date descending.  Each card shows available metrics (HP, WHP,
 * torque, 0-60, 1/4 mi, RPM) and optional notes.  A FAB opens the
 * "Add Entry" modal.
 */

import { useCallback, useState } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getPerformanceForCar } from '@/app/_db/db';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { EmptyState } from '@/components/empty-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatDate } from '@/utils/format';
import type { PerformanceEntry } from '@/types/models';

export default function PerformanceList() {
  /** Extract the car id from the URL. */
  const { id } = useLocalSearchParams();
  const carId = id as string;
  const router = useRouter();

  /** All performance entries for this car. */
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);

  /* Theme colours. */
  const bg = useThemeColor({}, 'background');
  const accent = useThemeColor({}, 'accent');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'cardBorder');
  const secondaryText = useThemeColor({}, 'textSecondary');

  /** Refresh the list every time the screen regains focus. */
  useFocusEffect(
    useCallback(() => {
      getPerformanceForCar(carId).then(setEntries);
    }, [carId])
  );

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="speedometer"
            message="No performance entries"
            actionLabel="Add First Entry"
            onAction={() => router.push(`/car/${carId}/performance/add` as any)}
          />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/car/${carId}/performance/${item.id}` as any)}
            style={({ pressed }) => [
              styles.row,
              { backgroundColor: cardBg, borderColor, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <View style={styles.rowHeader}>
              <ThemedText style={styles.rowDate}>{formatDate(item.date)}</ThemedText>
            </View>
            <View style={styles.statsGrid}>
              {item.hp != null && (
                <View style={styles.statItem}>
                  <ThemedText style={[styles.statValue, { color: accent }]}>{item.hp}</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: secondaryText }]}>HP</ThemedText>
                </View>
              )}
              {item.whp != null && (
                <View style={styles.statItem}>
                  <ThemedText style={[styles.statValue, { color: accent }]}>{item.whp}</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: secondaryText }]}>WHP</ThemedText>
                </View>
              )}
              {item.torque != null && (
                <View style={styles.statItem}>
                  <ThemedText style={[styles.statValue, { color: accent }]}>{item.torque}</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: secondaryText }]}>lb-ft</ThemedText>
                </View>
              )}
              {item.zeroToSixty != null && (
                <View style={styles.statItem}>
                  <ThemedText style={[styles.statValue, { color: accent }]}>{item.zeroToSixty}s</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: secondaryText }]}>0-60</ThemedText>
                </View>
              )}
              {item.quarterMile != null && (
                <View style={styles.statItem}>
                  <ThemedText style={[styles.statValue, { color: accent }]}>{item.quarterMile}s</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: secondaryText }]}>1/4 mi</ThemedText>
                </View>
              )}
              {item.rpm != null && (
                <View style={styles.statItem}>
                  <ThemedText style={[styles.statValue, { color: accent }]}>{item.rpm}</ThemedText>
                  <ThemedText style={[styles.statLabel, { color: secondaryText }]}>RPM</ThemedText>
                </View>
              )}
            </View>
            {item.notes ? (
              <ThemedText style={[styles.notes, { color: secondaryText }]} numberOfLines={2}>
                {item.notes}
              </ThemedText>
            ) : null}
          </Pressable>
        )}
      />
      <Pressable
        onPress={() => router.push(`/car/${carId}/performance/add` as any)}
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
  row: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  rowHeader: {
    marginBottom: 8,
  },
  rowDate: {
    fontSize: 15,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 50,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  notes: {
    fontSize: 13,
    marginTop: 8,
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
