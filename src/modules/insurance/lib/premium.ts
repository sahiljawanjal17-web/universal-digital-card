/**
 * Indicative premium maths (PART-06 §5.1). Pure — the widget and the tests
 * both call it. Rates come from `module.estimator.rateTable`, never from here.
 */
import type { EstimatorConfig, InsuranceProduct } from '../types';

export type Gender = 'male' | 'female';

export interface PremiumInput {
  product: InsuranceProduct;
  age: number;
  cover: number;
  tenure: number;
  smoker: boolean;
  gender: Gender;
}

export interface PremiumEstimate {
  /** Premium before GST, per year. */
  base: number;
  gst: number;
  /** Base + GST, per year — what the customer actually pays. */
  annual: number;
  monthly: number;
  perDay: number;
  totalPaid: number;
  /** Rate-table key that matched the age, e.g. `"31-40"`. */
  bandUsed: string;
  /** Loading keys applied, e.g. `["smoker"]`. */
  loadingsApplied: string[];
}

/** Parses an age-band key such as `"18-30"`; `null` for anything else. */
export function parseBand(key: string): [number, number] | null {
  const match = /^(\d+)\s*-\s*(\d+)$/.exec(key.trim());
  if (!match) return null;
  const low = Number(match[1]);
  const high = Number(match[2]);
  return low <= high ? [low, high] : null;
}

/** Products that can actually be priced — the ones with a rate table. */
export function pricedProducts(
  products: readonly InsuranceProduct[],
  estimator: EstimatorConfig,
): InsuranceProduct[] {
  return products.filter((product) => Object.keys(estimator.rateTable[product] ?? {}).length > 0);
}

export function findBand(
  table: Record<string, number>,
  age: number,
): { key: string; rate: number } | null {
  for (const [key, rate] of Object.entries(table)) {
    const band = parseBand(key);
    if (band && age >= band[0] && age <= band[1]) return { key, rate };
  }
  return null;
}

/**
 * `null` when the product has no rate table or the age falls outside every
 * band — the widget then hides the result instead of inventing a number.
 */
export function estimatePremium(
  input: PremiumInput,
  estimator: EstimatorConfig,
): PremiumEstimate | null {
  const table = estimator.rateTable[input.product];
  if (!table || input.cover <= 0 || input.tenure <= 0) return null;
  const band = findBand(table, input.age);
  if (!band) return null;

  const loadingsApplied: string[] = [];
  let multiplier = 1;
  const flags: Record<string, boolean> = {
    smoker: input.smoker,
    female: input.gender === 'female',
  };
  for (const [key, active] of Object.entries(flags)) {
    const loading = estimator.loadings[key];
    if (active && loading) {
      multiplier *= loading;
      loadingsApplied.push(key);
    }
  }

  const base = Math.round(input.cover * band.rate * multiplier);
  const gst = Math.round(base * estimator.gstRate);
  const annual = base + gst;

  return {
    base,
    gst,
    annual,
    monthly: Math.round(annual / 12),
    perDay: Math.round(annual / 365),
    totalPaid: annual * input.tenure,
    bandUsed: band.key,
    loadingsApplied,
  };
}
