'use client';

import { useId, useMemo, useState } from 'react';
import { ReceiptIndianRupee } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { DisclaimerNote, IntentButton } from '@/components/shared';
import { Checkbox } from '@/components/ui/checkbox';
import { formatINR, formatINRShort } from '@/lib/utils';
import { calculateStampDuty, REGISTRATION_CAP } from '../lib/stamp-duty';
import { useCalculatorProperty } from '../hooks/useCalculatorProperty';
import { useToolUse } from '../hooks/useToolUse';
import { ResultRow, ResultStat } from '@/components/shared';
import { PropertyPicker } from './PropertyPicker';

const SECTION = 'stampDuty';

/**
 * R5 — the bill on top of the sticker price. Rules (duty, registration and the
 * women's rebate) come from `module.stampDuty`, so a different state is a data
 * edit rather than a code change.
 */
export function StampDutyEstimator() {
  const { realEstate, properties, selectedId, selected, select } = useCalculatorProperty();
  const markUsed = useToolUse(SECTION);
  const rules = realEstate.stampDuty;

  const [femaleBuyer, setFemaleBuyer] = useState(false);
  const [underConstruction, setUnderConstruction] = useState(false);

  const price = selected?.price ?? 0;
  const carpetArea = selected?.carpetArea;

  const breakdown = useMemo(
    () => calculateStampDuty({ price, rules, femaleBuyer, underConstruction, carpetArea }),
    [price, rules, femaleBuyer, underConstruction, carpetArea],
  );

  if (!selected) return null;

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow={`${rules.state} rates`}
      title="The cost after the cost"
      subtitle="Stamp duty, registration and GST decide what you actually write cheques for. Here is the full number."
      tone="muted"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="flex flex-col gap-6 surface-card p-5 sm:p-6">
          <PropertyPicker
            properties={properties}
            value={selectedId}
            onChange={(id) => {
              markUsed();
              select(id);
            }}
          />

          <ToggleRow
            label="Sole woman buyer"
            hint={`${rules.femaleRebatePct}% lower stamp duty in ${rules.state}`}
            checked={femaleBuyer}
            onChange={(next) => {
              markUsed();
              setFemaleBuyer(next);
            }}
          />

          <ToggleRow
            label="Under-construction property"
            hint="GST applies only until the completion certificate"
            checked={underConstruction}
            onChange={(next) => {
              markUsed();
              setUnderConstruction(next);
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            <ResultStat label="Agreement value" value={formatINRShort(price)} />
            <ResultStat
              label="Charges"
              value={`${formatINRShort(breakdown.charges)} · ${breakdown.chargesPct}%`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="surface-card p-5 sm:p-6">
            <ResultRow
              label={`Stamp duty @ ${breakdown.dutyPct}%`}
              hint={
                breakdown.rebateSaved > 0
                  ? `${formatINRShort(breakdown.rebateSaved)} saved on the women's rebate`
                  : undefined
              }
              value={formatINR(breakdown.stampDuty)}
            />
            <ResultRow
              label={`Registration @ ${rules.regPct}%`}
              hint={
                breakdown.registrationCapped
                  ? `Capped at ${formatINR(REGISTRATION_CAP)}`
                  : undefined
              }
              value={formatINR(breakdown.registration)}
            />
            <ResultRow
              label={breakdown.gstPct > 0 ? `GST @ ${breakdown.gstPct}%` : 'GST'}
              hint={breakdown.gstPct === 0 ? 'Not applicable on a ready property' : undefined}
              value={formatINR(breakdown.gst)}
            />
            <ResultRow label="Agreement value" value={formatINR(breakdown.price)} />
            <ResultRow label="Total cost of ownership" value={formatINR(breakdown.totalCost)} strong />
          </div>

          <IntentButton
            intent="quote_request"
            label="Get the exact registration quote"
            section={SECTION}
            icon={<ReceiptIndianRupee className="size-4" aria-hidden />}
            values={[
              ['Property', `${selected.title} (ID: ${selected.id})`],
              ['Agreement Value', formatINR(breakdown.price)],
              ['Stamp Duty', `${formatINR(breakdown.stampDuty)} @ ${breakdown.dutyPct}%`],
              ['Registration', formatINR(breakdown.registration)],
              ['GST', breakdown.gstPct > 0 ? `${formatINR(breakdown.gst)} @ ${breakdown.gstPct}%` : 'Not applicable'],
              ['Total Cost', formatINR(breakdown.totalCost)],
            ]}
          />

          <DisclaimerNote>
            Indicative {rules.state} rates. Local body tax, society transfer charges and legal fees
            are extra, and the ready reckoner value applies if it is higher than the agreement value.
          </DisclaimerNote>
        </div>
      </div>
    </SectionShell>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  const id = useId();

  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onChange(value === true)}
        className="mt-1"
      />
      <label htmlFor={id} className="flex flex-col gap-0.5">
        <span className="text-body font-medium text-fg">{label}</span>
        <span className="text-caption text-fg-subtle">{hint}</span>
      </label>
    </div>
  );
}
