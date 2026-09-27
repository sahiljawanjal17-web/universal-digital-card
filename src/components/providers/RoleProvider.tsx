'use client';

import { createContext } from 'react';
import type { ResolvedConfig } from '@/types/config';

export const RoleContext = createContext<ResolvedConfig | null>(null);

/**
 * Receives the server-resolved config as serialized props and exposes it to the
 * client subtree. Nothing below this may branch on the role key directly.
 */
export function RoleProvider({
  config,
  children,
}: {
  config: ResolvedConfig;
  children: React.ReactNode;
}) {
  return <RoleContext.Provider value={config}>{children}</RoleContext.Provider>;
}
