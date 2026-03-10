/**
 * PickerField Component - components/picker-field.tsx
 *
 * A form field that displays the currently selected value and, on press,
 * opens a bottom-sheet-style Modal with a scrollable list of options.
 * The selected option is highlighted with a checkmark.  Used for fields
 * like service type, mod category, and mod status.
 */

import { useState } from 'react';
import { StyleSheet, View, Pressable, Modal, FlatList, SafeAreaView } from 'react-native';
import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

/** A single selectable option. */
interface PickerOption {
  value: string;
  label: string;
}

/** Props for the PickerField component. */
interface PickerFieldProps {
  /** The field label. */
  label: string;
  /** The currently selected value. */
  value: string;
  /** Array of available options. */
  options: readonly PickerOption[];
  /** Callback when the user selects an option. */
  onChange: (value: string) => void;
  /** Optional validation error. */
  error?: string;
}

export function PickerField({ label, value, options, onChange, error }: PickerFieldProps) {
  /** Controls the visibility of the option-list modal. */
  const [visible, setVisible] = useState(false);

  /* Theme colours. */
  const textColor = useThemeColor({}, 'text');
  const bg = useThemeColor({}, 'inputBackground');
  const borderColor = useThemeColor({}, 'inputBorder');
  const secondaryText = useThemeColor({}, 'textSecondary');
  const cardBg = useThemeColor({}, 'card');
  const screenBg = useThemeColor({}, 'background');
  const accent = useThemeColor({}, 'accent');

  /** Resolve the display label for the currently selected value. */
  const selectedLabel = options.find((o) => o.value === value)?.label || 'Select...';

  return (
    <FormField label={label} error={error}>
      <Pressable
        onPress={() => setVisible(true)}
        style={[styles.trigger, { backgroundColor: bg, borderColor }]}
      >
        <ThemedText style={[styles.triggerText, !value && { color: secondaryText }]}>
          {selectedLabel}
        </ThemedText>
        <IconSymbol name="chevron.right" size={16} color={secondaryText} />
      </Pressable>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <SafeAreaView style={[styles.modal, { backgroundColor: screenBg }]}>
            <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
              <ThemedText style={styles.modalTitle}>{label}</ThemedText>
              <Pressable onPress={() => setVisible(false)} hitSlop={8}>
                <IconSymbol name="xmark" size={22} color={textColor} />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => { onChange(item.value); setVisible(false); }}
                  style={[styles.option, { borderBottomColor: borderColor }]}
                >
                  <ThemedText style={styles.optionText}>{item.label}</ThemedText>
                  {item.value === value && (
                    <IconSymbol name="checkmark" size={20} color={accent} />
                  )}
                </Pressable>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </FormField>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  triggerText: {
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    maxHeight: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 16,
  },
});
