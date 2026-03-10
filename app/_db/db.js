/**
 * Database Module - app/_db/db.js
 *
 * Central data-access layer for MobileGarage.
 * Uses Supabase as the backend (replaces the previous expo-sqlite layer).
 * All exported function signatures remain unchanged so screens work
 * without import changes.
 */

import { supabase } from '@/lib/supabase';
import { mapCar, mapMod, mapMaintenance, mapPerformance } from '@/lib/mappers';
import { uploadImage } from '@/lib/storage';

/** No-op — Supabase schema is managed server-side. */
export async function initDb() {}

/** No-op — demo data can be seeded via the Supabase SQL editor if needed. */
export async function seedIfEmpty() {}

// ─── Auth Helpers (stubs — auth is handled by use-auth.tsx now) ──

export async function createUser() {
  throw new Error('Use supabase.auth.signUp() via useAuth() hook');
}

export async function authenticateUser() {
  throw new Error('Use supabase.auth.signInWithPassword() via useAuth() hook');
}

export async function getUser(id) {
  const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (!data) return null;
  return {
    id: data.id,
    username: data.username,
    displayName: data.display_name,
    avatarUri: data.avatar_url,
    birthday: data.birthday,
    city: data.city,
    zipCode: data.zip_code,
    createdAt: data.created_at,
  };
}

export async function updateUserProfile(id, profile) {
  let avatarUrl = profile.avatarUri || null;
  if (avatarUrl && !avatarUrl.startsWith('http')) {
    avatarUrl = await uploadImage('avatars', `${id}/avatar`, avatarUrl);
  }
  const { error } = await supabase.from('profiles').update({
    display_name: profile.displayName || null,
    avatar_url: avatarUrl,
    birthday: profile.birthday || null,
    city: profile.city || null,
    zip_code: profile.zipCode || null,
  }).eq('id', id);
  if (error) throw error;
}

// ─── Cars CRUD ───────────────────────────────────────────

export async function getCars(userId) {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapCar);
}

export async function getCar(id) {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return mapCar(data);
}

export async function getCarsForSale() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('for_sale', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapCar);
}

export async function getCarsForSaleByUser(userId) {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('for_sale', true)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapCar);
}

export async function createCar(car) {
  let photoUrl = car.photoUri || null;
  if (photoUrl && !photoUrl.startsWith('http')) {
    photoUrl = await uploadImage('car-photos', `${car.userId}/${Date.now()}`, photoUrl);
  }

  const { data, error } = await supabase
    .from('cars')
    .insert({
      user_id: car.userId,
      nickname: car.nickname,
      year: car.year,
      make: car.make,
      model: car.model,
      trim: car.trim,
      mileage: car.mileage,
      photo_url: photoUrl,
      engine: car.engine || null,
      drivetrain: car.drivetrain || null,
      transmission: car.transmission || null,
      horsepower: car.horsepower || null,
      torque: car.torque || null,
      zero_to_sixty: car.zeroToSixty || null,
      for_sale: !!car.forSale,
      asking_price: car.askingPrice || null,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateCar(id, car) {
  let photoUrl = car.photoUri || null;
  if (photoUrl && !photoUrl.startsWith('http')) {
    const existing = await getCar(id);
    photoUrl = await uploadImage('car-photos', `${existing.userId}/${id}`, photoUrl);
  }

  const { error } = await supabase
    .from('cars')
    .update({
      nickname: car.nickname,
      year: car.year,
      make: car.make,
      model: car.model,
      trim: car.trim,
      mileage: car.mileage,
      photo_url: photoUrl,
      engine: car.engine || null,
      drivetrain: car.drivetrain || null,
      transmission: car.transmission || null,
      horsepower: car.horsepower || null,
      torque: car.torque || null,
      zero_to_sixty: car.zeroToSixty || null,
      for_sale: !!car.forSale,
      asking_price: car.askingPrice || null,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteCar(id) {
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) throw error;
}

// ─── Mods CRUD ───────────────────────────────────────────

export async function getModsForCar(carId) {
  const { data, error } = await supabase
    .from('mods')
    .select('*')
    .eq('car_id', carId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapMod);
}

export async function getMod(id) {
  const { data, error } = await supabase
    .from('mods')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return mapMod(data);
}

export async function createMod(mod) {
  const { data, error } = await supabase
    .from('mods')
    .insert({
      car_id: mod.carId,
      title: mod.title,
      category: mod.category,
      cost: mod.cost || 0,
      installed_on: mod.installedOn || null,
      mileage_at_install: mod.mileageAtInstall || null,
      status: mod.status || 'installed',
      notes: mod.notes || null,
      vendor_link: mod.vendorLink || null,
      before_url: mod.beforeUri || null,
      after_url: mod.afterUri || null,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateMod(id, mod) {
  const { error } = await supabase
    .from('mods')
    .update({
      title: mod.title,
      category: mod.category,
      cost: mod.cost || 0,
      installed_on: mod.installedOn || null,
      mileage_at_install: mod.mileageAtInstall || null,
      status: mod.status || 'installed',
      notes: mod.notes || null,
      vendor_link: mod.vendorLink || null,
      before_url: mod.beforeUri || null,
      after_url: mod.afterUri || null,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMod(id) {
  const { error } = await supabase.from('mods').delete().eq('id', id);
  if (error) throw error;
}

// ─── Maintenance CRUD ────────────────────────────────────

export async function getMaintenanceForCar(carId) {
  const { data, error } = await supabase
    .from('maintenance_log')
    .select('*')
    .eq('car_id', carId)
    .order('date', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapMaintenance);
}

export async function getMaintenanceEntry(id) {
  const { data, error } = await supabase
    .from('maintenance_log')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return mapMaintenance(data);
}

export async function createMaintenance(entry) {
  const { data, error } = await supabase
    .from('maintenance_log')
    .insert({
      car_id: entry.carId,
      service_type: entry.serviceType,
      date: entry.date,
      mileage: entry.mileage || null,
      cost: entry.cost || 0,
      notes: entry.notes || null,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateMaintenance(id, entry) {
  const { error } = await supabase
    .from('maintenance_log')
    .update({
      service_type: entry.serviceType,
      date: entry.date,
      mileage: entry.mileage || null,
      cost: entry.cost || 0,
      notes: entry.notes || null,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMaintenance(id) {
  const { error } = await supabase.from('maintenance_log').delete().eq('id', id);
  if (error) throw error;
}

// ─── Performance CRUD ────────────────────────────────────

export async function getPerformanceForCar(carId) {
  const { data, error } = await supabase
    .from('performance_entries')
    .select('*')
    .eq('car_id', carId)
    .order('date', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapPerformance);
}

export async function getPerformanceEntry(id) {
  const { data, error } = await supabase
    .from('performance_entries')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return mapPerformance(data);
}

export async function createPerformanceEntry(entry) {
  const { data, error } = await supabase
    .from('performance_entries')
    .insert({
      car_id: entry.carId,
      date: entry.date,
      rpm: entry.rpm || null,
      hp: entry.hp || null,
      torque: entry.torque || null,
      whp: entry.whp || null,
      zero_to_sixty: entry.zeroToSixty || null,
      quarter_mile: entry.quarterMile || null,
      notes: entry.notes || null,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function updatePerformanceEntry(id, entry) {
  const { error } = await supabase
    .from('performance_entries')
    .update({
      date: entry.date,
      rpm: entry.rpm || null,
      hp: entry.hp || null,
      torque: entry.torque || null,
      whp: entry.whp || null,
      zero_to_sixty: entry.zeroToSixty || null,
      quarter_mile: entry.quarterMile || null,
      notes: entry.notes || null,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deletePerformanceEntry(id) {
  const { error } = await supabase.from('performance_entries').delete().eq('id', id);
  if (error) throw error;
}

// ─── Aggregate Helpers ───────────────────────────────────

export async function getCarStats(carId) {
  const [modsResult, maintenanceResult] = await Promise.all([
    supabase.from('mods').select('cost').eq('car_id', carId),
    supabase.from('maintenance_log').select('cost').eq('car_id', carId),
  ]);

  const mods = modsResult.data || [];
  const maintenance = maintenanceResult.data || [];

  const modCost = mods.reduce((sum, m) => sum + (m.cost || 0), 0);
  const maintenanceCost = maintenance.reduce((sum, m) => sum + (m.cost || 0), 0);

  return {
    modCount: mods.length,
    modCost,
    maintenanceCount: maintenance.length,
    maintenanceCost,
    totalInvested: modCost + maintenanceCost,
  };
}

export async function getGarageStats(userId) {
  const { data: cars } = await supabase
    .from('cars')
    .select('id')
    .eq('user_id', userId);

  const carIds = (cars || []).map(c => c.id);
  if (carIds.length === 0) {
    return { carCount: 0, modCount: 0, totalInvested: 0 };
  }

  const [modsResult, maintenanceResult] = await Promise.all([
    supabase.from('mods').select('cost').in('car_id', carIds),
    supabase.from('maintenance_log').select('cost').in('car_id', carIds),
  ]);

  const mods = modsResult.data || [];
  const maintenance = maintenanceResult.data || [];

  const totalModCost = mods.reduce((sum, m) => sum + (m.cost || 0), 0);
  const totalMaintCost = maintenance.reduce((sum, m) => sum + (m.cost || 0), 0);

  return {
    carCount: carIds.length,
    modCount: mods.length,
    totalInvested: totalModCost + totalMaintCost,
  };
}
