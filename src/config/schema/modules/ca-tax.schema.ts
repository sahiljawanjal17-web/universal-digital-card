/** `module` block for the ca-tax role — docs/03-CONFIG-SCHEMA.md. */
import { z } from 'zod';

export const ChecklistItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  required: z.boolean().default(true),
  hint: z.string().default(''),
});

/** Slab upper bound `null` = "and above". */
export const TaxSlabSchema = z.object({
  upTo: z.number().positive().nullable(),
  ratePct: z.number().min(0).max(100),
});

export const CaTaxModuleSchema = z.object({
  checklists: z.record(z.string(), z.array(ChecklistItemSchema)),
  /**
   * Indicative slabs only — docs/09-FEATURE-MATRIX.md requires the
   * "Verify with your CA" disclaimer wherever these are rendered.
   */
  regimeCalc: z.object({
    fy: z.string().regex(/^\d{4}-\d{2}$/, 'Expected a financial year like "2025-26"'),
    slabsOld: z.array(TaxSlabSchema).min(1),
    slabsNew: z.array(TaxSlabSchema).min(1),
    stdDeduction: z.number().nonnegative(),
    cessPct: z.number().min(0).max(100),
  }),
  gst: z.object({ slabs: z.array(z.number().min(0).max(100)).min(1) }),
  dueDates: z
    .array(
      z.object({
        date: z.iso.date(),
        title: z.string().min(1),
        for: z.string().min(1),
      }),
    )
    .default([]),
  packages: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().nonnegative(),
        turnaround: z.string().min(1),
        includes: z.array(z.string().min(1)).default([]),
      }),
    )
    .default([]),
  membershipNo: z.string().min(1),
});

export type CaTaxModule = z.infer<typeof CaTaxModuleSchema>;
