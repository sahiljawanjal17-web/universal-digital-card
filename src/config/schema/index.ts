/**
 * Every role's LEVEL 3 data schema = the common block + that role's `module`.
 * `dataSchemas` is the only map resolveConfig() and validate-config use.
 */
import { z } from 'zod';
import type { RoleKey } from '@/types/role';
import { CommonDataSchema } from './common.schema';
import { RealEstateModuleSchema } from './modules/real-estate.schema';
import { InsuranceModuleSchema } from './modules/insurance.schema';
import { DoctorModuleSchema } from './modules/doctor.schema';
import { CaTaxModuleSchema } from './modules/ca-tax.schema';
import { PhotographerModuleSchema } from './modules/photographer.schema';
import { FitnessTutorModuleSchema } from './modules/fitness-tutor.schema';

export const RealEstateDataSchema = CommonDataSchema.extend({ module: RealEstateModuleSchema });
export const InsuranceDataSchema = CommonDataSchema.extend({ module: InsuranceModuleSchema });
export const DoctorDataSchema = CommonDataSchema.extend({ module: DoctorModuleSchema });
export const CaTaxDataSchema = CommonDataSchema.extend({ module: CaTaxModuleSchema });
export const PhotographerDataSchema = CommonDataSchema.extend({ module: PhotographerModuleSchema });
export const FitnessTutorDataSchema = CommonDataSchema.extend({ module: FitnessTutorModuleSchema });

export const dataSchemas = {
  'real-estate': RealEstateDataSchema,
  insurance: InsuranceDataSchema,
  doctor: DoctorDataSchema,
  'ca-tax': CaTaxDataSchema,
  photographer: PhotographerDataSchema,
  'fitness-tutor': FitnessTutorDataSchema,
} as const satisfies Record<RoleKey, z.ZodType>;

/** Per-role parsed data type, e.g. RoleData['doctor'].module.slots. */
export type RoleData = {
  [K in RoleKey]: z.infer<(typeof dataSchemas)[K]>;
};

export * from './common.schema';
export { SiteSchema, type SiteConfig } from './site.schema';
export { PresetSchema, SectionKeySchema, type RolePreset } from './preset.schema';
