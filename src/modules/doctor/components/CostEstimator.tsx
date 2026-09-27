'use client';

import { useMemo, useState } from 'react';
import { IndianRupee, Minus, Plus } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { DisclaimerNote, IntentButton } from '@/components/shared';
import { Label } from '@/components/ui/label';
import { track, EVENTS } from '@/core/analytics';
import { cn, formatINR } from '@/lib/utils';
import { useDoctorModule } from '../hooks/useDoctorModule';
import { estimateCost } from '../lib/cost';
import { treatmentFields } from '../lib/wa-templates';

const SECTION = 'costEstimator';
const MAX_UNITS = 8;

/**
 * D4 — the price question answered before the visitor has to ask it. Ranges,
 * session counts and the EMI tenures all come from `module.treatments` and
 * `module.emiTenures`; the arithmetic lives in `lib/cost.ts`.
 */
export function CostEstimator() {
  const { module } = useDoctorModule();
  const treatments = module.treatments;

  const [name, setName] = useState(treatments[0]?.name ?? '');
  const [units, setUnits] = useState(1);

  const treatment = treatments.find((entry) => entry.name === name) ?? treatments[0] ?? null;
  const estimate = useMemo(
    () => (treatment ? estimateCost(treatment, units, module.emiTenures) : null),
    [treatment, units, module.emiTenures],
  );

  if (!treatment || !estimate) return null;

  const unitLabel = treatment.unit ?? 'per treatment';
  const multiUnit = unitLabel.startsWith('per ') && unitLabel !== 'per treatment';

  function changeUnits(delta: number) {
    setUnits((value) => Math.min(MAX_UNITS, Math.max(1, value + delta)));
    track(EVENTS.TOOL_USE, { tool: SECTION, treatment: name });
  }

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Transparent pricing"
      title="What will it cost?"
      subtitle="Real ranges from this clinic's price list — no call needed to find out the ballpark."
    >
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="surface-card flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cost-treatment">Treatment</Label>
            <select
              id="cost-treatment"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setUnits(1);
                track(EVENTS.TOOL_USE, { tool: SECTION, treatment: event.target.value });
              }}
              className="h-11 rounded-lg border border-border bg-surface px-3 text-body text-fg"
            >
              {treatments.map((entry) => (
                <option key={entry.name} value={entry.name}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>

          {multiUnit ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="cost-units">How many ({unitLabel.replace('per ', '')})</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => changeUnits(-1)}
                  disabled={units <= 1}
                  className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-fg disabled:opacity-40"
                >
                  <Minus className="size-4" aria-hidden />
                </button>
                <output id="cost-units" className="w-10 text-center text-body-lg font-semibold text-fg">
                  {units}
                </output>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => changeUnits(1)}
                  disabled={units >= MAX_UNITS}
                  className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-fg disabled:opacity-40"
                >
                  <Plus className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          ) : null}

          <dl className="grid grid-cols-2 gap-3 text-small">
            <div className="rounded-lg border border-border bg-surface-2 p-3">
              <dt className="text-fg-subtle">Sessions</dt>
              <dd className="font-semibold text-fg">{treatment.sessions}</dd>
            </div>
            <div className="rounded-lg border border-border bg-surface-2 p-3">
              <dt className="text-fg-subtle">Per visit</dt>
              <dd className="font-semibold text-fg">{treatment.duration ?? 'On assessment'}</dd>
            </div>
          </dl>
        </div>

        <div className="surface-card flex flex-col gap-5 p-5 sm:p-6">
          <div>
            <p className="text-caption tracking-wide text-fg-subtle uppercase">Estimated range</p>
            <p className="inline-flex items-center gap-1 text-h3 font-display text-fg">
              <IndianRupee className="size-5 text-brand" aria-hidden />
              {formatINR(estimate.min).replace('₹', '')} – {formatINR(estimate.max).replace('₹', '')}
            </p>
            <p className="text-small text-fg-muted">
              {units > 1 ? `${units} × ${unitLabel}` : unitLabel}
            </p>
          </div>

          <div
            className="h-2 w-full overflow-hidden rounded-full bg-surface-2"
            role="img"
            aria-label={`Typical cost band ${formatINR(estimate.min)} to ${formatINR(estimate.max)}`}
          >
            <div
              className={cn('h-full rounded-full bg-brand')}
              style={{ marginLeft: `${estimate.bandStartPct}%`, width: `${estimate.bandWidthPct}%` }}
            />
          </div>

          <div className="rounded-xl border border-border bg-surface-2 p-4">
            <p className="text-body font-semibold text-fg">
              EMI from {formatINR(estimate.emiFrom)}/month
            </p>
            <p className="text-small text-fg-muted">
              No-cost EMI over {module.emiTenures.join(' / ')} months on the lower estimate.
            </p>
          </div>

          <IntentButton
            intent="quote_request"
            label="Get an exact quote"
            section={SECTION}
            values={treatmentFields(treatment, units)}
            className="w-full"
          />

          <DisclaimerNote>
            Indicative only. The final cost is confirmed after an examination and an X-ray.
          </DisclaimerNote>
        </div>
      </div>
    </SectionShell>
  );
}
