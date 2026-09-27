'use client';

import { useState } from 'react';
import { Video } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { IntentButton } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn, formatINR } from '@/lib/utils';
import { useDoctorModule } from '../hooks/useDoctorModule';

const SECTION = 'teleconsult';

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * D7 — a video consultation for the patient who cannot come in. Fee, platform
 * and the pickable day/period pairs all come from `module.teleconsult` and
 * `module.slots`; the message is the `teleconsult_book` template.
 */
export function TeleconsultCard() {
  const { module } = useDoctorModule();
  const { teleconsult, slots } = module;

  const options = slots.days.flatMap((day) =>
    slots.periods.map((period) => `${titleCase(day)}, ${period.label}`),
  );

  const [name, setName] = useState('');
  const [time, setTime] = useState(options[0] ?? '');
  const [concern, setConcern] = useState('');

  if (!teleconsult.enabled) return null;

  const values: [string, string][] = [
    ['Name', name.trim()],
    ['Preferred Time', time],
    ['Concern', concern.trim()],
    ['Consultation Fee', formatINR(teleconsult.fee)],
  ];

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Can't come in?"
      title="Consult on video"
      subtitle={`A ${teleconsult.platform} call with the doctor — for follow-ups, second opinions and reports.`}
      tone="muted"
    >
      <div className="surface-card mx-auto grid max-w-3xl gap-6 p-5 sm:p-6 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-start gap-3 md:w-44">
          <span className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Video className="size-6" aria-hidden />
          </span>
          <p className="text-h3 font-display text-fg">{formatINR(teleconsult.fee)}</p>
          <p className="text-small text-fg-muted">per consultation · link shared on WhatsApp</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tc-name">Your name</Label>
            <Input
              id="tc-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className="h-11"
            />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-small font-medium text-fg">Preferred time</legend>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={time === option}
                  onClick={() => setTime(option)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-small transition-colors',
                    time === option
                      ? 'border-brand bg-brand text-brand-fg'
                      : 'border-border bg-surface text-fg hover:border-brand',
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tc-concern">What would you like to discuss?</Label>
            <Input
              id="tc-concern"
              value={concern}
              onChange={(event) => setConcern(event.target.value)}
              placeholder="e.g. Second opinion on root canal"
              className="h-11"
            />
          </div>

          <IntentButton
            intent="teleconsult_book"
            label="Request video consultation"
            section={SECTION}
            values={values.filter(([, value]) => value.length > 0)}
            icon={<Video className="size-4" aria-hidden />}
            className="w-full"
          />
        </div>
      </div>
    </SectionShell>
  );
}
