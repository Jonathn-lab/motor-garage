/**
 * Add Maintenance Screen - app/car/[id]/maintenance/add.tsx
 *
 * Renders an empty MaintenanceForm.  On submit the new record is inserted
 * with the current car's id, a success haptic fires, and the modal closes.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { createMaintenance } from '@/app/_db/db';
import { MaintenanceForm } from '@/components/maintenance-form';
import * as Haptics from 'expo-haptics';

export default function AddMaintenance() {
  /** Extract the parent car id from the URL. */
  const { id } = useLocalSearchParams();
  const carId = id as string;
  const router = useRouter();

  return (
    <MaintenanceForm
      submitLabel="Add Record"
      onSubmit={async (data) => {
        /* Attach the car id and persist the new maintenance record. */
        await createMaintenance({ ...data, carId });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
      }}
    />
  );
}
