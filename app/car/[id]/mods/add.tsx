/**
 * Add Mod Screen - app/car/[id]/mods/add.tsx
 *
 * Renders an empty ModForm.  On submit the new mod is inserted with
 * the current car's id, a success haptic fires, and the modal closes.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { createMod } from '@/app/_db/db';
import { ModForm } from '@/components/mod-form';
import * as Haptics from 'expo-haptics';

export default function AddMod() {
  /** Extract the parent car id from the URL. */
  const { id } = useLocalSearchParams();
  const carId = id as string;
  const router = useRouter();

  return (
    <ModForm
      submitLabel="Add Mod"
      onSubmit={async (data) => {
        /* Attach the car id and persist the new mod. */
        await createMod({ ...data, carId });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
      }}
    />
  );
}
