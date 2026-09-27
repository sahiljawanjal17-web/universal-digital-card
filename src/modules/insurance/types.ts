/**
 * Insurance module types, inferred from the zod schema in
 * `src/config/schema/modules/insurance.schema.ts` — never hand-duplicated
 * (docs/07-CONVENTIONS.md).
 */
import type { z } from 'zod';
import type { InsuranceModuleSchema } from '@/config/schema/modules/insurance.schema';

export type InsuranceModule = z.infer<typeof InsuranceModuleSchema>;
export type InsuranceProduct = InsuranceModule['products'][number];
export type EstimatorConfig = InsuranceModule['estimator'];
export type HlvConfig = InsuranceModule['hlv'];
export type Plan = InsuranceModule['plans'][number];
