/** Raw, unvalidated LEVEL 3 data. Only src/config/index.ts may read this. */
import type { RoleKey } from '@/types/role';
import realEstate from './real-estate.json';
import insurance from './insurance.json';
import doctor from './doctor.json';
import caTax from './ca-tax.json';
import photographer from './photographer.json';
import fitnessTutor from './fitness-tutor.json';

export const rawRoleData: Record<RoleKey, unknown> = {
  'real-estate': realEstate,
  insurance,
  doctor,
  'ca-tax': caTax,
  photographer,
  'fitness-tutor': fitnessTutor,
};
