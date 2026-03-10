/**
 * TextInputField Component - components/text-input-field.tsx
 *
 * A themed TextInput wrapped in a FormField (label + optional error).
 * Inherits all standard TextInputProps so it supports multiline, number
 * keyboards, auto-capitalisation, etc.  Colours are resolved from the
 * app's theme so it looks correct in both light and dark modes.
 */

import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { FormField } from '@/components/form-field';
import { useThemeColor } from '@/hooks/use-theme-color';

/** Props for the TextInputField -- adds `label` and `error` on top of TextInputProps. */
interface TextInputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function TextInputField({ label, error, style, ...props }: TextInputFieldProps) {
  /* Resolve themed colours for the input. */
  const textColor = useThemeColor({}, 'text');
  const bg = useThemeColor({}, 'inputBackground');
  const borderColor = useThemeColor({}, 'inputBorder');
  const placeholder = useThemeColor({}, 'textSecondary');

  return (
    <FormField label={label} error={error}>
      <TextInput
        style={[styles.input, { color: textColor, backgroundColor: bg, borderColor }, style]}
        placeholderTextColor={placeholder}
        {...props}
      />
    </FormField>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
