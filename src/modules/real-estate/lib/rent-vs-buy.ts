/**
 * Rent-vs-buy projection. Pure — no React, no config.
 *
 * Both sides are scored the same way, as *net cost*: everything paid out, minus
 * the asset still held at the end of the year.
 *
 *   buying  → down payment + charges + EMIs + upkeep − (market value − loan left)
 *   renting → rent paid − returns earned on the money not locked into a house
 *
 * The renter is assumed to invest the buyer's down payment and charges on day
 * one, and to keep investing whatever the buyer's monthly outgo exceeds their
 * rent. Without that the comparison flatters buying.
 */
import { calculateEmi, monthlyRate } from './emi';

export const DEFAULT_HORIZON_YEARS = 10;

export interface RentVsBuyInput {
  price: number;
  downPayment: number;
  /** Stamp duty + registration + GST, paid once at purchase. */
  upfrontCharges: number;
  annualRate: number;
  tenureYears: number;
  /** Starting monthly rent for a comparable home. */
  monthlyRent: number;
  /** Yearly rent escalation, e.g. `7`. */
  rentHikePct: number;
  /** Yearly property appreciation, e.g. `6`. */
  appreciationPct: number;
  /** What the renter's spare capital earns instead, e.g. `9`. */
  investmentReturnPct: number;
  /** Yearly upkeep (maintenance, tax, repairs) as a share of price, e.g. `0.75`. */
  maintenancePct: number;
  /** Projection length; defaults to 10 years. */
  years?: number;
}

export interface ProjectionYear {
  year: number;
  /** Net cost of owning by the end of this year. */
  buyCost: number;
  /** Net cost of renting by the end of this year. */
  rentCost: number;
  propertyValue: number;
  outstandingLoan: number;
  equity: number;
  cumulativeRent: number;
  cumulativeEmi: number;
  portfolio: number;
}

export interface RentVsBuyResult {
  rows: ProjectionYear[];
  monthlyEmi: number;
  /** First year owning costs less than renting — `null` if it never does. */
  breakevenYear: number | null;
  /** Gap at the end of the horizon: positive means buying came out ahead. */
  advantageAtHorizon: number;
  verdict: 'buy' | 'rent';
}

const round0 = (value: number) => Math.round(value);

/** Loan outstanding after `months` instalments — closed form, no simulation. */
export function outstandingAfter(
  principal: number,
  annualRate: number,
  tenureYears: number,
  months: number,
): number {
  const total = Math.round(tenureYears * 12);
  const m = Math.min(Math.max(0, months), total);
  if (principal <= 0 || total <= 0) return 0;

  const r = monthlyRate(annualRate);
  const emi = calculateEmi({ principal, annualRate, tenureYears });
  if (r === 0) return Math.max(0, principal - emi * m);

  const growth = Math.pow(1 + r, m);
  return Math.max(0, principal * growth - emi * ((growth - 1) / r));
}

export function projectRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const years = Math.max(1, Math.round(input.years ?? DEFAULT_HORIZON_YEARS));
  const price = Math.max(0, input.price);
  const downPayment = Math.min(Math.max(0, input.downPayment), price);
  const principal = price - downPayment;
  const monthlyEmi = calculateEmi({
    principal,
    annualRate: input.annualRate,
    tenureYears: input.tenureYears,
  });

  const returnRate = input.investmentReturnPct / 100;
  const rows: ProjectionYear[] = [];

  let cumulativeEmi = 0;
  let cumulativeRent = 0;
  let cumulativeUpkeep = 0;
  // The renter starts by investing what the buyer sank into the purchase.
  let portfolio = downPayment + input.upfrontCharges;
  let invested = portfolio;

  for (let year = 1; year <= years; year += 1) {
    const monthsPaid = Math.min(year * 12, Math.round(input.tenureYears * 12));
    const emiThisYear = monthlyEmi * Math.max(0, monthsPaid - (year - 1) * 12);
    const rentThisYear =
      input.monthlyRent * 12 * Math.pow(1 + input.rentHikePct / 100, year - 1);
    const upkeepThisYear = (price * input.maintenancePct) / 100;

    cumulativeEmi += emiThisYear;
    cumulativeRent += rentThisYear;
    cumulativeUpkeep += upkeepThisYear;

    // A year's growth, then the year's surplus goes in (a shortfall comes out).
    portfolio *= 1 + returnRate;
    const surplus = emiThisYear + upkeepThisYear - rentThisYear;
    portfolio = Math.max(0, portfolio + surplus);
    invested += surplus;

    const propertyValue = price * Math.pow(1 + input.appreciationPct / 100, year);
    const outstandingLoan = outstandingAfter(
      principal,
      input.annualRate,
      input.tenureYears,
      monthsPaid,
    );
    const equity = propertyValue - outstandingLoan;

    rows.push({
      year,
      buyCost: round0(downPayment + input.upfrontCharges + cumulativeEmi + cumulativeUpkeep - equity),
      rentCost: round0(cumulativeRent + invested - portfolio),
      propertyValue: round0(propertyValue),
      outstandingLoan: round0(outstandingLoan),
      equity: round0(equity),
      cumulativeRent: round0(cumulativeRent),
      cumulativeEmi: round0(cumulativeEmi),
      portfolio: round0(portfolio),
    });
  }

  const breakeven = rows.find((row) => row.buyCost <= row.rentCost);
  const last = rows[rows.length - 1];

  return {
    rows,
    monthlyEmi,
    breakevenYear: breakeven ? breakeven.year : null,
    advantageAtHorizon: last.rentCost - last.buyCost,
    verdict: last.buyCost <= last.rentCost ? 'buy' : 'rent',
  };
}
