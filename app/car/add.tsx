/**
 * Add Car Screen - app/car/add.tsx
 *
 * Renders an empty CarForm.  On submit, a new car row is inserted into
 * the database, a success haptic fires, and the modal is dismissed.
 */

import { useRouter } from 'expo-router';
import { createCar } from '@/app/_db/db';
import { CarForm } from '@/components/car-form';
import { useAuth } from '@/hooks/use-auth';
import * as Haptics from 'expo-haptics';

export default function AddCar() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <CarForm
      submitLabel="Add Car"
      onSubmit={async (data) => {
        if (!user) return;
        try {
          await createCar({ ...data, userId: user.id });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        } catch (e: any) {
          console.error('[addCar] error:', JSON.stringify(e));
          alert(e?.message || 'Failed to add car');
        }
      }}
    />
  );
}
