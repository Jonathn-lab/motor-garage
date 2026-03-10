/**
 * Market Screen - app/(tabs)/market.tsx
 *
 * Shows all cars that are listed for sale. Reuses CarCard for display.
 * Refreshes on every focus so newly listed/unlisted cars appear immediately.
 */

import { useCallback, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { getCarsForSale, getCarStats } from '@/app/_db/db';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CarCard } from '@/components/car-card';
import { EmptyState } from '@/components/empty-state';
import type { Car } from '@/types/models';

export default function MarketScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [carStatsMap, setCarStatsMap] = useState<Record<string, any>>({});

  const router = useRouter();
  const bg = useThemeColor({}, 'background');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const allCars = await getCarsForSale();
        setCars(allCars);
        const map: Record<string, any> = {};
        for (const car of allCars) {
          map[car.id] = await getCarStats(car.id);
        }
        setCarStatsMap(map);
      })();
    }, [])
  );

  const header = (
    <View style={styles.titleRow}>
      <ThemedText style={styles.title}>Market</ThemedText>
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
            icon="tray.fill"
            message="No cars listed for sale yet"
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
  },
  titleRow: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
});
