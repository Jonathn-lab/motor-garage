/**
 * PerformanceForm Component - components/performance-form.tsx
 *
 * A reusable form for creating and editing performance entries.  Contains
 * inputs for date, HP, WHP, torque, RPM, 0-60, quarter-mile, and notes.
 * Only the date is required; all numeric fields are optional so users
 * can log whichever metrics they have available.
 */

import { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { TextInputField } from '@/components/text-input-field';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { PerformanceEntry } from '@/types/models';

/** Props for the PerformanceForm component. */
interface PerformanceFormProps {
  /** Pre-filled values when editing an existing entry. */
  initial?: Partial<PerformanceEntry>;
  /** Callback invoked with validated, cleaned form data. */
  onSubmit: (data: Partial<PerformanceEntry>) => void;
  /** Label for the submit button. */
  submitLabel?: string;
}

export function PerformanceForm({ initial = {}, onSubmit, submitLabel = 'Save' }: PerformanceFormProps) {
  /* ── Form field state ── */
  /** Defaults to today's date in YYYY-MM-DD format for new entries. */
  const [date, setDate] = useState(initial.date || new Date().toISOString().split('T')[0]);
  const [rpm, setRpm] = useState(initial.rpm ? String(initial.rpm) : '');
  const [hp, setHp] = useState(initial.hp ? String(initial.hp) : '');
  /** Named `torqueVal` to avoid shadowing the `torque` property on the entry type. */
  const [torqueVal, setTorqueVal] = useState(initial.torque ? String(initial.torque) : '');
  const [whp, setWhp] = useState(initial.whp ? String(initial.whp) : '');
  const [zeroToSixty, setZeroToSixty] = useState(initial.zeroToSixty ? String(initial.zeroToSixty) : '');
  const [quarterMile, setQuarterMile] = useState(initial.quarterMile ? String(initial.quarterMile) : '');
  const [notes, setNotes] = useState(initial.notes || '');
  /** Per-field validation error messages. */
  const [errors, setErrors] = useState<Record<string, string>>({});

  const accent = useThemeColor({}, 'accent');

  /** Only the date field is required. */
  function validate() {
    const e: Record<string, string> = {};
    if (!date.trim()) e.date = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /** Validate then invoke the parent callback with cleaned data. */
  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      date: date.trim(),
      rpm: rpm ? Number(rpm) : null,
      hp: hp ? Number(hp) : null,
      torque: torqueVal ? Number(torqueVal) : null,
      whp: whp ? Number(whp) : null,
      zeroToSixty: zeroToSixty ? Number(zeroToSixty) : null,
      quarterMile: quarterMile ? Number(quarterMile) : null,
      notes: notes.trim() || null,
    });
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <TextInputField label="Date" value={date} onChangeText={setDate} error={errors.date} placeholder="YYYY-MM-DD" />
      <View style={styles.row}>
        <View style={styles.half}>
          <TextInputField label="HP" value={hp} onChangeText={setHp} keyboardType="numeric" placeholder="170" />
        </View>
        <View style={styles.half}>
          <TextInputField label="WHP" value={whp} onChangeText={setWhp} keyboardType="numeric" placeholder="150" />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.half}>
          <TextInputField label="Torque (lb-ft)" value={torqueVal} onChangeText={setTorqueVal} keyboardType="numeric" placeholder="138" />
        </View>
        <View style={styles.half}>
          <TextInputField label="RPM" value={rpm} onChangeText={setRpm} keyboardType="number-pad" placeholder="6500" />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.half}>
          <TextInputField label="0-60 (s)" value={zeroToSixty} onChangeText={setZeroToSixty} keyboardType="numeric" placeholder="7.5" />
        </View>
        <View style={styles.half}>
          <TextInputField label="1/4 Mile (s)" value={quarterMile} onChangeText={setQuarterMile} keyboardType="numeric" placeholder="15.2" />
        </View>
      </View>
      <TextInputField label="Notes" value={notes} onChangeText={setNotes} multiline numberOfLines={3} placeholder="Optional notes..." style={{ minHeight: 80, textAlignVertical: 'top' }} />

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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
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
