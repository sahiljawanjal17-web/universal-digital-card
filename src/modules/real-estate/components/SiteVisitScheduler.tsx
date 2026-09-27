'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatDate } from '@/lib/utils';
import { useRole } from '@/lib/hooks/useRole';
import { openIntent } from '@/core/whatsapp';
import type { Property } from '../types';
import { propertyFields } from '../lib/wa-templates';

const TIME_SLOTS = [
  '10:00 AM – 12:00 PM',
  '12:00 PM – 2:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
];

/** Next 7 calendar days (today inclusive). */
function getNext7Days(): Date[] {
  const days: Date[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  return days;
}

function dayLabel(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dateStr = date.toDateString();
  if (dateStr === today.toDateString()) return 'Today';
  if (dateStr === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

/**
 * R13 — date + time slot chips → `site_visit_book` WhatsApp intent. No form
 * submission, no API call — the WhatsApp message carries all the details.
 */
export function SiteVisitScheduler({ property }: { property: Property }) {
  const { data } = useRole();
  const days = getNext7Days();

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const canSubmit = selectedDay !== null && selectedSlot !== null;

  function handleConfirm() {
    if (!selectedDay || !selectedSlot) return;

    openIntent({
      phone: data.contact.whatsapp,
      intent: 'site_visit_book',
      business: data.profile.name,
      section: 'propertyDetailDrawer',
      values: [
        ...propertyFields(property),
        ['Preferred Date', formatDate(selectedDay.toISOString())],
        ['Preferred Time', selectedSlot],
      ],
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-5 text-brand" aria-hidden />
        <h3 className="text-body-lg font-semibold text-fg">Schedule a Site Visit</h3>
      </div>

      <div>
        <p className="mb-2 text-small text-fg-muted">Select a date</p>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => {
            const isSelected = selectedDay?.toDateString() === day.toDateString();
            return (
              <button
                key={day.toISOString()}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-small transition-colors',
                  isSelected
                    ? 'border-brand bg-brand text-brand-fg'
                    : 'border-border bg-surface text-fg hover:border-brand hover:bg-surface-2',
                )}
              >
                {dayLabel(day)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-small text-fg-muted">Select a time slot</p>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-small transition-colors',
                  isSelected
                    ? 'border-brand bg-brand text-brand-fg'
                    : 'border-border bg-surface text-fg hover:border-brand hover:bg-surface-2',
                )}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        type="button"
        disabled={!canSubmit}
        onClick={handleConfirm}
        className="w-full"
      >
        Confirm Site Visit on WhatsApp
      </Button>
    </div>
  );
}

