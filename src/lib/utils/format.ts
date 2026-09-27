/**
 * India-specific display formatting. Per docs/07-CONVENTIONS.md §6 this is the
 * only place allowed to call `toLocaleString` / `Intl` for money and dates.
 */
import { format as formatDateFns, parseISO } from 'date-fns';

const LAKH = 100_000;
const CRORE = 10_000_000;
const THOUSAND = 1_000;

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** `formatINR(12500000)` → `"₹1,25,00,000"` (Indian digit grouping). */
export function formatINR(amount: number): string {
  return inrFormatter.format(amount);
}

/** Drop a trailing `.00` / `.50` → `.5` so short money reads cleanly. */
function trim(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, '');
}

/** `formatINRShort(12500000)` → `"₹1.25 Cr"`, `(4500000)` → `"₹45 L"`. */
export function formatINRShort(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  if (abs >= CRORE) return `${sign}₹${trim(abs / CRORE)} Cr`;
  if (abs >= LAKH) return `${sign}₹${trim(abs / LAKH)} L`;
  if (abs >= THOUSAND) return `${sign}₹${trim(abs / THOUSAND)} K`;
  return formatINR(amount);
}

/** `formatDate('2026-02-14')` → `"14 Feb 2026"`. Accepts ISO strings or Date. */
export function formatDate(value: string | Date, pattern = 'd MMM yyyy'): string {
  const date = typeof value === 'string' ? parseISO(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return formatDateFns(date, pattern);
}

/** Re-exported so callers only ever need one formatting import. */
export { formatPhone } from './phone';
