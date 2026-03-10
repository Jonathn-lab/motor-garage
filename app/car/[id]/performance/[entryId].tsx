/**
 * Edit Performance Screen - app/car/[id]/performance/[entryId].tsx
 *
 * Loads an existing performance entry, renders a pre-filled
 * PerformanceForm for editing, and provides a delete button with a
 * confirmation dialog.  Success haptics fire on save and delete.
 */

import { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getPerformanceEntry, updatePerformanceEntry, deletePerformanceEntry } from '@/app/_db/db';
import { PerformanceForm } from '@/components/performance-form';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import type { PerformanceEntry } from '@/types/models';

export default function EditPerformance() {
  /** Extract the performance entry id from the URL params. */
  const { entryId } = useLocalSearchParams();
  const router = useRouter();

  /** The performance record currently being edited. */
  const [entry, setEntry] = useState<PerformanceEntry | null>(null);
  /** Controls visibility of the delete-confirmation dialog. */
  const [showDelete, setShowDelete] = useState(false);
  const danger = useThemeColor({}, 'danger');

  /** Fetch the performance entry on mount. */
  useEffect(() => {
    getPerformanceEntry(entryId as string).then(setEntry);
  }, [entryId]);

  /* Render nothing until the data loads. */
  if (!entry) return null;

  return (
    <View style={styles.container}>
      <PerformanceForm
        initial={entry}
        submitLabel="Save Changes"
        onSubmit={async (data) => {
          await updatePerformanceEntry(entry.id, data);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        }}
      />
      <Pressable onPress={() => setShowDelete(true)} style={styles.deleteBtn}>
        <IconSymbol name="trash" size={18} color={danger} />
        <ThemedText style={[styles.deleteText, { color: danger }]}>Delete Entry</ThemedText>
      </Pressable>
      <ConfirmDialog
        visible={showDelete}
        title="Delete Entry"
        message="Delete this performance entry? This cannot be undone."
        onConfirm={async () => {
          await deletePerformanceEntry(entry.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setShowDelete(false);
          router.back();
        }}
        onCancel={() => setShowDelete(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
    marginBottom: 32,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
