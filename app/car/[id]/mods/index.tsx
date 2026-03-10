/**
 * Mods List Screen - app/car/[id]/mods/index.tsx
 *
 * Displays all mods for a given car with inline category and status
 * filter pills.  A cost-summary header shows the filtered mod count
 * and total cost.  Tapping a mod navigates to its edit screen; the FAB
 * in the bottom-right opens the "Add Mod" modal.
 *
 * Only categories that already have at least one mod are shown as
 * filter pills, keeping the UI uncluttered.
 */

import { useCallback, useState } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getModsForCar } from '@/app/_db/db';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ModRow } from '@/components/mod-row';
import { EmptyState } from '@/components/empty-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatCurrency } from '@/utils/format';
import { MOD_CATEGORIES, MOD_STATUSES } from '@/types/models';
import type { Mod } from '@/types/models';

export default function ModsList() {
  /** Extract the car id from the URL. */
  const { id } = useLocalSearchParams();
  const carId = id as string;
  const router = useRouter();

  /** All mods for this car (unfiltered source of truth). */
  const [mods, setMods] = useState<Mod[]>([]);
  /** Currently-selected category filter (empty string = "All"). */
  const [filterCategory, setFilterCategory] = useState('');
  /** Currently-selected status filter (empty string = all statuses). */
  const [filterStatus, setFilterStatus] = useState('');

  /* Theme colours. */
  const bg = useThemeColor({}, 'background');
  const accent = useThemeColor({}, 'accent');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'cardBorder');
  const secondaryText = useThemeColor({}, 'textSecondary');

  /** Refresh the mods list every time the screen regains focus. */
  useFocusEffect(
    useCallback(() => {
      getModsForCar(carId).then(setMods);
    }, [carId])
  );

  /** Apply the active category and status filters. */
  const filtered = mods.filter((m) => {
    if (filterCategory && m.category !== filterCategory) return false;
    if (filterStatus && m.status !== filterStatus) return false;
    return true;
  });

  /** Total cost of the currently-visible (filtered) mods. */
  const totalCost = filtered.reduce((sum, m) => sum + (m.cost || 0), 0);

  /** Only show category pills for categories that are actually in use. */
  const categories = MOD_CATEGORIES.filter((c) => mods.some((m) => m.category === c.value));

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            {/* Filter pills */}
            <View style={styles.filterRow}>
              <Pressable
                onPress={() => setFilterCategory('')}
                style={[styles.pill, !filterCategory && { backgroundColor: accent }]}
              >
                <ThemedText style={[styles.pillText, !filterCategory && { color: '#FFF' }]}>All</ThemedText>
              </Pressable>
              {categories.map((cat) => (
                <Pressable
                  key={cat.value}
                  onPress={() => setFilterCategory(filterCategory === cat.value ? '' : cat.value)}
                  style={[
                    styles.pill,
                    { borderColor },
                    filterCategory === cat.value && { backgroundColor: accent },
                  ]}
                >
                  <ThemedText
                    style={[styles.pillText, filterCategory === cat.value && { color: '#FFF' }]}
                  >
                    {cat.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            {/* Status filter */}
            <View style={styles.filterRow}>
              {MOD_STATUSES.map((s) => (
                <Pressable
                  key={s.value}
                  onPress={() => setFilterStatus(filterStatus === s.value ? '' : s.value)}
                  style={[
                    styles.pill,
                    { borderColor },
                    filterStatus === s.value && { backgroundColor: accent },
                  ]}
                >
                  <ThemedText
                    style={[styles.pillText, filterStatus === s.value && { color: '#FFF' }]}
                  >
                    {s.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            {/* Cost summary */}
            <View style={[styles.costSummary, { backgroundColor: cardBg, borderColor }]}>
              <ThemedText style={[styles.costLabel, { color: secondaryText }]}>
                {filtered.length} mod{filtered.length !== 1 ? 's' : ''}
              </ThemedText>
              <ThemedText style={[styles.costValue, { color: accent }]}>
                {formatCurrency(totalCost)}
              </ThemedText>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="wrench.fill"
            message="No mods yet"
            actionLabel="Add First Mod"
            onAction={() => router.push(`/car/${carId}/mods/add` as any)}
          />
        }
        renderItem={({ item }) => (
          <ModRow
            title={item.title}
            category={item.category}
            cost={item.cost}
            status={item.status}
            onPress={() => router.push(`/car/${carId}/mods/${item.id}` as any)}
          />
        )}
      />
      <Pressable
        onPress={() => router.push(`/car/${carId}/mods/add` as any)}
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
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
