/**
 * Type Definitions & Constants - types/models.ts
 *
 * Central location for all TypeScript interfaces that mirror the Supabase
 * schema and for the constant lookup tables (mod categories, mod statuses,
 * service types) used by picker fields and display helpers.
 */

// ─── Database Row Interfaces ────────────────────────────

/** Represents a user profile (maps to Supabase `profiles` table). */
export interface User {
  id: string;
  username: string;
  createdAt: string;
  displayName: string | null;
  avatarUri: string | null;
  birthday: string | null;
  city: string | null;
  zipCode: string | null;
}

/** Represents a row in the `cars` table. */
export interface Car {
  id: string;
  userId: string;
  nickname: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  photoUri: string | null;
  engine: string | null;
  drivetrain: string | null;
  transmission: string | null;
  horsepower: number | null;
  torque: number | null;
  zeroToSixty: number | null;
  forSale: boolean;
  askingPrice: number | null;
}

/** Represents a row in the `mods` table. */
export interface Mod {
  id: string;
  carId: string;
  title: string;
  category: string;
  cost: number;
  installedOn: string | null;
  mileageAtInstall: number | null;
  status: string;
  notes: string | null;
  vendorLink: string | null;
  beforeUri: string | null;
  afterUri: string | null;
}

/** Represents a row in the `maintenance_log` table. */
export interface MaintenanceEntry {
  id: string;
  carId: string;
  serviceType: string;
  date: string;
  mileage: number | null;
  cost: number;
  notes: string | null;
}

/** Represents a row in the `performance_entries` table. */
export interface PerformanceEntry {
  id: string;
  carId: string;
  date: string;
  rpm: number | null;
  hp: number | null;
  torque: number | null;
  whp: number | null;
  zeroToSixty: number | null;
  quarterMile: number | null;
  notes: string | null;
}

// ─── Constant Lookup Tables ─────────────────────────────

/** Available mod categories for the category picker. */
export const MOD_CATEGORIES = [
  { value: 'intake', label: 'Intake' },
  { value: 'exhaust', label: 'Exhaust' },
  { value: 'tuning', label: 'Tuning' },
  { value: 'suspension', label: 'Suspension' },
  { value: 'brakes', label: 'Brakes' },
  { value: 'wheels', label: 'Wheels & Tires' },
  { value: 'aero', label: 'Aero' },
  { value: 'interior', label: 'Interior' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'audio', label: 'Audio' },
  { value: 'engine', label: 'Engine' },
  { value: 'drivetrain', label: 'Drivetrain' },
  { value: 'forced_induction', label: 'Forced Induction' },
  { value: 'other', label: 'Other' },
] as const;

/** Available mod statuses for the status picker. */
export const MOD_STATUSES = [
  { value: 'installed', label: 'Installed' },
  { value: 'ordered', label: 'Ordered' },
  { value: 'planned', label: 'Planned' },
  { value: 'removed', label: 'Removed' },
] as const;

/** Available maintenance service types for the service-type picker. */
export const SERVICE_TYPES = [
  { value: 'oil_change', label: 'Oil Change' },
  { value: 'tire_rotation', label: 'Tire Rotation' },
  { value: 'brake_service', label: 'Brake Service' },
  { value: 'alignment', label: 'Alignment' },
  { value: 'fluid_flush', label: 'Fluid Flush' },
  { value: 'filter_replacement', label: 'Filter Replacement' },
  { value: 'spark_plugs', label: 'Spark Plugs' },
  { value: 'battery', label: 'Battery' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'detailing', label: 'Detailing' },
  { value: 'repair', label: 'Repair' },
  { value: 'recall', label: 'Recall' },
  { value: 'other', label: 'Other' },
] as const;
