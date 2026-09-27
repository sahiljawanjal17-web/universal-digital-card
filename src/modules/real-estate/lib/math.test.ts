import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  filterProperties,
  sortProperties,
  expandBhkSelection,
  SORT_KEYS,
  EMPTY_CRITERIA
} from './filter';

import { calculateEmi, emiSummary, buildAmortization } from './emi';
import type { Property, PropertyType } from '../types';

// Load real-estate data
const dataPath = path.resolve(process.cwd(), 'src/data/roles/real-estate.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const properties = rawData.module.properties as Property[];

describe('real-estate filter', () => {
  test('filter properties with various criteria', () => {
    // 8 filter facets
    const criteria = {
      ...EMPTY_CRITERIA,
      budget: [5000000, 15000000] as [number, number], // 1. budget
      bhk: [3], // 2. bhk
      type: ['apartment'] as PropertyType[], // 3. type
      locality: [], // 4. locality
      furnishing: null, // 5. furnishing
      possession: null, // 6. possession
      areaMin: null, // 7. areaMin
      listingFor: null, // 8. listingFor
    };
    
    // We just ensure it doesn't crash and returns an array
    const filtered = filterProperties(properties, criteria);
    assert.ok(Array.isArray(filtered));
  });

  test('sort keys are 5 and valid', () => {
    assert.strictEqual(SORT_KEYS.length, 5);
    const sorted = sortProperties(properties, SORT_KEYS[0]);
    assert.ok(Array.isArray(sorted));
    assert.strictEqual(sorted.length, properties.length);
  });

  test('expandBhkSelection', () => {
    const selected = [5];
    const options = [1, 2, 3, 4, 5];
    const expanded = expandBhkSelection(selected, options, properties);
    assert.ok(expanded.includes(5));
    // If there are properties with bhk > 5, they should be included
    const hasGreaterThan5 = properties.some((p) => p.bhk > 5);
    if (hasGreaterThan5) {
      assert.ok(expanded.length > 1);
    }
  });
});

describe('real-estate emi', () => {
  test('calculateEmi for specific values', () => {
    const result = calculateEmi({ principal: 10000000, annualRate: 8.5, tenureYears: 20 });
    // Should be approximately 86782
    assert.ok(Math.abs(result - 86782) < 1);
  });

  test('emiSummary structure', () => {
    const summary = emiSummary({ principal: 10000000, annualRate: 8.5, tenureYears: 20 });
    assert.strictEqual(summary.months, 240);
    assert.strictEqual(Math.round(summary.monthlyEmi), 86782);
  });

  test('buildAmortization invariants', () => {
    const principal = 10000000;
    const amortization = buildAmortization({ principal, annualRate: 8.5, tenureYears: 20 });
    
    // Total principalPaid should equal the principal
    const totalPrincipalPaid = amortization.reduce((sum, year) => sum + year.principalPaid, 0);
    // Floating point math might be slightly off, but should be exact due to rounding in buildAmortization
    assert.ok(Math.abs(totalPrincipalPaid - principal) < 1);

    // Last year's balance should be 0
    const lastYear = amortization[amortization.length - 1];
    assert.strictEqual(lastYear.balance, 0);
  });
});
