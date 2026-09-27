/**
 * PART-05 chunk 2 calculators. Every number here is checked against the rule it
 * encodes (Maharashtra duty table, FOIR, the annuity identity) rather than
 * against a previous run, so a wrong refactor fails instead of re-baselining.
 */
import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { calculateStampDuty, registrationFee, effectiveDutyPct, REGISTRATION_CAP } from './stamp-duty';
import { calculateEligibility, loanForEmi, maxTenureFor } from './eligibility';
import { projectRentVsBuy, outstandingAfter } from './rent-vs-buy';
import { calculateEmi } from './emi';
import type { RealEstateModule } from '../types';

const dataPath = path.resolve(process.cwd(), 'src/data/roles/real-estate.json');
const realEstate = (
  JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as { module: RealEstateModule }
).module;
const rules = realEstate.stampDuty;

describe('stamp duty', () => {
  test('Maharashtra: 6% duty, registration capped at 30k, no GST on ready homes', () => {
    const result = calculateStampDuty({ price: 10_000_000, rules });

    assert.strictEqual(result.stampDuty, 600_000);
    assert.strictEqual(result.registration, REGISTRATION_CAP);
    assert.ok(result.registrationCapped);
    assert.strictEqual(result.gst, 0);
    assert.strictEqual(result.totalCost, 10_630_000);
    assert.strictEqual(result.chargesPct, 6.3);
  });

  test('female buyer claims the rebate', () => {
    const result = calculateStampDuty({ price: 10_000_000, rules, femaleBuyer: true });

    assert.strictEqual(result.dutyPct, rules.dutyPct - rules.femaleRebatePct);
    assert.strictEqual(result.stampDuty, 500_000);
    assert.strictEqual(result.rebateSaved, 100_000);
    assert.strictEqual(effectiveDutyPct(rules, false), rules.dutyPct);
  });

  test('GST only under construction, 1% on the affordable slab', () => {
    const luxury = calculateStampDuty({
      price: 10_000_000,
      rules,
      underConstruction: true,
      carpetArea: 1200,
    });
    const affordable = calculateStampDuty({
      price: 4_000_000,
      rules,
      underConstruction: true,
      carpetArea: 600,
    });

    assert.strictEqual(luxury.gstPct, 5);
    assert.strictEqual(luxury.gst, 500_000);
    assert.strictEqual(affordable.gstPct, 1);
    assert.strictEqual(affordable.gst, 40_000);
    assert.strictEqual(registrationFee(2_000_000, 1), 20_000);
  });
});

describe('loan eligibility', () => {
  test('tenure is capped by retirement and by 30 years', () => {
    assert.strictEqual(maxTenureFor(35), 25);
    assert.strictEqual(maxTenureFor(25), 30);
    assert.strictEqual(maxTenureFor(58), 2);
  });

  test('FOIR headroom inverts the EMI formula', () => {
    const result = calculateEligibility({
      monthlyIncome: 150_000,
      existingEmis: 20_000,
      age: 32,
      annualRate: 8.5,
      tenureYears: 20,
      minDownPct: realEstate.emi.minDownPct,
    });

    assert.strictEqual(result.emiBudget, 75_000);
    assert.strictEqual(result.affordableEmi, 55_000);

    // The EMI on the sanctioned loan must come back to the affordable EMI.
    const emi = calculateEmi({ principal: result.maxLoan, annualRate: 8.5, tenureYears: 20 });
    assert.ok(Math.abs(emi - result.affordableEmi) < 2);
    assert.strictEqual(result.maxLoan + result.downPayment, result.maxPropertyValue);
    assert.strictEqual(loanForEmi(10_000, 0, 10), 1_200_000);
  });

  test('no headroom means no loan, and age trims the asked tenure', () => {
    const maxed = calculateEligibility({
      monthlyIncome: 40_000,
      existingEmis: 40_000,
      age: 30,
      annualRate: 8.5,
      tenureYears: 20,
    });
    const senior = calculateEligibility({
      monthlyIncome: 100_000,
      existingEmis: 0,
      age: 55,
      annualRate: 8.5,
      tenureYears: 20,
    });

    assert.strictEqual(maxed.maxLoan, 0);
    assert.strictEqual(maxed.eligible, false);
    assert.strictEqual(senior.tenureYears, 5);
    assert.ok(senior.tenureCapped);
  });
});

describe('rent vs buy', () => {
  const base = {
    price: 10_000_000,
    downPayment: 2_000_000,
    upfrontCharges: 630_000,
    annualRate: 8.5,
    tenureYears: 20,
    monthlyRent: 30_000,
    rentHikePct: 7,
    appreciationPct: 6,
    investmentReturnPct: 9,
    maintenancePct: 0.75,
  };

  test('outstanding balance runs from full principal to zero', () => {
    assert.strictEqual(outstandingAfter(10_000_000, 8.5, 20, 0), 10_000_000);
    assert.ok(outstandingAfter(10_000_000, 8.5, 20, 240) < 5);
    const midway = outstandingAfter(10_000_000, 8.5, 20, 60);
    assert.ok(midway > 8_000_000 && midway < 9_000_000);
  });

  test('projection is 10 rows of monotonic outgo', () => {
    const result = projectRentVsBuy(base);

    assert.strictEqual(result.rows.length, 10);
    assert.strictEqual(result.rows[0].year, 1);
    for (let i = 1; i < result.rows.length; i += 1) {
      assert.ok(result.rows[i].cumulativeEmi > result.rows[i - 1].cumulativeEmi);
      assert.ok(result.rows[i].cumulativeRent > result.rows[i - 1].cumulativeRent);
      assert.ok(result.rows[i].outstandingLoan < result.rows[i - 1].outstandingLoan);
    }
  });

  test('breakeven follows the market it is given', () => {
    const hot = projectRentVsBuy({ ...base, appreciationPct: 15 });
    const flat = projectRentVsBuy({
      ...base,
      appreciationPct: 0,
      rentHikePct: 2,
      investmentReturnPct: 12,
    });

    assert.strictEqual(hot.verdict, 'buy');
    assert.ok(hot.breakevenYear !== null);
    assert.strictEqual(flat.verdict, 'rent');
    assert.strictEqual(flat.breakevenYear, null);
    assert.ok(hot.advantageAtHorizon > 0);
  });
});
