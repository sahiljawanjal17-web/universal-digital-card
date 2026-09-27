'use client';

import { ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { GENDERS, type PreAppointmentDetails } from '../lib/pre-appointment';

type TextKey = Exclude<keyof PreAppointmentDetails, 'gender'>;

const TEXT_FIELDS: { key: TextKey; label: string; placeholder: string; wide?: boolean }[] = [
  { key: 'symptom', label: 'Main symptom', placeholder: 'e.g. Sensitivity in a lower molar', wide: true },
  { key: 'duration', label: 'Since when?', placeholder: 'e.g. 2 weeks' },
  { key: 'conditions', label: 'Existing conditions', placeholder: 'e.g. Diabetes, BP — or None' },
  { key: 'medication', label: 'Current medication', placeholder: 'e.g. Metformin — or None', wide: true },
];

/**
 * D6 — optional patient details, collapsed by default so the booking stays a
 * three-field form for those who skip it. Controlled: SlotBooking owns the
 * state and folds `preAppointmentFields()` into the `appointment_book` message.
 */
export function PreAppointmentForm({
  value,
  onChange,
  className,
}: {
  value: PreAppointmentDetails;
  onChange: (next: PreAppointmentDetails) => void;
  className?: string;
}) {
  function set<K extends keyof PreAppointmentDetails>(key: K, next: PreAppointmentDetails[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <details className={cn('group rounded-xl border border-border bg-surface-2', className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-small font-medium text-fg">
        <span>
          Add patient details <span className="font-normal text-fg-subtle">(optional · saves time at the desk)</span>
        </span>
        <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
      </summary>

      <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="pre-age">Age</Label>
          <Input
            id="pre-age"
            type="number"
            inputMode="numeric"
            min={0}
            max={120}
            value={value.age}
            onChange={(event) => set('age', event.target.value)}
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-small font-medium text-fg">Gender</legend>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((gender) => (
              <button
                key={gender}
                type="button"
                aria-pressed={value.gender === gender}
                onClick={() => set('gender', value.gender === gender ? '' : gender)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-small transition-colors',
                  value.gender === gender
                    ? 'border-brand bg-brand text-brand-fg'
                    : 'border-border bg-surface text-fg hover:border-brand',
                )}
              >
                {gender}
              </button>
            ))}
          </div>
        </fieldset>

        {TEXT_FIELDS.map((field) => (
          <div key={field.key} className={cn('flex flex-col gap-2', field.wide && 'sm:col-span-2')}>
            <Label htmlFor={`pre-${field.key}`}>{field.label}</Label>
            <Input
              id={`pre-${field.key}`}
              placeholder={field.placeholder}
              value={value[field.key]}
              onChange={(event) => set(field.key, event.target.value)}
            />
          </div>
        ))}
      </div>
    </details>
  );
}
