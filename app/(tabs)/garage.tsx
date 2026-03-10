/**
 * Garage Screen - app/(tabs)/garage.tsx
 *
 * The main landing screen.  Displays a summary row of garage-wide stats
 * (cars, mods, total invested) and a scrollable list of CarCards.  The
 * user can tap "Add Car" to open the add-car modal or tap a car card to
 * navigate to that car's detail page.
 *
 * Data is refreshed every time the screen regains focus (via useFocusEffect)
 * so edits made on other screens are immediately reflected.
 */

import { useCallback, useState } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { getCars, getGarageStats, getCarStats } from '@/app/_db/db';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/hooks/use-auth';
import { StatCard } from '@/components/stat-card';
import { CarCard } from '@/components/car-card';
import { EmptyState } from '@/components/empty-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatCurrency } from '@/utils/format';
import type { Car } from '@/types/models';

export default function Garage() {
  /** List of all cars in the garage. */
  const [cars, setCars] = useState<Car[]>([]);

  /** Garage-wide aggregate stats (car count, mod count, total invested). */
  const [stats, setStats] = useState({ carCount: 0, modCount: 0, totalInvested: 0 });

  /** Per-car stats keyed by car id -- used to show mod count & invested on each card. */
  const [carStatsMap, setCarStatsMap] = useState<Record<string, any>>({});

  const router = useRouter();
  const { user } = useAuth();
  const bg = useThemeColor({}, 'background');
  const accent = useThemeColor({}, 'accent');

  /**
   * Refresh all data every time this screen gains focus.
   * Fetches cars, garage stats, and per-car stats in one pass.
   */
  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      (async () => {
        const allCars = await getCars(user.id);
        setCars(allCars);
        setStats(await getGarageStats(user.id));
        const map: Record<string, any> = {};
        for (const car of allCars) {
          map[car.id] = await getCarStats(car.id);
        }
        setCarStatsMap(map);
      })();
    }, [user])
  );

  /* ---------- List header (title row + stats row) ---------- */
  const header = (
    <View>
      {/* Title + "Add Car" button */}
      <View style={styles.titleRow}>
        <ThemedText style={styles.title}>My Garage</ThemedText>
        <Pressable
          onPress={() => router.push('/car/add' as any)}
          style={[styles.addButton, { backgroundColor: accent }]}
        >
          <IconSymbol name="plus" size={20} color="#FFFFFF" />
          <ThemedText style={styles.addButtonText}>Add Car</ThemedText>
        </Pressable>
      </View>

      {/* Garage-wide stat cards */}
      <View style={styles.statsRow}>
        <StatCard label="Cars" value={stats.carCount} />
        <View style={{ width: 8 }} />
        <StatCard label="Mods" value={stats.modCount} />
        <View style={{ width: 8 }} />
        <StatCard label="Invested" value={formatCurrency(stats.totalInvested)} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <FlatList
        data={cars}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon="car.fill"
            message="No cars in your garage yet"
            actionLabel="Add Your First Car"
            onAction={() => router.push('/car/add' as any)}
          />
        }
        renderItem={({ item }) => {
          const cs = carStatsMap[item.id] || {};
          return (
            <CarCard
              nickname={item.nickname}
              year={item.year}
              make={item.make}
              model={item.model}
              trim={item.trim}
              mileage={item.mileage}
              modCount={cs.modCount || 0}
              totalInvested={cs.totalInvested || 0}
              photoUri={item.photoUri}
              forSale={item.forSale}
              askingPrice={item.askingPrice}
              onPress={() => router.push(`/car/${item.id}` as any)}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});
