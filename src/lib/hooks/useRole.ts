'use client';

import { useContext } from 'react';
import { RoleContext } from '@/components/providers/RoleProvider';

/** Access the resolved role config from any client component. */
export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole() must be used inside <RoleProvider>.');
  return ctx;
}
