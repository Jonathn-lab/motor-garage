/**
 * CarCard Component - components/car-card.tsx
 *
 * A pressable card used on the Garage screen to represent a single car.
 * Shows the car's nickname, year/make/model/trim, and three inline stats
 * (mileage, mod count, total invested).  Tapping the card navigates to
 * the car's detail page.
 */

import { StyleSheet, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatMileage, formatCurrency } from '@/utils/format';
import { IconSymbol } from '@/components/ui/icon-symbol';

/** Props accepted by the CarCard component. */
interface CarCardProps {
  nickname: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  modCount: number;
  totalInvested: number;
  photoUri?: string | null;
  forSale?: boolean;
  askingPrice?: number | null;
  onPress: () => void;
}

export function CarCard({
  nickname, year, make, model, trim, mileage,
  modCount, totalInvested, photoUri, forSale, askingPrice, onPress,
}: CarCardProps) {
  /* Theme colours for the card background, border, text, and accent. */
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'cardBorder');
  const secondaryText = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');
  const success = useThemeColor({}, 'success');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: cardBg, borderColor, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={styles.header}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.thumbnail} contentFit="cover" />
        ) : (
          <View style={styles.iconWrap}>
            <IconSymbol name="car.fill" size={28} color={accent} />
          </View>
        )}
        <View style={styles.headerText}>
          <ThemedText style={styles.nickname}>{nickname}</ThemedText>
          <ThemedText style={[styles.subtitle, { color: secondaryText }]}>
            {year} {make} {model} {trim}
          </ThemedText>
          {forSale ? (
            <View style={[styles.saleBadge, { backgroundColor: success + '1A' }]}>
              <ThemedText style={[styles.saleBadgeText, { color: success }]}>
                {askingPrice ? `$${Number(askingPrice).toLocaleString()}` : 'For Sale'}
              </ThemedText>
            </View>
          ) : null}
        </View>
        <IconSymbol name="chevron.right" size={20} color={secondaryText} />
      </View>
      <View style={[styles.statsRow, { borderTopColor: borderColor }]}>
        <View style={styles.stat}>
          <ThemedText style={[styles.statValue, { color: accent }]}>{formatMileage(mileage)}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: secondaryText }]}>Mileage</ThemedText>
        </View>
        <View style={styles.stat}>
          <ThemedText style={[styles.statValue, { color: accent }]}>{modCount}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: secondaryText }]}>Mods</ThemedText>
        </View>
        <View style={styles.stat}>
          <ThemedText style={[styles.statValue, { color: accent }]}>{formatCurrency(totalInvested)}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: secondaryText }]}>Invested</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(59,130,246,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  nickname: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  saleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  saleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
});
