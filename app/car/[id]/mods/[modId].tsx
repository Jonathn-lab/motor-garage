/**
 * Edit Mod Screen - app/car/[id]/mods/[modId].tsx
 *
 * Loads an existing mod record, renders a pre-filled ModForm for editing,
 * and provides a delete button with a confirmation dialog.  Success
 * haptics fire on both save and delete actions.
 */

import { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getMod, updateMod, deleteMod } from '@/app/_db/db';
import { ModForm } from '@/components/mod-form';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import type { Mod } from '@/types/models';

export default function EditMod() {
  /** Extract the mod id from the URL params. */
  const { modId } = useLocalSearchParams();
  const router = useRouter();

  /** The mod record currently being edited. */
  const [mod, setMod] = useState<Mod | null>(null);
  /** Controls visibility of the delete-confirmation dialog. */
  const [showDelete, setShowDelete] = useState(false);
  const danger = useThemeColor({}, 'danger');

  /** Fetch the mod on mount. */
  useEffect(() => {
    getMod(modId as string).then(setMod);
  }, [modId]);

  /* Render nothing until the data loads. */
  if (!mod) return null;

  return (
    <View style={styles.container}>
      <ModForm
        initial={mod}
        submitLabel="Save Changes"
        onSubmit={async (data) => {
          await updateMod(mod.id, data);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        }}
      />
      <Pressable onPress={() => setShowDelete(true)} style={styles.deleteBtn}>
        <IconSymbol name="trash" size={18} color={danger} />
        <ThemedText style={[styles.deleteText, { color: danger }]}>Delete Mod</ThemedText>
      </Pressable>
      <ConfirmDialog
        visible={showDelete}
        title="Delete Mod"
        message={`Delete "${mod.title}"? This cannot be undone.`}
        onConfirm={async () => {
          await deleteMod(mod.id);
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
