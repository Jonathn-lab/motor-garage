/**
 * Edit Maintenance Screen - app/car/[id]/maintenance/[entryId].tsx
 *
 * Loads an existing maintenance record, renders a pre-filled
 * MaintenanceForm for editing, and provides a delete button with a
 * confirmation dialog.  Success haptics fire on save and delete.
 */

import { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getMaintenanceEntry, updateMaintenance, deleteMaintenance } from '@/app/_db/db';
import { MaintenanceForm } from '@/components/maintenance-form';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import type { MaintenanceEntry } from '@/types/models';

export default function EditMaintenance() {
  /** Extract the car id and maintenance entry id from the URL params. */
  const { entryId } = useLocalSearchParams();
  const router = useRouter();

  /** The maintenance record currently being edited. */
  const [entry, setEntry] = useState<MaintenanceEntry | null>(null);
  /** Controls visibility of the delete-confirmation dialog. */
  const [showDelete, setShowDelete] = useState(false);
  const danger = useThemeColor({}, 'danger');

  /** Fetch the maintenance record on mount. */
  useEffect(() => {
    getMaintenanceEntry(entryId as string).then(setEntry);
  }, [entryId]);

  /* Render nothing until the data loads. */
  if (!entry) return null;

  return (
    <View style={styles.container}>
      <MaintenanceForm
        initial={entry}
        submitLabel="Save Changes"
        onSubmit={async (data) => {
          await updateMaintenance(entry.id, data);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        }}
      />
      <Pressable onPress={() => setShowDelete(true)} style={styles.deleteBtn}>
        <IconSymbol name="trash" size={18} color={danger} />
        <ThemedText style={[styles.deleteText, { color: danger }]}>Delete Record</ThemedText>
      </Pressable>
      <ConfirmDialog
        visible={showDelete}
        title="Delete Record"
        message="Delete this maintenance record? This cannot be undone."
        onConfirm={async () => {
          await deleteMaintenance(entry.id);
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
