import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { InsuranceModuleSchema } from '@/config/schema/modules/insurance.schema';
import { buildIntentMessage } from '@/core/whatsapp';
import { annuityFactor, calculateHlv, roundUpToLakh } from './hlv';
import { estimatePremium, findBand, parseBand, pricedProducts, type PremiumInput } from './premium';
import { hlvFields, premiumFields, registerInsuranceTemplates } from './wa-templates';

const raw = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/data/roles/insurance.json'), 'utf8'),
) as { module: unknown };
const insurance = InsuranceModuleSchema.parse(raw.module);
const { estimator } = insurance;

const BASE: PremiumInput = {
  product: 'term',
  age: 32,
  cover: 10_000_000,
  tenure: 30,
  smoker: false,
  gender: 'male',
};

describe('premium', () => {
  test('parses age bands and rejects junk', () => {
    assert.deepStrictEqual(parseBand('18-30'), [18, 30]);
    assert.strictEqual(parseBand('30-18'), null);
    assert.strictEqual(parseBand('senior'), null);
    assert.strictEqual(findBand({ '18-30': 1, '31-40': 2 }, 31)?.key, '31-40');
  });

  test('schema defaults GST to 18% when the JSON omits it', () => {
    assert.strictEqual(estimator.gstRate, 0.18);
  });

  test('prices ₹1 Cr at 32 from the 31-40 band with GST as a line item', () => {
    const quote = estimatePremium(BASE, estimator);
    assert.ok(quote);
    const rate = estimator.rateTable.term?.['31-40'] ?? 0;
    assert.strictEqual(quote.bandUsed, '31-40');
    assert.strictEqual(quote.base, Math.round(BASE.cover * rate));
    assert.strictEqual(quote.gst, Math.round(quote.base * 0.18));
    assert.strictEqual(quote.annual, quote.base + quote.gst);
    assert.strictEqual(quote.totalPaid, quote.annual * BASE.tenure);
    assert.deepStrictEqual(quote.loadingsApplied, []);
  });

  test('smoker ×1.6 and female ×0.9 loadings stack', () => {
    const plain = estimatePremium(BASE, estimator);
    const loaded = estimatePremium({ ...BASE, smoker: true, gender: 'female' }, estimator);
    assert.ok(plain && loaded);
    assert.strictEqual(loaded.base, Math.round(BASE.cover * 0.00068 * 1.6 * 0.9));
    assert.deepStrictEqual(loaded.loadingsApplied, ['smoker', 'female']);
    assert.ok(loaded.base > plain.base);
  });

  test('returns null outside the table instead of guessing', () => {
    assert.strictEqual(estimatePremium({ ...BASE, age: 70 }, estimator), null);
    assert.strictEqual(estimatePremium({ ...BASE, product: 'motor' }, estimator), null);
    assert.deepStrictEqual(pricedProducts(insurance.products, estimator), ['term']);
  });
});

describe('hlv', () => {
  test('annuity factor edge cases', () => {
    assert.strictEqual(annuityFactor(0.06, 0), 0);
    assert.strictEqual(annuityFactor(0, 10), 10);
    assert.ok(Math.abs(annuityFactor(0.06, 28) - 13.406) < 0.01);
    assert.strictEqual(roundUpToLakh(17_341_562), 17_400_000);
  });

  test('PART-06 §6 example lands near ₹2.2 Cr with a red gap', () => {
    const input = {
      annualIncome: 1_800_000,
      age: 32,
      retirementAge: 60,
      liabilities: 4_500_000,
      existingCover: 5_000_000,
    };
    const result = calculateHlv(input, insurance.hlv);
    assert.strictEqual(result.workingYears, 28);
    assert.ok(result.recommended > 20_000_000 && result.recommended < 22_500_000);
    assert.strictEqual(result.recommended % 100_000, 0);
    assert.strictEqual(result.gap, result.recommended - 5_000_000);
  });

  test('never reports a negative gap', () => {
    const result = calculateHlv(
      { annualIncome: 500_000, age: 55, retirementAge: 60, liabilities: 0, existingCover: 50_000_000 },
      insurance.hlv,
    );
    assert.strictEqual(result.gap, 0);
  });
});

describe('insurance whatsapp templates', () => {
  registerInsuranceTemplates();

  test('premium_quote carries the §6 lines', () => {
    const quote = estimatePremium(BASE, estimator);
    assert.ok(quote);
    const text = buildIntentMessage({
      intent: 'premium_quote',
      business: 'Verma Insurance Advisory',
      values: premiumFields(BASE, quote),
    });
    assert.match(text, /Insurance Quote Request/);
    assert.match(text, /Cover: ₹1,00,00,000/);
    assert.match(text, /incl\. GST/);
    assert.match(text, /exact quotes from top insurers/);
  });

  test('hlv_gap bolds the gap', () => {
    const input = { annualIncome: 1_800_000, age: 32, retirementAge: 60, liabilities: 0, existingCover: 0 };
    const text = buildIntentMessage({
      intent: 'hlv_gap',
      business: 'Verma Insurance Advisory',
      values: hlvFields(input, calculateHlv(input, insurance.hlv)),
    });
    assert.match(text, /Cover Gap Analysis/);
    assert.match(text, /Cover Gap: \*₹/);
  });
});
