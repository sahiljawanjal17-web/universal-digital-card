/** `module` block for the real-estate role — docs/03-CONFIG-SCHEMA.md. */
import { z } from 'zod';
import { MediaRefSchema } from '../common.schema';

export const PropertySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(['apartment', 'villa', 'plot', 'commercial']),
  listingFor: z.enum(['sale', 'rent']),
  bhk: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  price: z.number().positive(),
  pricePerSqft: z.number().positive(),
  carpetArea: z.number().positive(),
  superBuiltUp: z.number().positive(),
  furnishing: z.enum(['unfurnished', 'semi', 'full']),
  floor: z.number().int(),
  totalFloors: z.number().int().positive(),
  facing: z.string().min(1),
  ageYears: z.number().nonnegative(),
  possession: z.string().min(1),
  reraId: z.string().min(1),
  locality: z.string().min(1),
  city: z.string().min(1),
  amenities: z.array(z.string().min(1)).default([]),
  nearby: z
    .array(z.object({ type: z.string().min(1), name: z.string().min(1), km: z.number().nonnegative() }))
    .default([]),
  images: z.array(MediaRefSchema).min(1),
  floorPlan: MediaRefSchema.nullable().default(null),
  tourUrl: z.url().nullable().default(null),
  featured: z.boolean().default(false),
  status: z.enum(['available', 'sold', 'rented', 'hold']).default('available'),
});

export const RealEstateModuleSchema = z.object({
  properties: z.array(PropertySchema).default([]),
  filters: z.object({
    budgetRange: z.tuple([z.number().positive(), z.number().positive()]),
    budgetStep: z.number().positive(),
    bhkOptions: z.array(z.number().int().positive()).min(1),
    typeOptions: z.array(z.enum(['apartment', 'villa', 'plot', 'commercial'])).min(1),
    localities: z.array(z.string().min(1)).min(1),
  }),
  /** Indicative only — see the disclaimer rule in docs/09-FEATURE-MATRIX.md. */
  emi: z.object({
    defaultRate: z.number().positive(),
    defaultTenure: z.number().int().positive(),
    minDownPct: z.number().min(0).max(100),
  }),
  stampDuty: z.object({
    state: z.string().min(1),
    dutyPct: z.number().min(0).max(100),
    regPct: z.number().min(0).max(100),
    femaleRebatePct: z.number().min(0).max(100),
  }),
});

export type RealEstateModule = z.infer<typeof RealEstateModuleSchema>;
