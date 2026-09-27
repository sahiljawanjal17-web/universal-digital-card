'use client';

import { useMemo, useState } from 'react';
import { Scale } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { DisclaimerNote, IntentButton } from '@/components/shared';
import { formatINR, formatINRShort } from '@/lib/utils';
import { downPaymentFromPct, loanAmount } from '../lib/emi';
import { projectRentVsBuy, DEFAULT_HORIZON_YEARS } from '../lib/rent-vs-buy';
import { calculateStampDuty } from '../lib/stamp-duty';
import { useCalculatorProperty } from '../hooks/useCalculatorProperty';
import { useToolUse } from '../hooks/useToolUse';
import { CalcSlider, ResultStat } from '@/components/shared';
import { PropertyPicker } from './PropertyPicker';
import { RentVsBuyChart } from './RentVsBuyChart';

const SECTION = 'rentVsBuy';
/** Rent on a comparable home, as a share of its price per year — the "rental yield". */
const RENTAL_YIELD_PCT = 3;
const MAINTENANCE_PCT = 0.75;

/**
 * R6 — renting is not throwing money away and buying is not automatically
 * winning; the crossover depends on appreciation, rent inflation and what the
 * down payment would have earned elsewhere. All three are the visitor's to set.
 */
export function RentVsBuy() {
  const { realEstate, properties, selectedId, selected, select } = useCalculatorProperty();
  const markUsed = useToolUse(SECTION);
  const { defaultRate, defaultTenure, minDownPct } = realEstate.emi;

  const price = selected?.price ?? 0;
  const [downPct, setDownPct] = useState(Math.max(minDownPct, 20));
  const [rentHike, setRentHike] = useState(7);
  const [appreciation, setAppreciation] = useState(6);
  const [investmentReturn, setInvestmentReturn] = useState(9);
  const [monthlyRent, setMonthlyRent] = useState<number | null>(null);

  const suggestedRent = Math.round((price * RENTAL_YIELD_PCT) / 100 / 12 / 1000) * 1000;
  const rent = monthlyRent ?? suggestedRent;
  const downPayment = downPaymentFromPct(price, downPct);

  const upfrontCharges = useMemo(
    () => calculateStampDuty({ price, rules: realEstate.stampDuty }).charges,
    [price, realEstate.stampDuty],
  );

  const projection = useMemo(
    () =>
      projectRentVsBuy({
        price,
        downPayment,
        upfrontCharges,
        annualRate: defaultRate,
        tenureYears: defaultTenure,
        monthlyRent: rent,
        rentHikePct: rentHike,
        appreciationPct: appreciation,
        investmentReturnPct: investmentReturn,
        maintenancePct: MAINTENANCE_PCT,
      }),
    [
      price,
      downPayment,
      upfrontCharges,
      defaultRate,
      defaultTenure,
      rent,
      rentHike,
      appreciation,
      investmentReturn,
    ],
  );

  if (!selected) return null;

  const verdict =
    projection.breakevenYear === null
      ? `Renting stays cheaper for all ${DEFAULT_HORIZON_YEARS} years at these numbers.`
      : `Buying pulls ahead in year ${projection.breakevenYear}.`;

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Rent vs buy"
      title="Does buying beat renting?"
      subtitle={`A ${DEFAULT_HORIZON_YEARS}-year comparison of what each option really costs, after the loan, the upkeep and what your down payment could have earned instead.`}
    >
      <div className="grid gap-8 lg:grid-cols-[19rem_1fr] lg:gap-10">
        <div className="flex flex-col gap-6 surface-card p-5 sm:p-6">
          <PropertyPicker
            properties={properties}
            value={selectedId}
            onChange={(id) => {
              markUsed();
              select(id);
              setMonthlyRent(null);
            }}
          />

          <CalcSlider
            label="Down payment"
            display={`${formatINRShort(downPayment)} · ${downPct}%`}
            value={downPct}
            min={minDownPct}
            max={60}
            step={1}
            onChange={(next) => {
              markUsed();
              setDownPct(next);
            }}
            hint={`Loan ${formatINRShort(loanAmount(price, downPayment))} @ ${defaultRate}% for ${defaultTenure} years`}
          />

          <CalcSlider
            label="Monthly rent"
            display={formatINR(rent)}
            value={rent}
            min={5000}
            max={Math.max(20000, Math.round((price * 8) / 100 / 12))}
            step={1000}
            onChange={(next) => {
              markUsed();
              setMonthlyRent(next);
            }}
            hint="For a comparable home in the same locality"
          />

          <CalcSlider
            label="Rent increase / year"
            display={`${rentHike}%`}
            value={rentHike}
            min={0}
            max={15}
            step={1}
            onChange={(next) => {
              markUsed();
              setRentHike(next);
            }}
          />

          <CalcSlider
            label="Property appreciation / year"
            display={`${appreciation}%`}
            value={appreciation}
            min={0}
            max={15}
            step={1}
            onChange={(next) => {
              markUsed();
              setAppreciation(next);
            }}
          />

          <CalcSlider
            label="Return if invested instead"
            display={`${investmentReturn}%`}
            value={investmentReturn}
            min={0}
            max={18}
            step={1}
            onChange={(next) => {
              markUsed();
              setInvestmentReturn(next);
            }}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <ResultStat
              label="Breakeven"
              tone="brand"
              value={projection.breakevenYear ? `Year ${projection.breakevenYear}` : 'Beyond 10 yrs'}
            />
            <ResultStat
              label={`Buying, ${DEFAULT_HORIZON_YEARS}-yr net cost`}
              value={formatINRShort(projection.rows[DEFAULT_HORIZON_YEARS - 1].buyCost)}
            />
            <ResultStat
              label={`Renting, ${DEFAULT_HORIZON_YEARS}-yr net cost`}
              value={formatINRShort(projection.rows[DEFAULT_HORIZON_YEARS - 1].rentCost)}
            />
          </div>

          <div className="surface-card p-4 sm:p-5">
            <p className="mb-3 text-body font-medium text-fg">{verdict}</p>
            <RentVsBuyChart rows={projection.rows} breakevenYear={projection.breakevenYear} />
          </div>

          <IntentButton
            intent="quote_request"
            label="Talk this through with me"
            section={SECTION}
            icon={<Scale className="size-4" aria-hidden />}
            values={[
              ['Property', `${selected.title} (ID: ${selected.id})`],
              ['Price', formatINR(price)],
              ['Down Payment', `${formatINR(downPayment)} (${downPct}%)`],
              ['Comparable Rent', `${formatINR(rent)}/month`],
              ['Assumptions', `${appreciation}% appreciation · ${rentHike}% rent hike · ${investmentReturn}% returns`],
              ['Breakeven', projection.breakevenYear ? `Year ${projection.breakevenYear}` : `Beyond ${DEFAULT_HORIZON_YEARS} years`],
            ]}
          />

          <DisclaimerNote>
            A projection, not a forecast. Net cost counts money paid out minus the asset held —
            property value, rent and market returns all move differently in real life.
          </DisclaimerNote>
        </div>
      </div>
    </SectionShell>
  );
}
