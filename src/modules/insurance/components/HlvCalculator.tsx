'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { CalcNumber, CalcSlider, DisclaimerNote, IntentButton, ResultStat } from '@/components/shared';
import { track, EVENTS } from '@/core/analytics';
import { formatINR, formatINRShort } from '@/lib/utils';
import { useInsuranceModule } from '../hooks/useInsuranceModule';
import { calculateHlv, type HlvInput } from '../lib/hlv';
import { hlvFields } from '../lib/wa-templates';

const SECTION = 'humanLifeValue';

/**
 * I3 — "how much cover do I actually need?" The gap is the conversion driver,
 * so it is the loudest thing on the card. Assumptions come from `module.hlv`;
 * the maths is `lib/hlv.ts`.
 */
export function HlvCalculator() {
  const { module } = useInsuranceModule();
  const [ageMin, ageMax] = module.estimator.ageRange;

  const [input, setInput] = useState<HlvInput>({
    annualIncome: 1_200_000,
    age: Math.min(ageMax, Math.max(ageMin, 30)),
    retirementAge: module.hlv.retirementAge,
    liabilities: 0,
    existingCover: 0,
  });
  const result = useMemo(() => calculateHlv(input, module.hlv), [input, module.hlv]);

  const set = (key: keyof HlvInput) => (value: number) =>
    setInput((current) => ({ ...current, [key]: value }));
  const used = () => track(EVENTS.TOOL_USE, { tool: SECTION });

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Human life value"
      title="How much cover does your family need?"
      subtitle="Your income, your loans, your existing policies — one honest number."
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 lg:items-start">
        <div className="surface-card flex flex-col gap-5 p-5 sm:p-6">
          <CalcNumber
            label="Annual income"
            value={input.annualIncome}
            onChange={set('annualIncome')}
            step={50_000}
            prefix="₹"
          />
          <CalcSlider
            label="Your age"
            display={`${input.age} years`}
            value={input.age}
            min={ageMin}
            max={Math.min(ageMax, input.retirementAge - 1)}
            step={1}
            onChange={set('age')}
            onCommit={used}
          />
          <CalcSlider
            label="Retirement age"
            display={`${input.retirementAge} years`}
            value={input.retirementAge}
            min={Math.max(45, input.age + 1)}
            max={75}
            step={1}
            onChange={set('retirementAge')}
            onCommit={used}
          />
          <CalcNumber
            label="Loans & liabilities"
            value={input.liabilities}
            onChange={set('liabilities')}
            step={100_000}
            prefix="₹"
            hint="Home loan, car loan, anything your family would have to repay."
          />
          <CalcNumber
            label="Existing life cover"
            value={input.existingCover}
            onChange={set('existingCover')}
            step={500_000}
            prefix="₹"
          />
        </div>

        <div className="surface-card flex flex-col gap-5 p-5 sm:p-6 lg:sticky lg:top-24">
          <div className="grid grid-cols-2 gap-3">
            <ResultStat label="You need" value={formatINRShort(result.recommended)} tone="brand" />
            <ResultStat label="You have" value={formatINRShort(result.existing)} />
          </div>

          {result.gap > 0 ? (
            <div className="rounded-xl border-2 border-danger p-4" role="status">
              <p className="inline-flex items-center gap-2 text-small font-semibold uppercase tracking-wide text-danger">
                <AlertTriangle className="size-4" aria-hidden />
                Cover gap
              </p>
              <p className="text-h2 font-display text-danger tabular-nums">
                {formatINR(result.gap)}
              </p>
              <p className="text-small text-fg-muted">
                Your family would be short by this much if something happened tomorrow.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-success p-4" role="status">
              <p className="inline-flex items-center gap-2 text-body font-semibold text-success">
                <CheckCircle2 className="size-5" aria-hidden />
                You are fully covered
              </p>
              <p className="text-small text-fg-muted">
                A yearly review keeps it that way as income and loans change.
              </p>
            </div>
          )}

          <IntentButton
            intent="hlv_gap"
            label={result.gap > 0 ? 'Cover my gap' : 'Review my cover'}
            section={SECTION}
            values={hlvFields(input, result)}
            className="w-full"
          />

          <DisclaimerNote>
            Income-replacement method: {Math.round((1 - module.hlv.selfExpenseRatio) * 100)}% of
            income for {result.workingYears} working years, discounted at{' '}
            {Math.round(module.hlv.discountRate * 1000) / 10}% a year, plus liabilities. A guide, not
            financial advice.
          </DisclaimerNote>
        </div>
      </div>
    </SectionShell>
  );
}
