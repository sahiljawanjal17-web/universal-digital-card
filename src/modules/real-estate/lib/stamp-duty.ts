/**
 * Registration cost math for a property purchase. Pure — no React, no config
 * import: the state rules come in as `StampDutyRules` from `module.stampDuty`
 * so a different state is a data change, never a code change.
 *
 * Maharashtra reference (the shipped rules): 6% stamp duty (5% duty + 1% metro
 * cess), 1% registration capped at ₹30,000, 1 percentage-point rebate when the
 * sole buyer is a woman. GST applies only while a project is under
 * construction — a ready/resale flat carries none.
 */
import type { StampDutyRules } from '../types';

/** Registration fee is 1% *up to a ceiling* — above it the fee stops growing. */
export const REGISTRATION_CAP = 30_000;

/** Under-construction GST: 1% on affordable housing, 5% otherwise. */
export const GST_PCT = { affordable: 1, standard: 5 } as const;

/** Affordable housing (GST notification): carpet ≤ 60 sq.m. and price ≤ ₹45 L. */
export const AFFORDABLE_LIMITS = { carpetSqft: 645, price: 4_500_000 } as const;

export interface StampDutyInput {
  /** Agreement value in rupees. */
  price: number;
  rules: StampDutyRules;
  /** Sole woman buyer — claims `rules.femaleRebatePct` off the duty. */
  femaleBuyer?: boolean;
  /** Under-construction purchases attract GST; ready/resale ones do not. */
  underConstruction?: boolean;
  /** Carpet area in sq.ft., only used to decide the affordable GST slab. */
  carpetArea?: number;
}

export interface StampDutyBreakdown {
  price: number;
  /** Duty percentage actually applied, after any rebate. */
  dutyPct: number;
  stampDuty: number;
  registration: number;
  registrationCapped: boolean;
  gstPct: number;
  gst: number;
  /** Duty + registration + GST — everything on top of the agreement value. */
  charges: number;
  /** Price + charges: what the buyer actually parts with. */
  totalCost: number;
  /** Charges as a share of the price, for the "≈ 7% extra" line. */
  chargesPct: number;
  rebateSaved: number;
}

const round0 = (value: number) => Math.round(value);
const pctOf = (value: number, pct: number) => (value * pct) / 100;

/** Clamps to the 0–100 band so bad data cannot produce a negative duty. */
function clampPct(pct: number): number {
  if (!Number.isFinite(pct)) return 0;
  return Math.min(100, Math.max(0, pct));
}

export function effectiveDutyPct(rules: StampDutyRules, femaleBuyer: boolean): number {
  return clampPct(femaleBuyer ? rules.dutyPct - rules.femaleRebatePct : rules.dutyPct);
}

export function isAffordable(price: number, carpetArea?: number): boolean {
  if (price > AFFORDABLE_LIMITS.price) return false;
  if (carpetArea === undefined) return true;
  return carpetArea <= AFFORDABLE_LIMITS.carpetSqft;
}

export function gstPctFor(input: StampDutyInput): number {
  if (!input.underConstruction) return 0;
  return isAffordable(input.price, input.carpetArea) ? GST_PCT.affordable : GST_PCT.standard;
}

export function registrationFee(price: number, regPct: number): number {
  return Math.min(round0(pctOf(price, clampPct(regPct))), REGISTRATION_CAP);
}

export function calculateStampDuty(input: StampDutyInput): StampDutyBreakdown {
  const price = Math.max(0, input.price);
  const femaleBuyer = input.femaleBuyer ?? false;
  const dutyPct = effectiveDutyPct(input.rules, femaleBuyer);

  const stampDuty = round0(pctOf(price, dutyPct));
  const registration = registrationFee(price, input.rules.regPct);
  const uncapped = round0(pctOf(price, clampPct(input.rules.regPct)));
  const gstPct = gstPctFor({ ...input, price });
  const gst = round0(pctOf(price, gstPct));

  const charges = stampDuty + registration + gst;
  const fullDuty = round0(pctOf(price, clampPct(input.rules.dutyPct)));

  return {
    price,
    dutyPct,
    stampDuty,
    registration,
    registrationCapped: uncapped > REGISTRATION_CAP,
    gstPct,
    gst,
    charges,
    totalCost: price + charges,
    chargesPct: price > 0 ? Math.round((charges / price) * 1000) / 10 : 0,
    rebateSaved: fullDuty - stampDuty,
  };
}
