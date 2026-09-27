/**
 * Home-loan eligibility. Pure — the inverse of `lib/emi.ts`: instead of asking
 * what a loan costs per month, it asks how large a loan a given monthly surplus
 * can carry.
 *
 *   affordable EMI = income × FOIR − existing EMIs
 *   max loan       = EMI × ((1+r)^n − 1) / (r × (1+r)^n)
 *
 * FOIR (fixed-obligation-to-income ratio) is the share of monthly income a
 * lender lets go to instalments — 50% is the usual salaried ceiling.
 */
import { monthlyRate } from './emi';

/** Lenders cap the tenure at the borrower's retirement, and at 30 years. */
export const RETIREMENT_AGE = 60;
export const MAX_TENURE_YEARS = 30;
export const DEFAULT_FOIR_PCT = 50;

export interface EligibilityInput {
  /** Net monthly income in rupees. */
  monthlyIncome: number;
  /** Total of every EMI already running. */
  existingEmis: number;
  /** Borrower's age in years — decides the longest tenure on offer. */
  age: number;
  annualRate: number;
  /** Tenure the borrower asked for; trimmed to what their age allows. */
  tenureYears: number;
  /** Share of income available for instalments. Defaults to 50%. */
  foirPct?: number;
  /** Minimum own contribution, from `module.emi.minDownPct`. */
  minDownPct?: number;
}

export interface EligibilityResult {
  /** Tenure actually used, after the retirement cap. */
  tenureYears: number;
  tenureCapped: boolean;
  foirPct: number;
  /** Income × FOIR, before existing obligations. */
  emiBudget: number;
  /** What is left for a new loan after existing EMIs. */
  affordableEmi: number;
  maxLoan: number;
  /** Loan plus the minimum down payment — the price band to shop in. */
  maxPropertyValue: number;
  downPayment: number;
  eligible: boolean;
}

const round0 = (value: number) => Math.round(value);

/** Longest tenure a lender would sanction at this age. */
export function maxTenureFor(age: number): number {
  const untilRetirement = Math.floor(RETIREMENT_AGE - age);
  return Math.max(0, Math.min(MAX_TENURE_YEARS, untilRetirement));
}

/**
 * Present value of an EMI stream — the standard annuity formula, with the
 * zero-rate case (which would divide by zero) handled separately.
 */
export function loanForEmi(emi: number, annualRate: number, tenureYears: number): number {
  const n = Math.round(tenureYears * 12);
  if (emi <= 0 || n <= 0) return 0;

  const r = monthlyRate(annualRate);
  if (r === 0) return round0(emi * n);

  const growth = Math.pow(1 + r, n);
  return round0((emi * (growth - 1)) / (r * growth));
}

export function calculateEligibility(input: EligibilityInput): EligibilityResult {
  const foirPct = Math.min(100, Math.max(0, input.foirPct ?? DEFAULT_FOIR_PCT));
  const allowed = maxTenureFor(input.age);
  const tenureYears = Math.max(0, Math.min(input.tenureYears, allowed));

  const emiBudget = round0((Math.max(0, input.monthlyIncome) * foirPct) / 100);
  const affordableEmi = Math.max(0, emiBudget - Math.max(0, input.existingEmis));
  const maxLoan = loanForEmi(affordableEmi, input.annualRate, tenureYears);

  // A lender funds at most (100 − minDownPct)% of the price, so the price the
  // borrower can chase is the loan grossed back up by that share.
  const fundedPct = Math.max(1, 100 - Math.min(99, Math.max(0, input.minDownPct ?? 0)));
  const maxPropertyValue = round0((maxLoan * 100) / fundedPct);

  return {
    tenureYears,
    tenureCapped: input.tenureYears > allowed,
    foirPct,
    emiBudget,
    affordableEmi,
    maxLoan,
    maxPropertyValue,
    downPayment: maxPropertyValue - maxLoan,
    eligible: maxLoan > 0,
  };
}
