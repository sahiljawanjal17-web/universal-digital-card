'use client';

import { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { CalcNumber, CalcSlider, DisclaimerNote, IntentButton, ResultRow } from '@/components/shared';
import { NumberTicker } from '@/components/motion';
import { track, EVENTS } from '@/core/analytics';
import { cn, formatINR, formatINRShort } from '@/lib/utils';
import { useInsuranceModule } from '../hooks/useInsuranceModule';
import { estimatePremium, pricedProducts, type Gender, type PremiumInput } from '../lib/premium';
import { premiumFields, productLabel } from '../lib/wa-templates';
import type { InsuranceProduct } from '../types';

const SECTION = 'premiumEstimator';

/** Segmented control — one pill group per yes/no style choice. */
function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: [T, string][];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption font-medium uppercase tracking-wide text-fg-subtle">{label}</span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map(([key, text]) => (
          <button
            key={key}
            type="button"
            aria-pressed={value === key}
            onClick={() => onChange(key)}
            className={cn(
              'h-10 rounded-full border px-4 text-small font-medium transition-colors',
              value === key
                ? 'border-brand bg-brand text-brand-fg'
                : 'border-border bg-surface text-fg hover:border-brand',
            )}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * I1 / I2 — the hero widget. Every range, cover chip, rate and loading comes
 * from `module.estimator`; the arithmetic is `lib/premium.ts`.
 */
export function PremiumEstimator() {
  const { module } = useInsuranceModule();
  const { estimator } = module;
  const products = pricedProducts(module.products, estimator);
  const [ageMin, ageMax] = estimator.ageRange;
  const [tenureMin, tenureMax] = estimator.tenureRange;
  const covers = estimator.coverOptions;

  const [product, setProduct] = useState<InsuranceProduct>(products[0] ?? 'term');
  const [age, setAge] = useState(Math.min(ageMax, Math.max(ageMin, 30)));
  const [cover, setCover] = useState(covers[Math.floor(covers.length / 2)] ?? covers[0] ?? 0);
  const [customCover, setCustomCover] = useState(false);
  const [tenure, setTenure] = useState(Math.min(tenureMax, Math.max(tenureMin, 30)));
  const [smoker, setSmoker] = useState(false);
  const [gender, setGender] = useState<Gender>('male');

  const input: PremiumInput = { product, age, cover, tenure, smoker, gender };
  const quote = useMemo(
    () => estimatePremium({ product, age, cover, tenure, smoker, gender }, estimator),
    [product, age, cover, tenure, smoker, gender, estimator],
  );

  if (products.length === 0) return null;

  const used = () => track(EVENTS.TOOL_USE, { tool: SECTION, product });

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Premium estimator"
      title="What does protection cost you?"
      subtitle="Move the sliders — see an indicative premium instantly, then get exact quotes on WhatsApp."
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="surface-card flex flex-col gap-6 p-5 sm:p-6">
          {products.length > 1 ? (
            <Segmented
              label="Product"
              options={products.map((key) => [key, productLabel(key)])}
              value={product}
              onChange={(next) => {
                setProduct(next);
                used();
              }}
            />
          ) : null}

          <CalcSlider
            label="Your age"
            display={`${age} years`}
            value={age}
            min={ageMin}
            max={ageMax}
            step={1}
            onChange={setAge}
            onCommit={used}
          />

          <div className="flex flex-col gap-2">
            <span className="text-caption font-medium uppercase tracking-wide text-fg-subtle">
              Life cover
            </span>
            <div className="flex flex-wrap gap-2">
              {covers.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={!customCover && cover === option}
                  onClick={() => {
                    setCover(option);
                    setCustomCover(false);
                    used();
                  }}
                  className={cn(
                    'h-10 rounded-full border px-4 text-small font-medium tabular-nums transition-colors',
                    !customCover && cover === option
                      ? 'border-brand bg-brand text-brand-fg'
                      : 'border-border bg-surface text-fg hover:border-brand',
                  )}
                >
                  {formatINRShort(option)}
                </button>
              ))}
              <button
                type="button"
                aria-pressed={customCover}
                onClick={() => setCustomCover(true)}
                className={cn(
                  'h-10 rounded-full border px-4 text-small font-medium transition-colors',
                  customCover
                    ? 'border-brand bg-brand text-brand-fg'
                    : 'border-border bg-surface text-fg hover:border-brand',
                )}
              >
                Custom
              </button>
            </div>
            {customCover ? (
              <CalcNumber
                label="Custom cover"
                value={cover}
                onChange={setCover}
                min={0}
                step={100_000}
                prefix="₹"
              />
            ) : null}
          </div>

          <CalcSlider
            label="Policy term"
            display={`${tenure} years`}
            value={tenure}
            min={tenureMin}
            max={tenureMax}
            step={1}
            onChange={setTenure}
            onCommit={used}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Segmented
              label="Tobacco / smoking"
              options={[
                ['no', 'No'],
                ['yes', 'Yes'],
              ]}
              value={smoker ? 'yes' : 'no'}
              onChange={(next) => setSmoker(next === 'yes')}
            />
            <Segmented
              label="Gender"
              options={[
                ['male', 'Male'],
                ['female', 'Female'],
              ]}
              value={gender}
              onChange={setGender}
            />
          </div>
        </div>

        <div className="surface-card flex flex-col gap-5 p-5 sm:p-6 lg:sticky lg:top-24">
          {quote ? (
            <>
              <div>
                <p className="text-caption uppercase tracking-wide text-fg-subtle">
                  Estimated premium
                </p>
                <p className="text-h2 font-display text-fg tabular-nums">
                  ₹<NumberTicker value={quote.monthly} />
                  <span className="text-body font-sans text-fg-muted">/month</span>
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-small font-medium text-brand">
                  <ShieldCheck className="size-4" aria-hidden />
                  Just {formatINR(quote.perDay)}/day for {formatINRShort(cover)} cover
                </p>
              </div>

              <div className="flex flex-col">
                <ResultRow label="Base premium / year" value={formatINR(quote.base)} />
                <ResultRow
                  label={`GST (${Math.round(estimator.gstRate * 100)}%)`}
                  value={formatINR(quote.gst)}
                />
                <ResultRow label="You pay / year" value={formatINR(quote.annual)} strong />
                <ResultRow
                  label={`Total over ${tenure} years`}
                  value={formatINR(quote.totalPaid)}
                  hint={`Age band ${quote.bandUsed}`}
                />
              </div>

              <IntentButton
                intent="premium_quote"
                label="Get Exact Quote on WhatsApp"
                section={SECTION}
                values={premiumFields(input, quote)}
                className="w-full"
              />
            </>
          ) : (
            <p className="text-body text-fg-muted">
              Enter a cover amount to see an indicative premium.
            </p>
          )}

          <DisclaimerNote>
            Indicative rates for illustration only — not an offer from any insurer. Final
            premium depends on medicals, underwriting and the insurer&apos;s current rate card.
          </DisclaimerNote>
        </div>
      </div>

      {quote ? (
        <div className="sticky bottom-3 z-10 mx-auto mt-4 flex max-w-5xl items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-lg lg:hidden">
          <span className="text-small text-fg-muted">
            <span className="text-body-lg font-semibold text-fg tabular-nums">
              {formatINR(quote.monthly)}
            </span>
            /month
          </span>
          <span className="text-small font-medium text-brand">{formatINR(quote.perDay)}/day</span>
        </div>
      ) : null}
    </SectionShell>
  );
}
