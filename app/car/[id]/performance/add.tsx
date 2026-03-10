/**
 * Add Performance Screen - app/car/[id]/performance/add.tsx
 *
 * Renders an empty PerformanceForm.  On submit the new entry is inserted
 * with the current car's id, a success haptic fires, and the modal closes.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { createPerformanceEntry } from '@/app/_db/db';
import { PerformanceForm } from '@/components/performance-form';
import * as Haptics from 'expo-haptics';

export default function AddPerformance() {
  /** Extract the parent car id from the URL. */
  const { id } = useLocalSearchParams();
  const carId = id as string;
  const router = useRouter();

  return (
    <PerformanceForm
      submitLabel="Add Entry"
      onSubmit={async (data) => {
        /* Attach the car id and persist the new performance entry. */
        await createPerformanceEntry({ ...data, carId });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
      }}
    />
  );
}
