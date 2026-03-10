/**
 * ConfirmDialog Component - components/confirm-dialog.tsx
 *
 * A generic confirmation modal used before destructive actions
 * (e.g. deleting a car, mod, maintenance record, or performance entry).
 * Renders a semi-transparent overlay with a centered dialog containing
 * a title, message, and Cancel / Confirm buttons.
 */

import { StyleSheet, View, Pressable, Modal } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

/** Props for the ConfirmDialog component. */
interface ConfirmDialogProps {
  /** Whether the dialog is visible. */
  visible: boolean;
  /** Dialog title (e.g. "Delete Car"). */
  title: string;
  /** Descriptive message explaining the action. */
  message: string;
  /** Label for the destructive button (defaults to "Delete"). */
  confirmLabel?: string;
  /** Callback fired when the user confirms the action. */
  onConfirm: () => void;
  /** Callback fired when the user cancels. */
  onCancel: () => void;
}

export function ConfirmDialog({
  visible, title, message, confirmLabel = 'Delete', onConfirm, onCancel,
}: ConfirmDialogProps) {
  /* Theme colours for the dialog chrome. */
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'cardBorder');
  const danger = useThemeColor({}, 'danger');
  const secondaryText = useThemeColor({}, 'textSecondary');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: cardBg, borderColor }]}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={[styles.message, { color: secondaryText }]}>{message}</ThemedText>
          <View style={styles.buttons}>
            <Pressable
              onPress={onCancel}
              style={[styles.button, { borderColor }]}
            >
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={[styles.button, styles.confirmButton, { backgroundColor: danger }]}
            >
              <ThemedText style={styles.confirmText}>{confirmLabel}</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  dialog: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  confirmButton: {
    borderWidth: 0,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
