/**
 * Opening-hours logic, shared by every role that keeps a counter open
 * (PART-07 §9 — PART-09 studio slots and PART-10 gym timings reuse this).
 *
 * Everything here is evaluated in **IST**: a clinic in Pune closes at 7 PM
 * Pune time whether the visitor's laptop says Dubai or Toronto, so the device
 * timezone is deliberately never consulted.
 */

export const IST_TIME_ZONE = 'Asia/Kolkata';

/** Minutes IST runs ahead of UTC. */
export const IST_OFFSET_MINUTES = 330;

/** Index 0 is Sunday, matching `Date#getUTCDay()`. */
export const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export type DayKey = (typeof DAY_KEYS)[number];

const DAY_NAMES: Record<DayKey, string> = {
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
};

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** The `contact.hours` row shape (`BusinessHourSchema`), widened for reuse. */
export interface BusinessHour {
  day: string;
  open: string | null;
  close: string | null;
  breakStart?: string | null;
  breakEnd?: string | null;
}

/** An IST calendar day, with no time attached. */
export interface IstDate {
  year: number;
  /** 1-12, not the `Date` 0-11. */
  month: number;
  day: number;
  /** 0 = Sunday. */
  dayIndex: number;
  dayKey: DayKey;
}

/** A wall-clock reading of "now" in IST. */
export interface IstClock extends IstDate {
  /** Minutes since IST midnight. */
  minutes: number;
}

const PARTS_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: IST_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): number {
  return Number(parts.find((entry) => entry.type === type)?.value ?? '0');
}

/** Reads the IST wall clock out of an absolute instant. */
export function istClock(now: Date): IstClock {
  const parts = PARTS_FORMATTER.formatToParts(now);
  const year = part(parts, 'year');
  const month = part(parts, 'month');
  const day = part(parts, 'day');
  const minutes = part(parts, 'hour') * 60 + part(parts, 'minute');
  // Date.UTC over the IST calendar fields: the weekday of that civil date,
  // with no risk of the host timezone shifting it across midnight.
  const dayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return { year, month, day, dayIndex, dayKey: DAY_KEYS[dayIndex], minutes };
}

/** The IST calendar day `offsetDays` after the one `now` falls on. */
export function istDate(now: Date, offsetDays = 0): IstDate {
  const { year, month, day } = istClock(now);
  const shifted = new Date(Date.UTC(year, month - 1, day + offsetDays));

  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    dayIndex: shifted.getUTCDay(),
    dayKey: DAY_KEYS[shifted.getUTCDay()],
  };
}

/** The absolute instant of `minutes` past midnight on an IST calendar day. */
export function istInstant(date: IstDate, minutes = 0): Date {
  return new Date(Date.UTC(date.year, date.month - 1, date.day, 0, minutes - IST_OFFSET_MINUTES));
}

/**
 * Minutes since midnight from `"18:30"`, `"6:30 PM"` or `"6 PM"`. Returns null
 * for anything unparseable, so a caller can treat it as "no hours that day".
 */
export function parseTime(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^\s*(\d{1,2})(?::(\d{2}))?\s*([ap])?\.?m?\.?\s*$/i.exec(value);
  if (!match) return null;

  let hours = Number(match[1]);
  const mins = Number(match[2] ?? '0');
  const meridiem = match[3]?.toLowerCase();

  if (hours > 23 || mins > 59) return null;
  if (meridiem === 'a' && hours === 12) hours = 0;
  if (meridiem === 'p' && hours !== 12) hours += 12;

  return hours * 60 + mins;
}

/** `1140` → `"7:00 PM"`. */
export function formatTime(minutes: number): string {
  const total = ((minutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(total / 60);
  const mins = total % 60;
  const meridiem = hours24 < 12 ? 'AM' : 'PM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${hours12}:${String(mins).padStart(2, '0')} ${meridiem}`;
}

/** `"Today, 20 Sep"` / `"Tomorrow, 21 Sep"` / `"Mon, 22 Sep"`. */
export function formatDayLabel(date: IstDate, offsetDays: number): string {
  const tail = `${date.day} ${MONTH_NAMES[date.month - 1]}`;
  if (offsetDays === 0) return `Today, ${tail}`;
  if (offsetDays === 1) return `Tomorrow, ${tail}`;

  return `${DAY_NAMES[date.dayKey].slice(0, 3)}, ${tail}`;
}

/** The hours row for a weekday, matched on the first three letters. */
export function findDayHours(hours: BusinessHour[], dayKey: DayKey): BusinessHour | null {
  return hours.find((row) => row.day.slice(0, 3).toLowerCase() === dayKey) ?? null;
}

export interface DayWindow {
  open: number;
  close: number;
  breakStart: number | null;
  breakEnd: number | null;
}

/** Null when the row is missing, malformed, or the day is a weekly holiday. */
export function getDayWindow(hours: BusinessHour[], dayKey: DayKey): DayWindow | null {
  const row = findDayHours(hours, dayKey);
  if (!row) return null;

  const open = parseTime(row.open);
  const close = parseTime(row.close);
  if (open === null || close === null || close <= open) return null;

  const breakStart = parseTime(row.breakStart);
  const breakEnd = parseTime(row.breakEnd);
  const hasBreak = breakStart !== null && breakEnd !== null && breakEnd > breakStart;

  return {
    open,
    close,
    breakStart: hasBreak ? breakStart : null,
    breakEnd: hasBreak ? breakEnd : null,
  };
}

export type HoursState = 'open' | 'closing-soon' | 'break' | 'closed';

export interface HoursStatus {
  state: HoursState;
  /** Chip text — `Open now`, `Closing in 25 min`, `On break`, `Closed`. */
  label: string;
  /** The line under it — `Closes at 7:00 PM`, `Opens tomorrow 10:00 AM`. */
  detail: string;
}

export const CLOSING_SOON_MINUTES = 30;

/**
 * `Opens tomorrow 10:00 AM` — searches up to a week ahead.
 *
 * On a weekly holiday the weekday is named instead ("Opens Mon 10:00 AM"):
 * "tomorrow" on a Sunday board is the one wording people misread, because it
 * is the day the clinic was shut that they are trying to work around.
 */
function nextOpening(hours: BusinessHour[], now: Date, fromOffset: number): string {
  const relativeAllowed = fromOffset > 0;

  for (let offset = fromOffset; offset <= fromOffset + 7; offset++) {
    const date = istDate(now, offset);
    const window = getDayWindow(hours, date.dayKey);
    if (!window) continue;

    const when =
      offset === 0
        ? 'today'
        : offset === 1 && relativeAllowed
          ? 'tomorrow'
          : DAY_NAMES[date.dayKey].slice(0, 3);
    return `Opens ${when} ${formatTime(window.open)}`;
  }

  return 'Opening hours on request';
}

/**
 * The live open / closing-soon / on-break / closed reading. Pure — the caller
 * passes `now`, which is what lets a 60s interval (and the tests) drive it.
 */
export function getHoursStatus(
  hours: BusinessHour[],
  now: Date,
  closingSoonMinutes: number = CLOSING_SOON_MINUTES,
): HoursStatus {
  const clock = istClock(now);
  const window = getDayWindow(hours, clock.dayKey);

  if (!window || clock.minutes >= window.close) {
    return { state: 'closed', label: 'Closed', detail: nextOpening(hours, now, window ? 1 : 0) };
  }

  if (clock.minutes < window.open) {
    return { state: 'closed', label: 'Closed', detail: `Opens today ${formatTime(window.open)}` };
  }

  if (
    window.breakStart !== null &&
    window.breakEnd !== null &&
    clock.minutes >= window.breakStart &&
    clock.minutes < window.breakEnd
  ) {
    return { state: 'break', label: 'On break', detail: `Resumes ${formatTime(window.breakEnd)}` };
  }

  const left = window.close - clock.minutes;
  if (left <= closingSoonMinutes) {
    return {
      state: 'closing-soon',
      label: `Closing in ${left} min`,
      detail: `Closes at ${formatTime(window.close)}`,
    };
  }

  return { state: 'open', label: 'Open now', detail: `Closes at ${formatTime(window.close)}` };
}
