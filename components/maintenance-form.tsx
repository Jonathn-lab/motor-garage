/**
 * MaintenanceForm Component - components/maintenance-form.tsx
 *
 * A reusable form for creating and editing maintenance records.  Includes
 * a service-type picker, date and mileage inputs, cost field, and
 * optional notes.  Validates that service type and date are provided.
 */

import { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { TextInputField } from '@/components/text-input-field';
import { PickerField } from '@/components/picker-field';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { SERVICE_TYPES } from '@/types/models';
import type { MaintenanceEntry } from '@/types/models';

/** Props for the MaintenanceForm component. */
interface MaintenanceFormProps {
  /** Pre-filled values when editing an existing record. */
  initial?: Partial<MaintenanceEntry>;
  /** Callback invoked with validated, cleaned form data. */
  onSubmit: (data: Partial<MaintenanceEntry>) => void;
  /** Label for the submit button. */
  submitLabel?: string;
}

export function MaintenanceForm({ initial = {}, onSubmit, submitLabel = 'Save' }: MaintenanceFormProps) {
  /* ── Form field state ── */
  const [serviceType, setServiceType] = useState(initial.serviceType || '');
  /** Defaults to today's date in YYYY-MM-DD format for new records. */
  const [date, setDate] = useState(initial.date || new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState(initial.mileage ? String(initial.mileage) : '');
  const [cost, setCost] = useState(initial.cost ? String(initial.cost) : '');
  const [notes, setNotes] = useState(initial.notes || '');
  /** Per-field validation error messages. */
  const [errors, setErrors] = useState<Record<string, string>>({});

  const accent = useThemeColor({}, 'accent');

  /** Validate required fields. */
  function validate() {
    const e: Record<string, string> = {};
    if (!serviceType) e.serviceType = 'Required';
    if (!date.trim()) e.date = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /** Validate then invoke the parent callback with cleaned data. */
  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      serviceType,
      date: date.trim(),
      mileage: mileage ? Number(mileage) : null,
      cost: cost ? Number(cost) : 0,
      notes: notes.trim() || null,
    });
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <PickerField label="Service Type" value={serviceType} options={SERVICE_TYPES} onChange={setServiceType} error={errors.serviceType} />
      <View style={styles.row}>
        <View style={styles.half}>
          <TextInputField label="Date" value={date} onChangeText={setDate} error={errors.date} placeholder="YYYY-MM-DD" />
        </View>
        <View style={styles.half}>
          <TextInputField label="Mileage" value={mileage} onChangeText={setMileage} keyboardType="number-pad" placeholder="25000" />
        </View>
      </View>
      <TextInputField label="Cost" value={cost} onChangeText={setCost} keyboardType="numeric" placeholder="0" />
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
