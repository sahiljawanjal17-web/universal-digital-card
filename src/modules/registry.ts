/**
 * Lazy module registry. The ONLY place (with SectionRenderer) allowed to map a
 * role key to role-specific code. Modules are stubs until PART-05..PART-10.
 */
import type { RoleKey } from '@/types/role';

export type RoleModuleLoader = () => Promise<unknown>;

export const moduleRegistry: Record<RoleKey, RoleModuleLoader> = {
  'real-estate': () => import('@/modules/real-estate/index'),
  insurance: () => import('@/modules/insurance/index'),
  doctor: () => import('@/modules/doctor/index'),
  'ca-tax': () => import('@/modules/ca-tax/index'),
  photographer: () => import('@/modules/photographer/index'),
  'fitness-tutor': () => import('@/modules/fitness-tutor/index'),
};

export function loadModule(role: RoleKey): Promise<unknown> {
  return moduleRegistry[role]();
}
