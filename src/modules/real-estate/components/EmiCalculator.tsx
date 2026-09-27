'use client';

import { useMemo, useState } from 'react';
import { Landmark } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { DisclaimerNote, IntentButton } from '@/components/shared';
import { NumberTicker } from '@/components/motion';
import { formatINR, formatINRShort } from '@/lib/utils';
import { buildAmortization, downPaymentFromPct, emiSummary, loanAmount } from '../lib/emi';
import { useCalculatorProperty } from '../hooks/useCalculatorProperty';
import { useToolUse } from '../hooks/useToolUse';
import { AmortizationTable } from './AmortizationTable';
import { CalcSlider, ResultStat } from '@/components/shared';
import { EmiDonut } from './EmiDonut';
import { PropertyPicker } from './PropertyPicker';

const SECTION = 'emiCalculator';
const RATE_RANGE = { min: 6, max: 14, step: 0.05 };
const TENURE_RANGE = { min: 5, max: 30, step: 1 };

/**
 * R4 — what the loan on a listed property actually costs per month. The maths
 * lives in `lib/emi.ts`; this file only binds it to controls and to a WhatsApp
 * hand-off carrying the exact figures on screen.
 */
export function EmiCalculator() {
  const { realEstate, properties, selectedId, selected, select } = useCalculatorProperty();
  const markUsed = useToolUse(SECTION);
  const { defaultRate, defaultTenure, minDownPct } = realEstate.emi;

  const [downPct, setDownPct] = useState(minDownPct);
  const [rate, setRate] = useState(defaultRate);
  const [tenure, setTenure] = useState(defaultTenure);

  const price = selected?.price ?? 0;
  const downPayment = downPaymentFromPct(price, downPct);
  const principal = loanAmount(price, downPayment);

  const summary = useMemo(
    () => emiSummary({ principal, annualRate: rate, tenureYears: tenure }),
    [principal, rate, tenure],
  );
  const schedule = useMemo(
    () => buildAmortization({ principal, annualRate: rate, tenureYears: tenure }),
    [principal, rate, tenure],
  );

  if (!selected) return null;

  const change = <T,>(setter: (value: T) => void) => (value: T) => {
    markUsed();
    setter(value);
  };

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Home loan"
      title="What will it cost every month?"
      subtitle="Pick a property, set your down payment and see the instalment before you talk to a bank."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="flex flex-col gap-6 surface-card p-5 sm:p-6">
          <PropertyPicker
            properties={properties}
            value={selectedId}
            onChange={change(select)}
            label="Property"
          />

          <CalcSlider
            label="Down payment"
            display={`${formatINRShort(downPayment)} · ${downPct}%`}
            value={downPct}
            min={minDownPct}
            max={90}
            step={1}
            onChange={change(setDownPct)}
            hint={`Loan amount ${formatINR(principal)}`}
          />

          <CalcSlider
            label="Interest rate"
            display={`${rate.toFixed(2)}% p.a.`}
            value={rate}
            min={RATE_RANGE.min}
            max={RATE_RANGE.max}
            step={RATE_RANGE.step}
            onChange={change(setRate)}
          />

          <CalcSlider
            label="Tenure"
            display={`${tenure} years`}
            value={tenure}
            min={TENURE_RANGE.min}
            max={TENURE_RANGE.max}
            step={TENURE_RANGE.step}
            onChange={change(setTenure)}
            hint={`${summary.months} instalments`}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-brand-muted px-5 py-6 text-center">
            <span className="text-caption uppercase tracking-wide text-fg-subtle">
              Monthly EMI
            </span>
            <span className="text-display font-display font-semibold text-fg tabular-nums">
              ₹<NumberTicker key={summary.monthlyEmi} value={Math.round(summary.monthlyEmi)} />
            </span>
            <span className="text-small text-fg-muted">
              on a {formatINRShort(principal)} loan for {tenure} years
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ResultStat label="Total interest" value={formatINRShort(summary.totalInterest)} />
            <ResultStat label="Total payable" value={formatINRShort(summary.totalPayable)} />
          </div>

          <EmiDonut principal={principal} interest={summary.totalInterest} />

          <AmortizationTable rows={schedule} />

          <IntentButton
            intent="quote_request"
            label="Get pre-approved loan help"
            section={SECTION}
            icon={<Landmark className="size-4" aria-hidden />}
            values={[
              ['Property', `${selected.title} (ID: ${selected.id})`],
              ['Property Price', formatINR(price)],
              ['Down Payment', formatINR(downPayment)],
              ['Loan Amount', formatINR(principal)],
              ['Tenure', `${tenure} years @ ${rate.toFixed(2)}%`],
              ['Estimated EMI', `${formatINR(Math.round(summary.monthlyEmi))}/month`],
            ]}
          />

          <DisclaimerNote>
            Indicative only. The actual EMI depends on the lender&apos;s rate, processing fees and
            your credit profile — this is not a loan offer.
          </DisclaimerNote>
        </div>
      </div>
    </SectionShell>
  );
}
