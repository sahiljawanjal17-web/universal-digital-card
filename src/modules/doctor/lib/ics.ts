/**
 * Appointment calendar file (PART-07 §5.2 success state). Times are emitted in
 * UTC (`...Z`), which is the only form every calendar app reads identically —
 * the IST wall clock is converted once, here, and never guessed by the client.
 */

export interface AppointmentEvent {
  start: Date;
  end: Date;
  title: string;
  description: string;
  location: string;
  /** Stable per booking, so a re-download updates the event instead of duplicating it. */
  uid: string;
}

/** `20260921T103000Z` */
function toIcsStamp(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

/** RFC 5545 escaping: commas, semicolons, backslashes and newlines. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

export function buildAppointmentIcs(event: AppointmentEvent): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Universal Digital Card//Appointment//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${escapeText(event.uid)}`,
    `DTSTAMP:${toIcsStamp(new Date())}`,
    `DTSTART:${toIcsStamp(event.start)}`,
    `DTEND:${toIcsStamp(event.end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(event.title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/** Browser-only: hands the .ics to the OS. No-op during SSR. */
export function downloadIcs(filename: string, content: string): void {
  if (typeof document === 'undefined') return;

  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
