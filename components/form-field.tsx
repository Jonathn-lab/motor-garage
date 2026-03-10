/**
 * FormField Component - components/form-field.tsx
 *
 * A wrapper that renders a styled label above its children (typically a
 * TextInput or picker) and an optional validation error message below.
 * Used by TextInputField and PickerField for consistent form styling.
 */

import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

/** Props for the FormField wrapper. */
interface FormFieldProps {
  /** The field label displayed above the input. */
  label: string;
  /** Optional validation error shown below the input in red. */
  error?: string;
  /** The actual input control(s) to render inside the field. */
  children: React.ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.label} lightColor="#687076" darkColor="#9BA1A6">
        {label}
      </ThemedText>
      {children}
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});
