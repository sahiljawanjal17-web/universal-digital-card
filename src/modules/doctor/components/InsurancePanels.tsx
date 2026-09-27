'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { DisclaimerNote, IntentButton } from '@/components/shared';
import { cn } from '@/lib/utils';
import { useDoctorModule } from '../hooks/useDoctorModule';

const SECTION = 'insurancePanels';

/**
 * D8 — the cashless panels the clinic is empanelled with, from
 * `module.insurancePanels`. Picking one pre-fills the "Check my insurance"
 * message so the front desk knows which TPA to call.
 */
export function InsurancePanels() {
  const { module } = useDoctorModule();
  const panels = module.insurancePanels;
  const [selected, setSelected] = useState<string | null>(null);

  if (panels.length === 0) return null;

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Cashless treatment"
      title="Insurance we accept"
      subtitle="Tap your insurer and we'll confirm your cover before the visit."
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {panels.map((panel) => (
            <li key={panel}>
              <button
                type="button"
                aria-pressed={selected === panel}
                onClick={() => setSelected(selected === panel ? null : panel)}
                className={cn(
                  'surface-card flex h-full w-full items-center gap-2 px-3 py-3 text-left text-small font-medium transition-colors',
                  selected === panel ? 'border-brand text-brand' : 'text-fg hover:border-brand',
                )}
              >
                <ShieldCheck className="size-4 shrink-0 text-success" aria-hidden />
                {panel}
              </button>
            </li>
          ))}
        </ul>

        <IntentButton
          intent="general_inquiry"
          label={selected ? `Check my ${selected} cover` : 'Check my insurance'}
          section={SECTION}
          variant="outline"
          values={[
            ['Enquiry', 'Cashless insurance check'],
            ['Insurer', selected ?? 'Not listed / not sure'],
          ]}
          className="mx-auto w-full sm:w-auto"
        />

        <DisclaimerNote>
          Cashless approval depends on your policy terms and the insurer&apos;s pre-authorisation.
        </DisclaimerNote>
      </div>
    </SectionShell>
  );
}
