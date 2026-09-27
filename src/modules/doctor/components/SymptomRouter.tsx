'use client';

import { useState } from 'react';
import { PhoneCall, Stethoscope } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { IntentButton } from '@/components/shared';
import { buttonVariants } from '@/components/ui/button';
import { track, trackCta, EVENTS } from '@/core/analytics';
import { cn, toTelHref } from '@/lib/utils';
import { useDoctorModule } from '../hooks/useDoctorModule';
import type { Symptom, Urgency } from '../types';

const SECTION = 'symptomRouter';

const URGENCY_COPY: Record<Urgency, { label: string; chip: string; card: string }> = {
  high: {
    label: 'See a dentist today',
    chip: 'border-danger/40 bg-danger/10 text-danger',
    card: 'border-danger/40',
  },
  medium: {
    label: 'Book within this week',
    chip: 'border-warning/40 bg-warning/10 text-warning',
    card: 'border-warning/40',
  },
  low: {
    label: 'Routine — plan it',
    chip: 'border-success/40 bg-success/10 text-success',
    card: 'border-success/40',
  },
};

/**
 * D3 — "what is wrong?" answered in one tap. The chip list, the department and
 * the urgency all come from `module.symptomRouter`, so a clinic changes its
 * triage by editing data, never this file.
 */
export function SymptomRouter() {
  const { module, business } = useDoctorModule();
  const [selected, setSelected] = useState<Symptom | null>(null);
  const symptoms = module.symptomRouter;

  if (symptoms.length === 0) return null;

  const urgency = selected ? URGENCY_COPY[selected.urgency] : null;
  const emergency = module.emergency;

  return (
    <SectionShell
      sectionKey={SECTION}
      tone="muted"
      eyebrow="Not sure where to start?"
      title="Tell us what you are feeling"
      subtitle="Tap the closest match. We will point you at the right department before you book."
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Common symptoms">
          {symptoms.map((symptom) => {
            const isSelected = selected?.symptom === symptom.symptom;
            return (
              <button
                key={symptom.symptom}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setSelected(symptom);
                  track(EVENTS.TOOL_USE, { tool: SECTION, symptom: symptom.symptom });
                }}
                className={cn(
                  'rounded-full border px-4 py-2 text-small transition-colors',
                  isSelected
                    ? 'border-brand bg-brand text-brand-fg'
                    : 'border-border bg-surface text-fg hover:border-brand hover:bg-surface-2',
                )}
              >
                {symptom.symptom}
              </button>
            );
          })}
        </div>

        {selected && urgency ? (
          <div className={cn('surface-card flex flex-col gap-4 border p-5 sm:p-6', urgency.card)}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-body-lg font-semibold text-fg">
                <Stethoscope className="size-5 text-brand" aria-hidden />
                {selected.department}
              </span>
              <span
                className={cn(
                  'rounded-full border px-3 py-1 text-caption font-semibold',
                  urgency.chip,
                )}
              >
                {urgency.label}
              </span>
            </div>

            {selected.advice ? (
              <p className="text-body text-pretty text-fg-muted">{selected.advice}</p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              {selected.urgency === 'high' && emergency.enabled ? (
                <a
                  href={toTelHref(emergency.number)}
                  onClick={() => trackCta('Call the clinic now', SECTION, { intent: 'emergency_call' })}
                  className={cn(
                    buttonVariants({ variant: 'destructive', size: 'lg' }),
                    'h-11 gap-2 px-5 text-body',
                  )}
                >
                  <PhoneCall className="size-4" aria-hidden />
                  Call the clinic now
                </a>
              ) : null}

              <IntentButton
                intent="appointment_book"
                label="Book an appointment"
                section={SECTION}
                variant={selected.urgency === 'high' ? 'outline' : 'default'}
                values={[
                  ['Symptom', selected.symptom],
                  ['Department', selected.department],
                  ['Urgency', selected.urgency],
                ]}
              />
            </div>

            <p className="text-caption text-fg-subtle">
              Guidance only — {business} confirms the diagnosis after an examination.
            </p>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
