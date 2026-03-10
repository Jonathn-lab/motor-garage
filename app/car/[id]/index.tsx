/**
 * Car Detail Screen - app/car/[id]/index.tsx
 *
 * The main dashboard for a single car.  Shows:
 *  - Hero section with car icon, nickname, year/make/model/trim, mileage
 *  - Quick-action buttons (Edit, Delete)
 *  - Optional specs grid (engine, drivetrain, HP, etc.)
 *  - Stats overview (mod count, mod cost, total invested)
 *  - Recent mods, maintenance records, and performance entries (3 each)
 *    with "See All" links to the full list screens
 *  - Inline "Add" buttons to create new records directly from the dashboard
 *
 * All data is refreshed via useFocusEffect so changes on sub-screens
 * (edit, add mod, etc.) are reflected immediately when the user returns.
 */

import { useCallback, useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getCar, getCarStats, getModsForCar, getMaintenanceForCar, getPerformanceForCar, deleteCar } from '@/app/_db/db';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { SectionHeader } from '@/components/section-header';
import { ModRow } from '@/components/mod-row';
import { MaintenanceRow } from '@/components/maintenance-row';
import { StatCard } from '@/components/stat-card';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatMileage, formatCurrency, formatDate } from '@/utils/format';
import type { Car, Mod, MaintenanceEntry, PerformanceEntry } from '@/types/models';
import * as Haptics from 'expo-haptics';

export default function CarDetail() {
  /** Extract the dynamic [id] segment from the URL. */
  const { id } = useLocalSearchParams();
  const carId = id as string;
  const router = useRouter();

  /* ── State ───────────────────────────────────────────── */
  const [car, setCar] = useState<Car | null>(null);
  const [stats, setStats] = useState({ modCount: 0, modCost: 0, maintenanceCount: 0, maintenanceCost: 0, totalInvested: 0 });
  const [recentMods, setRecentMods] = useState<Mod[]>([]);
  const [recentMaintenance, setRecentMaintenance] = useState<MaintenanceEntry[]>([]);
  const [performanceEntries, setPerformanceEntries] = useState<PerformanceEntry[]>([]);
  /** Controls visibility of the delete-confirmation dialog. */
  const [showDelete, setShowDelete] = useState(false);

  /* ── Theme colours ───────────────────────────────────── */
  const bg = useThemeColor({}, 'background');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'cardBorder');
  const accent = useThemeColor({}, 'accent');
  const secondaryText = useThemeColor({}, 'textSecondary');
  const danger = useThemeColor({}, 'danger');

  /**
   * Refresh all data for this car every time the screen gains focus.
   * Only the three most recent entries are kept for each category to
   * keep the dashboard compact; full lists are available via "See All".
   */
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const c = await getCar(carId);
        setCar(c);
        setStats(await getCarStats(carId));
        setRecentMods((await getModsForCar(carId)).slice(0, 3));
        setRecentMaintenance((await getMaintenanceForCar(carId)).slice(0, 3));
        setPerformanceEntries((await getPerformanceForCar(carId)).slice(0, 3));
      })();
    }, [carId])
  );

  /* Render nothing until the car has loaded. */
  if (!car) return null;

  /**
   * Build an array of spec chips from the car's optional fields.
   * Null entries are filtered out so only populated specs are shown.
   */
  const specs: { label: string; value: string }[] = [
    car.engine ? { label: 'Engine', value: car.engine } : null,
    car.drivetrain ? { label: 'Drivetrain', value: car.drivetrain } : null,
    car.transmission ? { label: 'Trans', value: car.transmission } : null,
    car.horsepower ? { label: 'HP', value: `${car.horsepower}` } : null,
    car.torque ? { label: 'Torque', value: `${car.torque} lb-ft` } : null,
    car.zeroToSixty ? { label: '0-60', value: `${car.zeroToSixty}s` } : null,
  ].filter((s): s is { label: string; value: string } => s !== null);

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: cardBg, borderColor }]}>
        {car.photoUri ? (
          <Image source={{ uri: car.photoUri }} style={styles.heroPhoto} contentFit="cover" />
        ) : (
          <View style={styles.heroIcon}>
            <IconSymbol name="car.fill" size={56} color={accent} />
          </View>
        )}
        <ThemedText style={styles.nickname}>{car.nickname}</ThemedText>
        <ThemedText style={[styles.ymmt, { color: secondaryText }]}>
          {car.year} {car.make} {car.model} {car.trim}
        </ThemedText>
        <ThemedText style={[styles.mileage, { color: accent }]}>
          {formatMileage(car.mileage)}
        </ThemedText>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <Pressable
          onPress={() => router.push(`/car/${carId}/edit` as any)}
          style={[styles.actionBtn, { backgroundColor: cardBg, borderColor }]}
        >
          <IconSymbol name="pencil" size={18} color={accent} />
          <ThemedText style={[styles.actionText, { color: accent }]}>Edit</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setShowDelete(true)}
          style={[styles.actionBtn, { backgroundColor: cardBg, borderColor }]}
        >
          <IconSymbol name="trash" size={18} color={danger} />
          <ThemedText style={[styles.actionText, { color: danger }]}>Delete</ThemedText>
        </Pressable>
      </View>

      {/* Specs */}
      {specs.length > 0 && (
        <>
          <SectionHeader title="Specs" />
          <View style={styles.specsGrid}>
            {specs.map((spec) => (
              <View key={spec.label} style={[styles.specItem, { backgroundColor: cardBg, borderColor }]}>
                <ThemedText style={[styles.specLabel, { color: secondaryText }]}>{spec.label}</ThemedText>
                <ThemedText style={styles.specValue}>{spec.value}</ThemedText>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Stats */}
      <SectionHeader title="Overview" />
      <View style={styles.statsRow}>
        <StatCard label="Mods" value={stats.modCount} />
        <View style={{ width: 8 }} />
        <StatCard label="Mod Cost" value={formatCurrency(stats.modCost)} />
        <View style={{ width: 8 }} />
        <StatCard label="Total" value={formatCurrency(stats.totalInvested)} />
      </View>

      {/* Recent Mods */}
      <SectionHeader
        title="Mods"
        actionLabel="See All"
        onAction={() => router.push(`/car/${carId}/mods` as any)}
      />
      {recentMods.length === 0 ? (
        <ThemedText style={[styles.emptyText, { color: secondaryText }]}>No mods yet</ThemedText>
      ) : (
        recentMods.map((mod) => (
          <ModRow
            key={mod.id}
            title={mod.title}
            category={mod.category}
            cost={mod.cost}
            status={mod.status}
            onPress={() => router.push(`/car/${carId}/mods/${mod.id}` as any)}
          />
        ))
      )}
      <Pressable
        onPress={() => router.push(`/car/${carId}/mods/add` as any)}
        style={[styles.addRowBtn, { borderColor }]}
      >
        <IconSymbol name="plus" size={16} color={accent} />
        <ThemedText style={[styles.addRowText, { color: accent }]}>Add Mod</ThemedText>
      </Pressable>

      {/* Recent Maintenance */}
      <SectionHeader
        title="Maintenance"
        actionLabel="See All"
        onAction={() => router.push(`/car/${carId}/maintenance` as any)}
      />
      {recentMaintenance.length === 0 ? (
        <ThemedText style={[styles.emptyText, { color: secondaryText }]}>No maintenance records</ThemedText>
      ) : (
        recentMaintenance.map((entry) => (
          <MaintenanceRow
            key={entry.id}
            serviceType={entry.serviceType}
            date={entry.date}
            mileage={entry.mileage}
            cost={entry.cost}
            onPress={() => router.push(`/car/${carId}/maintenance/${entry.id}` as any)}
          />
        ))
      )}
      <Pressable
        onPress={() => router.push(`/car/${carId}/maintenance/add` as any)}
        style={[styles.addRowBtn, { borderColor }]}
      >
        <IconSymbol name="plus" size={16} color={accent} />
        <ThemedText style={[styles.addRowText, { color: accent }]}>Add Maintenance</ThemedText>
      </Pressable>

      {/* Performance */}
      <SectionHeader
        title="Performance"
        actionLabel="See All"
        onAction={() => router.push(`/car/${carId}/performance` as any)}
      />
      {performanceEntries.length === 0 ? (
        <ThemedText style={[styles.emptyText, { color: secondaryText }]}>No performance entries</ThemedText>
      ) : (
        performanceEntries.map((entry) => (
          <Pressable
            key={entry.id}
            onPress={() => router.push(`/car/${carId}/performance/${entry.id}` as any)}
            style={[styles.perfRow, { backgroundColor: cardBg, borderColor }]}
          >
            <View>
              <ThemedText style={styles.perfDate}>{formatDate(entry.date)}</ThemedText>
              <ThemedText style={[styles.perfMeta, { color: secondaryText }]}>
                {[
                  entry.hp && `${entry.hp} HP`,
                  entry.torque && `${entry.torque} lb-ft`,
                  entry.zeroToSixty && `0-60: ${entry.zeroToSixty}s`,
                ].filter(Boolean).join(' \u00B7 ') || 'No data'}
              </ThemedText>
            </View>
          </Pressable>
        ))
      )}
      <Pressable
        onPress={() => router.push(`/car/${carId}/performance/add` as any)}
        style={[styles.addRowBtn, { borderColor }]}
      >
        <IconSymbol name="plus" size={16} color={accent} />
        <ThemedText style={[styles.addRowText, { color: accent }]}>Add Entry</ThemedText>
      </Pressable>

      <View style={styles.bottomSpacer} />

      <ConfirmDialog
        visible={showDelete}
        title="Delete Car"
        message={`Delete "${car.nickname}" and all its mods, maintenance, and performance data? This cannot be undone.`}
        onConfirm={async () => {
          await deleteCar(carId);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setShowDelete(false);
          router.back();
        }}
        onCancel={() => setShowDelete(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 100,
  },
  hero: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  heroPhoto: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 12,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(59,130,246,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nickname: {
    fontSize: 24,
    fontWeight: '800',
  },
  ymmt: {
    fontSize: 15,
    marginTop: 4,
  },
  mileage: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  specLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    paddingVertical: 8,
  },
  addRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 4,
    gap: 6,
  },
  addRowText: {
    fontSize: 14,
    fontWeight: '600',
  },
  perfRow: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  perfDate: {
    fontSize: 15,
    fontWeight: '600',
  },
  perfMeta: {
    fontSize: 13,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});
