/** `module` block for the insurance role — docs/03-CONFIG-SCHEMA.md. */
import { z } from 'zod';
import { MediaRefSchema } from '../common.schema';

export const InsuranceModuleSchema = z.object({
  products: z.array(z.enum(['term', 'health', 'motor', 'child', 'retirement'])).min(1),
  /**
   * Indicative rate table only ("premium per rupee of cover, per year" by age
   * band). Real quotes come from the insurer — never present these as binding.
   */
  estimator: z.object({
    ageRange: z.tuple([z.number().int().positive(), z.number().int().positive()]),
    coverOptions: z.array(z.number().positive()).min(1),
    tenureRange: z.tuple([z.number().int().positive(), z.number().int().positive()]),
    rateTable: z.record(z.string(), z.record(z.string(), z.number().positive())),
    loadings: z.record(z.string(), z.number().positive()),
    /** GST on premium, shown as its own line item (term & health: 18%). */
    gstRate: z.number().min(0).max(1).default(0.18),
  }),
  /**
   * Human-life-value assumptions (income-replacement method): the share of
   * income the earner spends on themself, and the rate future income is
   * discounted at. Both are indicative defaults, not advice.
   */
  hlv: z
    .object({
      selfExpenseRatio: z.number().min(0).max(0.9).default(0.3),
      discountRate: z.number().min(0).max(0.2).default(0.06),
      retirementAge: z.number().int().positive().default(60),
    })
    .prefault({}),
  plans: z
    .array(
      z.object({
        id: z.string().min(1),
        insurer: z.string().min(1),
        name: z.string().min(1),
        claimRatio: z.number().min(0).max(100),
        usp: z.array(z.string().min(1)).default([]),
        logo: MediaRefSchema.nullable().default(null),
      }),
    )
    .default([]),
  taxSaving: z.object({
    s80c: z.number().nonnegative(),
    s80d: z.number().nonnegative(),
    s80dSenior: z.number().nonnegative(),
  }),
  irdaiLicense: z.string().min(1),
});

export type InsuranceModule = z.infer<typeof InsuranceModuleSchema>;
