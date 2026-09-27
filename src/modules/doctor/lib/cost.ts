/**
 * Treatment cost arithmetic (PART-07 §5.5). Pure, so the estimator widget is
 * only wiring and the numbers can be asserted in tests.
 */
import type { Treatment } from '../types';

export interface CostEstimate {
  min: number;
  max: number;
  /** The lowest monthly instalment across the offered no-cost EMI tenures. */
  emiFrom: number;
  /** Where the treatment's band sits inside the clinic's own price ladder, 0-100. */
  bandStartPct: number;
  bandWidthPct: number;
}

/**
 * No-cost EMI is exactly that: the principal split across the tenure with no
 * interest added. The longest tenure therefore gives the "from" figure.
 */
export function noCostEmi(amount: number, tenures: number[]): number {
  const longest = Math.max(...tenures.filter((tenure) => tenure > 0), 1);

  return Math.round(amount / longest);
}

/**
 * The band is drawn against the treatment's own min-max, which keeps a ₹1,200
 * cleaning and a ₹4.5L rehab both readable: the bar shows where the likely
 * price sits between them, not where it sits on the clinic's whole price list.
 */
export function estimateCost(
  treatment: Treatment,
  units: number,
  tenures: number[],
): CostEstimate {
  const count = Math.max(1, Math.round(units));
  const min = treatment.min * count;
  const max = treatment.max * count;
  const spread = max - min;
  // The typical quote lands in the middle 60% of the range, not at either edge.
  const bandStartPct = spread === 0 ? 0 : 20;
  const bandWidthPct = spread === 0 ? 100 : 60;

  return {
    min,
    max,
    emiFrom: noCostEmi(min, tenures),
    bandStartPct,
    bandWidthPct,
  };
}
