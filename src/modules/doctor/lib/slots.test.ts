import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  formatTime,
  getHoursStatus,
  istClock,
  parseTime,
  type BusinessHour,
} from '@/lib/utils/business-hours';
import { getAvailableSlots, parseRange, slotStart } from './slots';
import { estimateCost, noCostEmi } from './cost';
import { buildAppointmentIcs } from './ics';
import type { SlotConfig, Treatment } from '../types';

const dataPath = path.resolve(process.cwd(), 'src/data/roles/doctor.json');
const raw = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const slots = raw.module.slots as SlotConfig;
const hours = raw.contact.hours as BusinessHour[];
const treatments = raw.module.treatments as Treatment[];

/** An IST wall-clock instant, built from the UTC offset so the host TZ cannot leak in. */
function ist(year: number, month: number, day: number, hour: number, minute = 0): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, minute - 330));
}

// 2026-09-21 is a Monday; 2026-09-27 a Sunday; 2026-09-26 a Saturday.
describe('business hours (IST)', () => {
  test('parses both 24h and 12h clock strings', () => {
    assert.equal(parseTime('10:00'), 600);
    assert.equal(parseTime('1:00 PM'), 780);
    assert.equal(parseTime('12:00 AM'), 0);
    assert.equal(parseTime('12:30 PM'), 750);
    assert.equal(parseTime('nonsense'), null);
    assert.equal(parseTime(null), null);
  });

  test('formats minutes back to a 12h label', () => {
    assert.equal(formatTime(600), '10:00 AM');
    assert.equal(formatTime(1200), '8:00 PM');
    assert.equal(formatTime(0), '12:00 AM');
  });

  test('reads the IST wall clock regardless of the host timezone', () => {
    // 05:00 UTC is 10:30 IST on the same day.
    const clock = istClock(new Date(Date.UTC(2026, 8, 21, 5, 0)));
    assert.equal(clock.minutes, 630);
    assert.equal(clock.dayKey, 'mon');
    assert.equal(clock.day, 21);
  });

  test('open during the morning session', () => {
    const status = getHoursStatus(hours, ist(2026, 9, 21, 11, 0));
    assert.equal(status.state, 'open');
    assert.equal(status.detail, 'Closes at 8:00 PM');
  });

  test('on break between the two sessions', () => {
    const status = getHoursStatus(hours, ist(2026, 9, 21, 14, 30));
    assert.equal(status.state, 'break');
    assert.equal(status.detail, 'Resumes 4:00 PM');
  });

  test('closing soon in the last half hour', () => {
    const status = getHoursStatus(hours, ist(2026, 9, 21, 19, 35));
    assert.equal(status.state, 'closing-soon');
    assert.equal(status.label, 'Closing in 25 min');
  });

  test('sunday is closed and points at monday', () => {
    const status = getHoursStatus(hours, ist(2026, 9, 27, 11, 0));
    assert.equal(status.state, 'closed');
    assert.equal(status.detail, 'Opens Mon 10:00 AM');
  });

  test('before opening the same day', () => {
    const status = getHoursStatus(hours, ist(2026, 9, 21, 8, 0));
    assert.equal(status.state, 'closed');
    assert.equal(status.detail, 'Opens today 10:00 AM');
  });

  test('after closing points at tomorrow', () => {
    const status = getHoursStatus(hours, ist(2026, 9, 21, 21, 0));
    assert.equal(status.state, 'closed');
    assert.equal(status.detail, 'Opens tomorrow 10:00 AM');
  });
});

describe('doctor slots', () => {
  test('parses a period range', () => {
    assert.deepEqual(parseRange('10:00 AM - 1:00 PM'), { start: 600, end: 780 });
    assert.deepEqual(parseRange('4:00 PM – 8:00 PM'), { start: 960, end: 1200 });
    assert.equal(parseRange('whenever'), null);
  });

  test('day keys resolve to real IST dates and labels', () => {
    const days = getAvailableSlots(slots, hours, ist(2026, 9, 21, 9, 0));
    assert.equal(days.length, slots.days.length);
    assert.ok(days[0].label.startsWith('Today, 21 Sep'));
    assert.ok(days[1].label.startsWith('Tomorrow, 22 Sep'));
  });

  test('a period that has already ended today is past, not bookable', () => {
    // 6 PM — the morning session is over, the evening one is still running.
    const [today] = getAvailableSlots(slots, hours, ist(2026, 9, 21, 18, 0));
    const morning = today.periods.find((period) => period.period === 'morning');
    const evening = today.periods.find((period) => period.period === 'evening');

    assert.equal(morning?.available, false);
    assert.equal(morning?.reason, 'past');
    assert.equal(evening?.available, true);
  });

  test('the same period is still open earlier in the day', () => {
    const [today] = getAvailableSlots(slots, hours, ist(2026, 9, 21, 9, 0));
    const morning = today.periods.find((period) => period.period === 'morning');

    assert.equal(morning?.available, true);
    assert.equal(morning?.reason, undefined);
  });

  test('an unavailable entry reads as fully booked', () => {
    const days = getAvailableSlots(slots, hours, ist(2026, 9, 21, 9, 0));
    const blocked = days[1].periods.find((period) => period.period === 'morning');

    assert.equal(blocked?.available, false);
    assert.equal(blocked?.reason, 'booked');
  });

  test('slots left comes from capacity minus the booked count', () => {
    const [today] = getAvailableSlots(slots, hours, ist(2026, 9, 21, 9, 0));
    const evening = today.periods.find((period) => period.period === 'evening');
    const capacity = slots.periods.find((period) => period.key === 'evening')?.capacity ?? 0;
    const booked = slots.booked.find(
      (row) => row.day === 'today' && row.period === 'evening',
    )?.count ?? 0;

    assert.equal(evening?.slotsLeft, capacity - booked);
  });

  test('a period outside the day window is closed — saturday evening', () => {
    // Saturday 2026-09-26 shuts at 5 PM, so the 4-8 PM session cannot run.
    const [saturday] = getAvailableSlots(slots, hours, ist(2026, 9, 26, 9, 0));
    const evening = saturday.periods.find((period) => period.period === 'evening');

    assert.equal(evening?.available, false);
    assert.equal(evening?.reason, 'closed');
  });

  test('slot start resolves to the right absolute instant', () => {
    const [today] = getAvailableSlots(slots, hours, ist(2026, 9, 21, 9, 0));
    const morning = today.periods.find((period) => period.period === 'morning');

    // 10:00 IST == 04:30 UTC.
    assert.equal(slotStart(morning!).toISOString(), '2026-09-21T04:30:00.000Z');
  });
});

describe('cost estimator', () => {
  test('no-cost EMI divides the principal by the longest tenure', () => {
    assert.equal(noCostEmi(18000, [3, 6, 9]), 2000);
    assert.equal(noCostEmi(4500, [3, 6]), 750);
  });

  test('units multiply the whole band', () => {
    const treatment = treatments[0];
    const single = estimateCost(treatment, 1, [3, 6, 9]);
    const double = estimateCost(treatment, 2, [3, 6, 9]);

    assert.equal(double.min, single.min * 2);
    assert.equal(double.max, single.max * 2);
    assert.equal(double.emiFrom, Math.round(double.min / 9));
  });

  test('every treatment in the data has a sane range', () => {
    for (const treatment of treatments) {
      assert.ok(treatment.max >= treatment.min, `${treatment.name} range inverted`);
    }
  });
});

describe('appointment ics', () => {
  test('emits a UTC event a calendar can read', () => {
    const ics = buildAppointmentIcs({
      start: ist(2026, 9, 21, 10, 0),
      end: ist(2026, 9, 21, 13, 0),
      title: 'Appointment — Smile Studio',
      description: 'Root Canal; morning',
      location: 'FC Road, Pune',
      uid: 'today-morning-20260921@smile-studio',
    });

    assert.ok(ics.startsWith('BEGIN:VCALENDAR'));
    assert.ok(ics.includes('DTSTART:20260921T043000Z'));
    assert.ok(ics.includes('DTEND:20260921T073000Z'));
    // Semicolons in free text must be escaped, or the file breaks the parser.
    assert.ok(ics.includes('DESCRIPTION:Root Canal\\; morning'));
    assert.ok(ics.trim().endsWith('END:VCALENDAR'));
  });
});
