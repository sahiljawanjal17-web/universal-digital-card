'use client';

import { useRole } from '@/lib/hooks/useRole';
import type { InsuranceModule } from '../types';

export interface InsuranceModuleState {
  module: InsuranceModule;
  /** Advisory name — the attribution line of every message. */
  business: string;
}

/** The one place an insurance widget reaches into the resolved config. */
export function useInsuranceModule(): InsuranceModuleState {
  const { data } = useRole();

  return {
    module: data.module as InsuranceModule,
    business: data.profile.name,
  };
}
