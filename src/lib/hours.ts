/**
 * Opening-hours maths. Business hours are published in IST regardless of where
 * the visitor is sitting, so every comparison here is done against the wall
 * clock in Asia/Kolkata rather than the device's own timezone.
 */
import type { Contact } from '@/config/schema/common.schema';

export type BusinessHour = Contact['hours'][number];

const DAY_ORDER = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

const DAY_LABELS: Record<string, string> = {
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
};

export type OpenState = {
  open: boolean;
  /** `onBreak` is open-but-not-right-now: lunch, a ward round, a shoot. */
  onBreak: boolean;
  /** Short human line, e.g. "Opens 10:00" or "Closes 19:00". */
  detail: string;
  today: BusinessHour | null;
};

export function dayLabel(day: string): string {
  return DAY_LABELS[day.toLowerCase()] ?? day;
}

export function formatHourRange(hour: BusinessHour): string {
  if (!hour.open || !hour.close) return 'Closed';
  const base = `${to12h(hour.open)} – ${to12h(hour.close)}`;
  return hour.breakStart && hour.breakEnd
    ? `${base} (break ${to12h(hour.breakStart)}–${to12h(hour.breakEnd)})`
    : base;
}

/** "14:30" -> "2:30 pm". */
export function to12h(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h < 12 ? 'am' : 'pm';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** Sorts a week to start on Monday, whatever order the data listed it in. */
export function orderedWeek(hours: BusinessHour[]): BusinessHour[] {
  const weekday = (h: BusinessHour) => {
    const index = DAY_ORDER.indexOf(h.day.toLowerCase().slice(0, 3) as (typeof DAY_ORDER)[number]);
    return index <= 0 ? index + 7 : index; // Sunday last
  };
  return [...hours].sort((a, b) => weekday(a) - weekday(b));
}

/** IST day key + minutes since midnight for any instant. */
export function istNow(now: Date = new Date()): { day: string; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const hour = Number(get('hour')) % 24;
  return { day: get('weekday').toLowerCase().slice(0, 3), minutes: hour * 60 + Number(get('minute')) };
}

export function getOpenState(hours: BusinessHour[], now: Date = new Date()): OpenState {
  const { day, minutes } = istNow(now);
  const today = hours.find((h) => h.day.toLowerCase().slice(0, 3) === day) ?? null;

  if (!today || !today.open || !today.close) {
    const next = nextOpenDay(hours, day);
    return {
      open: false,
      onBreak: false,
      detail: next ? `Opens ${dayLabel(next.day)} ${to12h(next.open as string)}` : 'Closed today',
      today,
    };
  }

  const open = toMinutes(today.open);
  const close = toMinutes(today.close);

  if (minutes < open) return { open: false, onBreak: false, detail: `Opens ${to12h(today.open)}`, today };
  if (minutes >= close) {
    const next = nextOpenDay(hours, day);
    return {
      open: false,
      onBreak: false,
      detail: next ? `Opens ${dayLabel(next.day)} ${to12h(next.open as string)}` : 'Closed for today',
      today,
    };
  }

  if (today.breakStart && today.breakEnd) {
    const from = toMinutes(today.breakStart);
    const to = toMinutes(today.breakEnd);
    if (minutes >= from && minutes < to) {
      return { open: false, onBreak: true, detail: `Back at ${to12h(today.breakEnd)}`, today };
    }
  }

  return { open: true, onBreak: false, detail: `Closes ${to12h(today.close)}`, today };
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Walks forward from today to the next day that actually opens. */
function nextOpenDay(hours: BusinessHour[], fromDay: string): BusinessHour | null {
  const start = DAY_ORDER.indexOf(fromDay as (typeof DAY_ORDER)[number]);
  if (start < 0) return null;

  for (let step = 1; step <= 7; step += 1) {
    const day = DAY_ORDER[(start + step) % 7];
    const match = hours.find((h) => h.day.toLowerCase().slice(0, 3) === day);
    if (match?.open && match.close) return match;
  }
  return null;
}
