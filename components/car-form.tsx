/**
 * CarForm Component - components/car-form.tsx
 *
 * A reusable form for creating and editing cars.  Contains text inputs
 * for required fields (nickname, year, make, model, trim, mileage) and
 * optional spec fields (engine, drivetrain, transmission, HP, torque,
 * 0-60).  Runs client-side validation and calls `onSubmit` with the
 * cleaned data when the form is valid.
 */

import { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Switch } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { TextInputField } from '@/components/text-input-field';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Car } from '@/types/models';

/** Props for the CarForm component. */
interface CarFormProps {
  /** Pre-filled values when editing an existing car. */
  initial?: Partial<Car>;
  /** Callback invoked with validated, cleaned form data. */
  onSubmit: (data: Partial<Car>) => void;
  /** Label for the submit button (e.g. "Add Car" or "Save Changes"). */
  submitLabel?: string;
}

export function CarForm({ initial = {}, onSubmit, submitLabel = 'Save' }: CarFormProps) {
  /* ── Form field state, initialised from `initial` when editing. ── */
  const [photoUri, setPhotoUri] = useState<string | null>(initial.photoUri || null);
  const [nickname, setNickname] = useState(initial.nickname || '');
  const [year, setYear] = useState(initial.year ? String(initial.year) : '');
  const [make, setMake] = useState(initial.make || '');
  const [model, setModel] = useState(initial.model || '');
  const [trim, setTrim] = useState(initial.trim || '');
  const [mileage, setMileage] = useState(initial.mileage ? String(initial.mileage) : '');
  const [engine, setEngine] = useState(initial.engine || '');
  const [drivetrain, setDrivetrain] = useState(initial.drivetrain || '');
  const [transmission, setTransmission] = useState(initial.transmission || '');
  const [horsepower, setHorsepower] = useState(initial.horsepower ? String(initial.horsepower) : '');
  const [torque, setTorque] = useState(initial.torque ? String(initial.torque) : '');
  const [zeroToSixty, setZeroToSixty] = useState(initial.zeroToSixty ? String(initial.zeroToSixty) : '');
  const [forSale, setForSale] = useState(!!initial.forSale);
  const [askingPrice, setAskingPrice] = useState(initial.askingPrice ? String(initial.askingPrice) : '');
  /** Per-field validation error messages. */
  const [errors, setErrors] = useState<Record<string, string>>({});

  const accent = useThemeColor({}, 'accent');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'cardBorder');
  const secondaryText = useThemeColor({}, 'textSecondary');

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  /**
   * Validate required fields and return true when the form is valid.
   * Sets per-field error messages for anything that fails.
   */
  function validate() {
    const e: Record<string, string> = {};
    if (!nickname.trim()) e.nickname = 'Required';
    if (!year.trim() || isNaN(Number(year))) e.year = 'Valid year required';
    if (!make.trim()) e.make = 'Required';
    if (!model.trim()) e.model = 'Required';
    if (!trim.trim()) e.trim = 'Required';
    if (!mileage.trim() || isNaN(Number(mileage))) e.mileage = 'Valid mileage required';
    if (forSale && (!askingPrice.trim() || isNaN(Number(askingPrice)))) e.askingPrice = 'Price required when listing for sale';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /** Validate then invoke the parent callback with cleaned data. */
  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      nickname: nickname.trim(),
      year: Number(year),
      make: make.trim(),
      model: model.trim(),
      trim: trim.trim(),
      mileage: Number(mileage),
      photoUri,
      /* Optional spec fields -- empty strings become null. */
      engine: engine.trim() || null,
      drivetrain: drivetrain.trim() || null,
      transmission: transmission.trim() || null,
      horsepower: horsepower ? Number(horsepower) : null,
      torque: torque ? Number(torque) : null,
      zeroToSixty: zeroToSixty ? Number(zeroToSixty) : null,
      forSale,
      askingPrice: forSale && askingPrice ? Number(askingPrice) : null,
    });
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Pressable onPress={pickImage} style={[styles.photoPicker, { backgroundColor: cardBg, borderColor }]}>
        {photoUri ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: photoUri }} style={styles.photoImage} contentFit="cover" />
            <View style={styles.photoOverlay}>
              <IconSymbol name="camera.fill" size={20} color="#FFFFFF" />
              <ThemedText style={styles.photoOverlayText}>Change Photo</ThemedText>
            </View>
          </View>
        ) : (
          <View style={styles.photoPlaceholder}>
            <IconSymbol name="camera.fill" size={32} color={secondaryText} />
            <ThemedText style={[styles.photoPlaceholderText, { color: secondaryText }]}>Add Photo</ThemedText>
          </View>
        )}
      </Pressable>
      <TextInputField label="Nickname" value={nickname} onChangeText={setNickname} error={errors.nickname} placeholder="e.g. Cilvia" />
      <View style={styles.row}>
        <View style={styles.half}>
          <TextInputField label="Year" value={year} onChangeText={setYear} error={errors.year} keyboardType="number-pad" placeholder="2023" />
        </View>
        <View style={styles.half}>
          <TextInputField label="Mileage" value={mileage} onChangeText={setMileage} error={errors.mileage} keyboardType="number-pad" placeholder="25000" />
        </View>
      </View>
      <TextInputField label="Make" value={make} onChangeText={setMake} error={errors.make} placeholder="Honda" />
      <TextInputField label="Model" value={model} onChangeText={setModel} error={errors.model} placeholder="Civic Hatchback" />
      <TextInputField label="Trim" value={trim} onChangeText={setTrim} error={errors.trim} placeholder="Sport" />
      <TextInputField label="Engine" value={engine} onChangeText={setEngine} placeholder="2.0L I4 (optional)" />
      <View style={styles.row}>
        <View style={styles.half}>
          <TextInputField label="Drivetrain" value={drivetrain} onChangeText={setDrivetrain} placeholder="FWD" />
        </View>
        <View style={styles.half}>
          <TextInputField label="Transmission" value={transmission} onChangeText={setTransmission} placeholder="CVT" />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.third}>
          <TextInputField label="HP" value={horsepower} onChangeText={setHorsepower} keyboardType="numeric" placeholder="158" />
        </View>
        <View style={styles.third}>
          <TextInputField label="Torque (lb-ft)" value={torque} onChangeText={setTorque} keyboardType="numeric" placeholder="138" />
        </View>
        <View style={styles.third}>
          <TextInputField label="0-60 (s)" value={zeroToSixty} onChangeText={setZeroToSixty} keyboardType="numeric" placeholder="7.5" />
        </View>
      </View>

      {/* For Sale toggle */}
      <View style={[styles.saleRow, { backgroundColor: cardBg, borderColor }]}>
        <View style={styles.saleLabel}>
          <ThemedText style={styles.saleLabelText}>List for Sale</ThemedText>
          <ThemedText style={[styles.saleHint, { color: secondaryText }]}>Show this car on the Market</ThemedText>
        </View>
        <Switch
          value={forSale}
          onValueChange={setForSale}
          trackColor={{ false: borderColor, true: accent }}
        />
      </View>
      {forSale ? (
        <TextInputField
          label="Asking Price ($)"
          value={askingPrice}
          onChangeText={setAskingPrice}
          keyboardType="numeric"
          placeholder="25000"
          error={errors.askingPrice}
        />
      ) : null}

      <Pressable onPress={handleSubmit} style={[styles.submitButton, { backgroundColor: accent }]}>
        <ThemedText style={styles.submitText}>{submitLabel}</ThemedText>
      </Pressable>
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  photoPicker: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: 200,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  photoOverlayText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  photoPlaceholder: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  third: {
    flex: 1,
  },
  saleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    marginTop: 8,
  },
  saleLabel: {
    flex: 1,
    marginRight: 12,
  },
  saleLabelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saleHint: {
    fontSize: 12,
    marginTop: 2,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 40,
  },
});
