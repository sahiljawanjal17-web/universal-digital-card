/** Role key to preset map. ROLE_KEYS remains the only source of truth for keys. */
import type { RoleKey } from '@/types/role';
import type { RolePreset } from '../schema/preset.schema';
import { realEstatePreset } from './real-estate.preset';
import { insurancePreset } from './insurance.preset';
import { doctorPreset } from './doctor.preset';
import { caTaxPreset } from './ca-tax.preset';
import { photographerPreset } from './photographer.preset';
import { fitnessTutorPreset } from './fitness-tutor.preset';

export const presets: Record<RoleKey, RolePreset> = {
  'real-estate': realEstatePreset,
  insurance: insurancePreset,
  doctor: doctorPreset,
  'ca-tax': caTaxPreset,
  photographer: photographerPreset,
  'fitness-tutor': fitnessTutorPreset,
};

export function getPreset(role: RoleKey): RolePreset {
  return presets[role];
}
