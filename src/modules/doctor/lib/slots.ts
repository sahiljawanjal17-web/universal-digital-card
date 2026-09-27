/**
 * Appointment availability (PART-07 §5.1). Pure and IST-fixed: the caller
 * passes `now`, so the same input always yields the same grid on the server,
 * on the client and in the tests — no hydration drift, no device-timezone bug.
 */
import {
  formatDayLabel,
  formatTime,
  getDayWindow,
  istClock,
  istDate,
  istInstant,
  parseTime,
  type BusinessHour,
  type IstDate,
} from '@/lib/utils';
import type { SlotConfig, SlotPeriod } from '../types';

/** Why a slot cannot be taken. Absent when it is bookable. */
export type SlotReason = 'past' | 'booked' | 'closed';

export interface SlotOption {
  /** The config day key, e.g. `today` / `tomorrow`. */
  day: string;
  /** Offset in days from today, which is what the day key really means. */
  offset: number;
  dayLabel: string;
  date: IstDate;
  period: string;
  periodLabel: string;
  range: string;
  /** Minutes past IST midnight when the period opens. */
  startMinutes: number;
  endMinutes: number;
  available: boolean;
  reason?: SlotReason;
  /** Seats left, already clamped at zero. */
  slotsLeft: number;
  capacity: number;
}

export interface SlotDay {
  day: string;
  offset: number;
  label: string;
  date: IstDate;
  /** False when every period of the day is closed, past or fully booked. */
  available: boolean;
  periods: SlotOption[];
}

/** `"10:00 AM - 1:00 PM"` → `[600, 780]`. Endash and hyphen both accepted. */
export function parseRange(range: string): { start: number; end: number } | null {
  const [rawStart, rawEnd] = range.split(/[-–—]/, 2);
  const start = parseTime(rawStart);
  const end = parseTime(rawEnd);
  if (start === null || end === null || end <= start) return null;

  return { start, end };
}

function bookedCount(config: SlotConfig, day: string, period: string): number {
  return config.booked.find((row) => row.day === day && row.period === period)?.count ?? 0;
}

function isBlocked(config: SlotConfig, day: string, period: string): boolean {
  return config.unavailable.some((row) => row.day === day && row.period === period);
}

/** Does the clinic's own opening window actually cover this period? */
function withinOpeningHours(hours: BusinessHour[], date: IstDate, start: number, end: number) {
  const window = getDayWindow(hours, date.dayKey);
  if (!window) return false;
  if (start < window.open || end > window.close) return false;
  // A period that sits entirely inside the lunch break is not offered.
  if (window.breakStart !== null && window.breakEnd !== null) {
    if (start >= window.breakStart && end <= window.breakEnd) return false;
  }

  return true;
}

function buildOption(
  config: SlotConfig,
  hours: BusinessHour[],
  period: SlotPeriod,
  day: string,
  offset: number,
  date: IstDate,
  nowMinutes: number,
): SlotOption {
  const parsed = parseRange(period.range);
  const start = parsed?.start ?? 0;
  const end = parsed?.end ?? 0;
  const booked = bookedCount(config, day, period.key);
  const slotsLeft = Math.max(0, period.capacity - booked);

  let reason: SlotReason | undefined;
  if (!parsed || !withinOpeningHours(hours, date, start, end)) {
    reason = 'closed';
  } else if (offset === 0 && nowMinutes >= end) {
    // At 6 PM today's morning period disables itself — PART-07 §8.
    reason = 'past';
  } else if (isBlocked(config, day, period.key) || slotsLeft === 0) {
    reason = 'booked';
  }

  return {
    day,
    offset,
    dayLabel: formatDayLabel(date, offset),
    date,
    period: period.key,
    periodLabel: period.label,
    range: parsed ? `${formatTime(start)} – ${formatTime(end)}` : period.range,
    startMinutes: start,
    endMinutes: end,
    available: reason === undefined,
    reason,
    slotsLeft,
    capacity: period.capacity,
  };
}

/**
 * The booking grid: one entry per configured day, each carrying its periods.
 * `config.slots.days` is positional — entry *n* is *n* days from today — which
 * is how `today` / `tomorrow` stay real dates rather than strings.
 */
export function getAvailableSlots(
  config: SlotConfig,
  hours: BusinessHour[],
  now: Date,
): SlotDay[] {
  const nowMinutes = istClock(now).minutes;

  return config.days.map((day, offset) => {
    const date = istDate(now, offset);
    const periods = config.periods.map((period) =>
      buildOption(config, hours, period, day, offset, date, nowMinutes),
    );

    return {
      day,
      offset,
      label: formatDayLabel(date, offset),
      date,
      available: periods.some((period) => period.available),
      periods,
    };
  });
}

/** The label a disabled chip shows instead of "3 slots left". */
export function reasonLabel(reason: SlotReason): string {
  if (reason === 'past') return 'Time passed';
  if (reason === 'booked') return 'Fully booked';

  return 'Clinic closed';
}

/** The absolute instant the period starts — what the .ics event needs. */
export function slotStart(slot: SlotOption): Date {
  return istInstant(slot.date, slot.startMinutes);
}

export function slotEnd(slot: SlotOption): Date {
  return istInstant(slot.date, slot.endMinutes);
}
