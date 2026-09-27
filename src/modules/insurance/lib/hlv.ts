/**
 * Human life value by the income-replacement method (PART-06 §5.3): the
 * present value of the income the family would lose, plus outstanding
 * liabilities, minus cover already in force. Pure.
 */
import type { HlvConfig } from '../types';

export interface HlvInput {
  annualIncome: number;
  age: number;
  retirementAge: number;
  liabilities: number;
  existingCover: number;
}

export interface HlvResult {
  workingYears: number;
  /** Present value of the family's share of future income. */
  incomeValue: number;
  recommended: number;
  existing: number;
  /** Zero when the existing cover already meets the recommendation. */
  gap: number;
}

const LAKH = 100_000;

/** Present value of ₹1 a year for `years` years at `rate`. */
export function annuityFactor(rate: number, years: number): number {
  if (years <= 0) return 0;
  if (rate === 0) return years;
  return (1 - (1 + rate) ** -years) / rate;
}

/** Recommendations are rounded up to the next lakh — nobody buys ₹1,73,41,562 of cover. */
export function roundUpToLakh(amount: number): number {
  return Math.ceil(amount / LAKH) * LAKH;
}

export function calculateHlv(input: HlvInput, config: HlvConfig): HlvResult {
  const workingYears = Math.max(0, input.retirementAge - input.age);
  const familyShare = Math.max(0, input.annualIncome) * (1 - config.selfExpenseRatio);
  const incomeValue = Math.round(familyShare * annuityFactor(config.discountRate, workingYears));
  const recommended = roundUpToLakh(incomeValue + Math.max(0, input.liabilities));
  const existing = Math.max(0, input.existingCover);

  return {
    workingYears,
    incomeValue,
    recommended,
    existing,
    gap: Math.max(0, recommended - existing),
  };
}
