import type { Car, Mod, MaintenanceEntry, PerformanceEntry } from '@/types/models';

/** Map a Supabase `cars` row to the app's Car interface. */
export function mapCar(row: any): Car {
  return {
    id: row.id,
    userId: row.user_id,
    nickname: row.nickname,
    year: row.year,
    make: row.make,
    model: row.model,
    trim: row.trim,
    mileage: row.mileage,
    photoUri: row.photo_url,
    engine: row.engine,
    drivetrain: row.drivetrain,
    transmission: row.transmission,
    horsepower: row.horsepower,
    torque: row.torque,
    zeroToSixty: row.zero_to_sixty,
    forSale: row.for_sale,
    askingPrice: row.asking_price,
  };
}

/** Map a Supabase `mods` row to the app's Mod interface. */
export function mapMod(row: any): Mod {
  return {
    id: row.id,
    carId: row.car_id,
    title: row.title,
    category: row.category,
    cost: row.cost,
    installedOn: row.installed_on,
    mileageAtInstall: row.mileage_at_install,
    status: row.status,
    notes: row.notes,
    vendorLink: row.vendor_link,
    beforeUri: row.before_url,
    afterUri: row.after_url,
  };
}

/** Map a Supabase `maintenance_log` row to the app's MaintenanceEntry. */
export function mapMaintenance(row: any): MaintenanceEntry {
  return {
    id: row.id,
    carId: row.car_id,
    serviceType: row.service_type,
    date: row.date,
    mileage: row.mileage,
    cost: row.cost,
    notes: row.notes,
  };
}

/** Map a Supabase `performance_entries` row to the app's PerformanceEntry. */
export function mapPerformance(row: any): PerformanceEntry {
  return {
    id: row.id,
    carId: row.car_id,
    date: row.date,
    rpm: row.rpm,
    hp: row.hp,
    torque: row.torque,
    whp: row.whp,
    zeroToSixty: row.zero_to_sixty,
    quarterMile: row.quarter_mile,
    notes: row.notes,
  };
}
