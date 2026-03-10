import type { Car, Mod, MaintenanceEntry, PerformanceEntry, User } from '@/types/models';

export function initDb(): Promise<void>;
export function seedIfEmpty(): Promise<void>;

export function getUser(id: string): Promise<User | null>;
export function updateUserProfile(id: string, profile: Partial<User>): Promise<void>;

export function getCars(userId: string): Promise<Car[]>;
export function getCar(id: string): Promise<Car | null>;
export function getCarsForSale(): Promise<Car[]>;
export function getCarsForSaleByUser(userId: string): Promise<Car[]>;
export function createCar(car: Partial<Car> & { userId: string }): Promise<string>;
export function updateCar(id: string, car: Partial<Car>): Promise<void>;
export function deleteCar(id: string): Promise<void>;

export function getModsForCar(carId: string): Promise<Mod[]>;
export function getMod(id: string): Promise<Mod | null>;
export function createMod(mod: Partial<Mod> & { carId: string }): Promise<string>;
export function updateMod(id: string, mod: Partial<Mod>): Promise<void>;
export function deleteMod(id: string): Promise<void>;

export function getMaintenanceForCar(carId: string): Promise<MaintenanceEntry[]>;
export function getMaintenanceEntry(id: string): Promise<MaintenanceEntry | null>;
export function createMaintenance(entry: Partial<MaintenanceEntry> & { carId: string }): Promise<string>;
export function updateMaintenance(id: string, entry: Partial<MaintenanceEntry>): Promise<void>;
export function deleteMaintenance(id: string): Promise<void>;

export function getPerformanceForCar(carId: string): Promise<PerformanceEntry[]>;
export function getPerformanceEntry(id: string): Promise<PerformanceEntry | null>;
export function createPerformanceEntry(entry: Partial<PerformanceEntry> & { carId: string }): Promise<string>;
export function updatePerformanceEntry(id: string, entry: Partial<PerformanceEntry>): Promise<void>;
export function deletePerformanceEntry(id: string): Promise<void>;

export function getCarStats(carId: string): Promise<{
  modCount: number;
  modCost: number;
  maintenanceCount: number;
  maintenanceCost: number;
  totalInvested: number;
}>;

export function getGarageStats(userId: string): Promise<{
  carCount: number;
  modCount: number;
  totalInvested: number;
}>;
