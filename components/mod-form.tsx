/**
 * ModForm Component - components/mod-form.tsx
 *
 * A reusable form for creating and editing car modifications.  Contains
 * inputs for title, category, cost, status, install date, mileage at
 * install, notes, and vendor link.  Validates that title and category
 * are provided before submitting.
 */

import { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { TextInputField } from '@/components/text-input-field';
import { PickerField } from '@/components/picker-field';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MOD_CATEGORIES, MOD_STATUSES } from '@/types/models';
import type { Mod } from '@/types/models';

/** Props for the ModForm component. */
interface ModFormProps {
  /** Pre-filled values when editing an existing mod. */
  initial?: Partial<Mod>;
  /** Callback invoked with validated, cleaned form data. */
  onSubmit: (data: Partial<Mod>) => void;
  /** Label for the submit button. */
  submitLabel?: string;
}

export function ModForm({ initial = {}, onSubmit, submitLabel = 'Save' }: ModFormProps) {
  /* ── Form field state ── */
  const [title, setTitle] = useState(initial.title || '');
  const [category, setCategory] = useState(initial.category || '');
  const [cost, setCost] = useState(initial.cost ? String(initial.cost) : '');
  /** Defaults to 'installed' for new mods. */
  const [status, setStatus] = useState(initial.status || 'installed');
  const [installedOn, setInstalledOn] = useState(initial.installedOn || '');
  const [mileageAtInstall, setMileageAtInstall] = useState(
    initial.mileageAtInstall ? String(initial.mileageAtInstall) : ''
  );
  const [notes, setNotes] = useState(initial.notes || '');
  const [vendorLink, setVendorLink] = useState(initial.vendorLink || '');
  /** Per-field validation error messages. */
  const [errors, setErrors] = useState<Record<string, string>>({});

  const accent = useThemeColor({}, 'accent');

  /** Validate required fields (title and category). */
  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Required';
    if (!category) e.category = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /** Validate then invoke the parent callback with cleaned data. */
  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      category,
      cost: cost ? Number(cost) : 0,
      status,
      installedOn: installedOn.trim() || null,
      mileageAtInstall: mileageAtInstall ? Number(mileageAtInstall) : null,
      notes: notes.trim() || null,
      vendorLink: vendorLink.trim() || null,
    });
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <TextInputField label="Title" value={title} onChangeText={setTitle} error={errors.title} placeholder="Cold Air Intake" />
      <PickerField label="Category" value={category} options={MOD_CATEGORIES} onChange={setCategory} error={errors.category} />
      <PickerField label="Status" value={status} options={MOD_STATUSES} onChange={setStatus} />
      <View style={styles.row}>
        <View style={styles.half}>
          <TextInputField label="Cost" value={cost} onChangeText={setCost} keyboardType="numeric" placeholder="0" />
        </View>
        <View style={styles.half}>
          <TextInputField label="Mileage at Install" value={mileageAtInstall} onChangeText={setMileageAtInstall} keyboardType="number-pad" placeholder="25000" />
        </View>
      </View>
      <TextInputField label="Install Date" value={installedOn} onChangeText={setInstalledOn} placeholder="YYYY-MM-DD" />
      <TextInputField label="Notes" value={notes} onChangeText={setNotes} multiline numberOfLines={3} placeholder="Optional notes..." style={{ minHeight: 80, textAlignVertical: 'top' }} />
      <TextInputField label="Vendor Link" value={vendorLink} onChangeText={setVendorLink} placeholder="https://..." autoCapitalize="none" keyboardType="url" />

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
