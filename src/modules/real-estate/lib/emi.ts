/**
 * Home-loan math. Pure — no React, no formatting, no config. Rupee amounts are
 * returned unrounded-but-safe (2 dp) so the UI decides presentation.
 *
 *   EMI = P × r × (1+r)^n / ((1+r)^n − 1)
 *   r   = annualRate / 12 / 100        n = tenureYears × 12
 *
 * Reusable beyond this role — if a second role needs it, promote to
 * `src/lib/finance/emi.ts` (see PART-05 §9).
 */

export interface EmiInput {
  /** Loan principal in rupees (property price − down payment). */
  principal: number;
  /** Annual interest rate as a percentage, e.g. `8.5`. */
  annualRate: number;
  tenureYears: number;
}

export interface EmiSummary extends EmiInput {
  monthlyEmi: number;
  totalPayable: number;
  totalInterest: number;
  months: number;
}

export interface AmortizationYear {
  year: number;
  principalPaid: number;
  interestPaid: number;
  /** Outstanding principal at the end of the year. */
  balance: number;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

export function monthlyRate(annualRate: number): number {
  return annualRate / 12 / 100;
}

/** Zero-interest loans divide evenly — the standard formula divides by zero. */
export function calculateEmi({ principal, annualRate, tenureYears }: EmiInput): number {
  const n = Math.round(tenureYears * 12);
  if (principal <= 0 || n <= 0) return 0;

  const r = monthlyRate(annualRate);
  if (r === 0) return round2(principal / n);

  const growth = Math.pow(1 + r, n);
  return round2((principal * r * growth) / (growth - 1));
}

export function emiSummary(input: EmiInput): EmiSummary {
  const months = Math.round(input.tenureYears * 12);
  const monthlyEmi = calculateEmi(input);
  const totalPayable = round2(monthlyEmi * months);

  return {
    ...input,
    months,
    monthlyEmi,
    totalPayable,
    totalInterest: round2(Math.max(0, totalPayable - input.principal)),
  };
}

/**
 * Year-wise principal/interest split, simulated month by month so the closing
 * balance matches what a bank statement would show.
 */
export function buildAmortization(input: EmiInput): AmortizationYear[] {
  const { principal, annualRate, tenureYears } = input;
  const months = Math.round(tenureYears * 12);
  if (principal <= 0 || months <= 0) return [];

  const emi = calculateEmi(input);
  const r = monthlyRate(annualRate);
  const years: AmortizationYear[] = [];

  let balance = principal;

  for (let year = 1; year <= Math.ceil(months / 12); year += 1) {
    let principalPaid = 0;
    let interestPaid = 0;
    const lastMonth = Math.min(year * 12, months);

    for (let month = (year - 1) * 12 + 1; month <= lastMonth; month += 1) {
      const interest = balance * r;
      // The closing instalment settles whatever the rounded EMI left behind,
      // exactly as a lender's foreclosure statement does.
      const towardsPrincipal =
        month === months ? balance : Math.min(emi - interest, balance);
      interestPaid += interest;
      principalPaid += towardsPrincipal;
      balance = Math.max(0, balance - towardsPrincipal);
    }

    years.push({
      year,
      principalPaid: round2(principalPaid),
      interestPaid: round2(interestPaid),
      balance: round2(balance),
    });
  }

  return years;
}

/** Down payment helpers — the calculator drives both from one slider. */
export function downPaymentFromPct(price: number, pct: number): number {
  return Math.round((price * pct) / 100);
}

export function loanAmount(price: number, downPayment: number): number {
  return Math.max(0, price - downPayment);
}
