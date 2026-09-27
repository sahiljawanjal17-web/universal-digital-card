'use client';

import { useMemo, useState } from 'react';
import { useRole } from '@/lib/hooks/useRole';
import type { Property, RealEstateModule } from '../types';

export interface CalculatorPropertyState {
  realEstate: RealEstateModule;
  /** Purchasable listings only — a rental has no loan to size. */
  properties: Property[];
  selected: Property | null;
  selectedId: string;
  select: (id: string) => void;
}

/**
 * Every calculator starts from a real listing rather than an empty form, so the
 * first number a visitor sees is one of the agent's own properties. Sale-only:
 * an EMI or a stamp-duty bill on a rental listing would be nonsense.
 */
export function useCalculatorProperty(): CalculatorPropertyState {
  const { data } = useRole();
  const realEstate = data.module as RealEstateModule;

  const properties = useMemo(
    () =>
      realEstate.properties.filter(
        (property) => property.listingFor === 'sale' && property.status === 'available',
      ),
    [realEstate.properties],
  );

  const [selectedId, setSelectedId] = useState('');
  const fallback = properties[0] ?? null;
  const selected = properties.find((property) => property.id === selectedId) ?? fallback;

  return {
    realEstate,
    properties,
    selected,
    selectedId: selected?.id ?? '',
    select: setSelectedId,
  };
}
