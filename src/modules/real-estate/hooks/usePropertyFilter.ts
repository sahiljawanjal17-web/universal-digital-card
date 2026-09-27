'use client';

import { useCallback, useMemo } from 'react';
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';
import { useRole } from '@/lib/hooks/useRole';
import { EVENTS, track } from '@/core/analytics';
import {
  EMPTY_CRITERIA,
  SORT_KEYS,
  expandBhkSelection,
  filterAndSort,
  hasActiveFilters,
  possessionOptions,
  type FilterCriteria,
  type SortKey,
} from '../lib/filter';
import type { Furnishing, ListingFor, Property, PropertyType, RealEstateModule } from '../types';

const PROPERTY_TYPES = ['apartment', 'villa', 'plot', 'commercial'] as const;
const FURNISHINGS = ['unfurnished', 'semi', 'full'] as const;
const LISTING_FOR = ['sale', 'rent'] as const;

/**
 * Filter state lives in the URL, not in React — so a filtered view survives a
 * reload and can be pasted into WhatsApp and reopened identically (PART-05 §5.3).
 */
const parsers = {
  budgetMin: parseAsInteger,
  budgetMax: parseAsInteger,
  bhk: parseAsArrayOf(parseAsInteger),
  type: parseAsArrayOf(parseAsStringLiteral(PROPERTY_TYPES)),
  locality: parseAsArrayOf(parseAsString),
  furnishing: parseAsStringLiteral(FURNISHINGS),
  possession: parseAsString,
  areaMin: parseAsInteger,
  listingFor: parseAsStringLiteral(LISTING_FOR),
  sort: parseAsStringLiteral(SORT_KEYS).withDefault('relevance'),
};

export type QueryPatch = Partial<{
  budgetMin: number | null;
  budgetMax: number | null;
  bhk: number[] | null;
  type: PropertyType[] | null;
  locality: string[] | null;
  furnishing: Furnishing | null;
  possession: string | null;
  areaMin: number | null;
  listingFor: ListingFor | null;
  sort: SortKey;
}>;

const CLEARED: QueryPatch = {
  budgetMin: null,
  budgetMax: null,
  bhk: null,
  type: null,
  locality: null,
  furnishing: null,
  possession: null,
  areaMin: null,
  listingFor: null,
};

export interface PropertyFilterState {
  all: Property[];
  results: Property[];
  criteria: FilterCriteria;
  sort: SortKey;
  isFiltered: boolean;
  facets: RealEstateModule['filters'];
  possessions: string[];
  setFilter: (patch: QueryPatch) => void;
  toggleInList: <T extends string | number>(key: 'bhk' | 'type' | 'locality', value: T) => void;
  reset: () => void;
}

export function usePropertyFilter(): PropertyFilterState {
  const { data } = useRole();
  const realEstate = data.module as RealEstateModule;
  const all = realEstate.properties;
  const [query, setQuery] = useQueryStates(parsers, { history: 'replace', shallow: true });

  const criteria = useMemo<FilterCriteria>(() => {
    const [lo, hi] = realEstate.filters.budgetRange;
    const min = query.budgetMin ?? null;
    const max = query.budgetMax ?? null;

    return {
      ...EMPTY_CRITERIA,
      budget: min === null && max === null ? null : [min ?? lo, max ?? hi],
      bhk: expandBhkSelection(query.bhk ?? [], realEstate.filters.bhkOptions, all),
      type: query.type ?? [],
      locality: query.locality ?? [],
      furnishing: query.furnishing,
      possession: query.possession,
      areaMin: query.areaMin,
      listingFor: query.listingFor,
    };
  }, [query, realEstate.filters, all]);

  const results = useMemo(
    () => filterAndSort(all, criteria, query.sort),
    [all, criteria, query.sort],
  );

  const setFilter = useCallback(
    (patch: QueryPatch) => {
      void setQuery(patch);
      const [facet] = Object.keys(patch);
      if (facet) track(EVENTS.FILTER_APPLY, { section: 'propertyFilter', facet });
    },
    [setQuery],
  );

  /** Chips are additive: clicking an active one removes it. */
  const toggleInList = useCallback(
    <T extends string | number>(key: 'bhk' | 'type' | 'locality', value: T) => {
      const current = (query[key] ?? []) as T[];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      setFilter({ [key]: next.length > 0 ? next : null } as QueryPatch);
    },
    [query, setFilter],
  );

  const reset = useCallback(() => {
    void setQuery(CLEARED);
    track(EVENTS.FILTER_APPLY, { section: 'propertyFilter', facet: 'reset' });
  }, [setQuery]);

  return {
    all,
    results,
    criteria,
    sort: query.sort,
    isFiltered: hasActiveFilters(criteria),
    facets: realEstate.filters,
    possessions: useMemo(() => possessionOptions(all), [all]),
    setFilter,
    toggleInList,
    reset,
  };
}
