/**
 * Formatting Utilities - utils/format.ts
 *
 * Pure helper functions for displaying numbers, dates, and lookup-table
 * values in a human-readable format throughout the UI.  All functions
 * are null-safe and return sensible defaults when given null/undefined.
 */

import { MOD_CATEGORIES, SERVICE_TYPES } from '@/types/models';

/**
 * Format a dollar amount with locale-aware thousands separators.
 * Returns "$0" for null/undefined values.
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '$0';
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/**
 * Format a mileage value with locale-aware thousands separators
 * and a trailing " mi" suffix.  Returns "0 mi" for null/undefined.
 */
export function formatMileage(miles: number | null | undefined): string {
  if (miles == null) return '0 mi';
  return `${miles.toLocaleString('en-US')} mi`;
}

/**
 * Parse an ISO date string and return a short human-readable date
 * (e.g. "Jan 15, 2024").  Returns the raw string if parsing fails,
 * or an empty string for null/undefined input.
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Convert a service-type value (e.g. "oil_change") to its display
 * label (e.g. "Oil Change").  Falls back to the raw value if no
 * match is found in SERVICE_TYPES.
 */
export function formatServiceType(value: string): string {
  const found = SERVICE_TYPES.find((s) => s.value === value);
  return found ? found.label : value;
}

/**
 * Convert a mod-category value (e.g. "forced_induction") to its
 * display label (e.g. "Forced Induction").  Falls back to the raw
 * value if no match is found in MOD_CATEGORIES.
 */
export function formatModCategory(value: string): string {
  const found = MOD_CATEGORIES.find((c) => c.value === value);
  return found ? found.label : value;
}
