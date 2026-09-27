/**
 * Real-estate module types. Every shape here is inferred from the zod schema in
 * `src/config/schema/modules/real-estate.schema.ts` — hand-written duplicates of
 * a validated shape are banned (docs/07-CONVENTIONS.md), because a drifting
 * interface would let invalid data type-check.
 */
import type { z } from 'zod';
import type {
  PropertySchema,
  RealEstateModuleSchema,
} from '@/config/schema/modules/real-estate.schema';

export type Property = z.infer<typeof PropertySchema>;
export type RealEstateModule = z.infer<typeof RealEstateModuleSchema>;

export type PropertyType = Property['type'];
export type ListingFor = Property['listingFor'];
export type Furnishing = Property['furnishing'];
export type PropertyStatus = Property['status'];
export type NearbyPlace = Property['nearby'][number];

export type RealEstateFilters = RealEstateModule['filters'];
export type EmiDefaults = RealEstateModule['emi'];
export type StampDutyRules = RealEstateModule['stampDuty'];
