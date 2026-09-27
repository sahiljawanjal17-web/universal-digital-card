'use client';

import { useMemo, useState } from 'react';
import { BadgeIndianRupee } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { DisclaimerNote, IntentButton } from '@/components/shared';
import { NumberTicker } from '@/components/motion';
import { formatINR, formatINRShort } from '@/lib/utils';
import {
  calculateEligibility,
  DEFAULT_FOIR_PCT,
  maxTenureFor,
  RETIREMENT_AGE,
} from '../lib/eligibility';
import { useCalculatorProperty } from '../hooks/useCalculatorProperty';
import { useToolUse } from '../hooks/useToolUse';
import { CalcNumber, CalcSlider, ResultStat } from '@/components/shared';

const SECTION = 'loanEligibility';

/**
 * R7 — how much a lender would actually sanction. The FOIR ceiling (half of
 * monthly income, minus running EMIs) is what decides it, so the form asks for
 * exactly the three things that move it.
 */
export function LoanEligibility() {
  const { realEstate, properties } = useCalculatorProperty();
  const markUsed = useToolUse(SECTION);
  const { defaultRate, defaultTenure, minDownPct } = realEstate.emi;

  const [monthlyIncome, setMonthlyIncome] = useState(150_000);
  const [existingEmis, setExistingEmis] = useState(0);
  const [age, setAge] = useState(32);
  const [tenure, setTenure] = useState(defaultTenure);

  const result = useMemo(
    () =>
      calculateEligibility({
        monthlyIncome,
        existingEmis,
        age,
        annualRate: defaultRate,
        tenureYears: tenure,
        minDownPct,
      }),
    [monthlyIncome, existingEmis, age, defaultRate, tenure, minDownPct],
  );

  const inBudget = properties.filter(
    (property) => property.price <= result.maxPropertyValue,
  ).length;

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Eligibility"
      title="How much can you borrow?"
      subtitle={`Lenders cap instalments at about ${DEFAULT_FOIR_PCT}% of monthly income. Three inputs and you know your budget before you start looking.`}
      tone="muted"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="flex flex-col gap-6 surface-card p-5 sm:p-6">
          <CalcNumber
            label="Net monthly income"
            value={monthlyIncome}
            min={10_000}
            step={5_000}
            prefix="₹"
            onChange={(next) => {
              markUsed();
              setMonthlyIncome(next);
            }}
          />

          <CalcNumber
            label="Existing EMIs"
            value={existingEmis}
            min={0}
            step={1_000}
            prefix="₹"
            hint="Car, personal or any other running loan"
            onChange={(next) => {
              markUsed();
              setExistingEmis(next);
            }}
          />

          <CalcSlider
            label="Your age"
            display={`${age} years`}
            value={age}
            min={21}
            max={58}
            step={1}
            onChange={(next) => {
              markUsed();
              setAge(next);
            }}
            hint={`Tenure is capped at ${maxTenureFor(age)} years — lenders close the loan by ${RETIREMENT_AGE}`}
          />

          <CalcSlider
            label="Tenure"
            display={`${result.tenureYears} years`}
            value={tenure}
            min={5}
            max={30}
            step={1}
            onChange={(next) => {
              markUsed();
              setTenure(next);
            }}
            hint={result.tenureCapped ? 'Trimmed to what your age allows' : undefined}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-brand-muted px-5 py-6 text-center">
            <span className="text-caption uppercase tracking-wide text-fg-subtle">
              Eligible loan amount
            </span>
            <span className="text-display font-display font-semibold text-fg tabular-nums">
              ₹<NumberTicker key={result.maxLoan} value={result.maxLoan} />
            </span>
            <span className="text-small text-fg-muted">
              at {defaultRate}% for {result.tenureYears} years
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ResultStat label="Affordable EMI" value={formatINR(result.affordableEmi)} />
            <ResultStat
              label="Own contribution"
              value={`${formatINRShort(result.downPayment)} (${minDownPct}%)`}
            />
            <ResultStat
              label="Property budget"
              tone="brand"
              value={formatINRShort(result.maxPropertyValue)}
              className="col-span-2"
            />
          </div>

          <p className="text-body text-fg-muted">
            {result.eligible
              ? `${inBudget} of our ${properties.length} listings fall inside that budget.`
              : 'Your running EMIs use up the whole instalment budget — clear or close one and check again.'}
          </p>

          <IntentButton
            intent="quote_request"
            label="Check my eligibility with a lender"
            section={SECTION}
            icon={<BadgeIndianRupee className="size-4" aria-hidden />}
            values={[
              ['Monthly Income', formatINR(monthlyIncome)],
              ['Existing EMIs', formatINR(existingEmis)],
              ['Age', `${age} years`],
              ['Tenure', `${result.tenureYears} years @ ${defaultRate}%`],
              ['Eligible Loan', formatINR(result.maxLoan)],
              ['Property Budget', formatINR(result.maxPropertyValue)],
            ]}
          />

          <DisclaimerNote>
            Indicative only. Lenders decide on your credit score, employer category, income
            stability and the property&apos;s legal and technical appraisal.
          </DisclaimerNote>
        </div>
      </div>
    </SectionShell>
  );
}
