/**
 * Edit Car Screen - app/car/[id]/edit.tsx
 *
 * Loads the existing car data from the database and renders a pre-filled
 * CarForm.  On submit the car row is updated, a success haptic fires,
 * and the user is navigated back to the detail screen.
 */

import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getCar, updateCar } from '@/app/_db/db';
import { CarForm } from '@/components/car-form';
import * as Haptics from 'expo-haptics';
import type { Car } from '@/types/models';

export default function EditCar() {
  /** Extract the dynamic [id] segment from the URL. */
  const { id } = useLocalSearchParams();
  const carId = id as string;
  const router = useRouter();

  /** Holds the car record once loaded from the DB. */
  const [car, setCar] = useState<Car | null>(null);

  /** Fetch the car on mount (or when the id changes). */
  useEffect(() => {
    getCar(carId).then(setCar);
  }, [carId]);

  /* Render nothing until the car data has loaded. */
  if (!car) return null;

  return (
    <CarForm
      initial={car}
      submitLabel="Save Changes"
      onSubmit={async (data) => {
        /* Merge form data over existing car fields and persist. */
        await updateCar(carId, { ...car, ...data });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
      }}
    />
  );
}
