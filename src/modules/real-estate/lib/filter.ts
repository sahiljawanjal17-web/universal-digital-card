/**
 * Pure filter/sort engine for the property browser. No React, no DOM, no config
 * import — the UI (`usePropertyFilter`) owns the state, this file only answers
 * "given these criteria, which properties match, in what order?".
 *
 * Faceted-filter shape adapted from sadmann7/skateshop `products-filter`
 * (https://github.com/sadmann7/skateshop, MIT) — reduced to plain predicates.
 */
import type { Furnishing, ListingFor, Property, PropertyType } from '../types';

/** A null / empty facet means "no constraint", never "match nothing". */
export interface FilterCriteria {
  budget: [min: number, max: number] | null;
  bhk: number[];
  type: PropertyType[];
  locality: string[];
  furnishing: Furnishing | null;
  possession: string | null;
  areaMin: number | null;
  listingFor: ListingFor | null;
}

export const SORT_KEYS = ['relevance', 'price-asc', 'price-desc', 'area-desc', 'newest'] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export const SORT_LABELS: Record<SortKey, string> = {
  relevance: 'Featured first',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  'area-desc': 'Largest carpet area',
  newest: 'Newest construction',
};

export const EMPTY_CRITERIA: FilterCriteria = {
  budget: null,
  bhk: [],
  type: [],
  locality: [],
  furnishing: null,
  possession: null,
  areaMin: null,
  listingFor: null,
};

export function isSortKey(value: string): value is SortKey {
  return (SORT_KEYS as readonly string[]).includes(value);
}

function matchesBhk(property: Property, wanted: number[]): boolean {
  return wanted.length === 0 || wanted.includes(property.bhk);
}

/**
 * The chip row's last option reads "5+", so selecting it must also catch the
 * 6BHK listings the config never enumerated. Everything else stays an exact
 * match — picking "3" must not quietly mean "3 or more".
 */
export function expandBhkSelection(
  selected: number[],
  options: number[],
  all: Property[],
): number[] {
  if (selected.length === 0 || options.length === 0) return selected;
  const top = Math.max(...options);
  if (!selected.includes(top)) return selected;

  const higher = all.map((p) => p.bhk).filter((bhk) => bhk > top);
  return Array.from(new Set([...selected, ...higher]));
}

function matchesBudget(property: Property, budget: FilterCriteria['budget']): boolean {
  if (!budget) return true;
  const [min, max] = budget;
  return property.price >= min && property.price <= max;
}

export function matchesCriteria(property: Property, criteria: FilterCriteria): boolean {
  if (!matchesBudget(property, criteria.budget)) return false;
  if (!matchesBhk(property, criteria.bhk)) return false;
  if (criteria.type.length > 0 && !criteria.type.includes(property.type)) return false;
  if (criteria.locality.length > 0 && !criteria.locality.includes(property.locality)) return false;
  if (criteria.furnishing && property.furnishing !== criteria.furnishing) return false;
  if (criteria.possession && property.possession !== criteria.possession) return false;
  if (criteria.areaMin !== null && property.carpetArea < criteria.areaMin) return false;
  if (criteria.listingFor && property.listingFor !== criteria.listingFor) return false;
  return true;
}

export function filterProperties(all: Property[], criteria: FilterCriteria): Property[] {
  return all.filter((property) => matchesCriteria(property, criteria));
}

const COMPARATORS: Record<SortKey, (a: Property, b: Property) => number> = {
  relevance: (a, b) => Number(b.featured) - Number(a.featured) || a.price - b.price,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'area-desc': (a, b) => b.carpetArea - a.carpetArea,
  newest: (a, b) => a.ageYears - b.ageYears || b.price - a.price,
};

/** Returns a new array — the caller's list stays untouched. */
export function sortProperties(list: Property[], key: SortKey): Property[] {
  return [...list].sort(COMPARATORS[key]);
}

export function filterAndSort(
  all: Property[],
  criteria: FilterCriteria,
  sort: SortKey,
): Property[] {
  return sortProperties(filterProperties(all, criteria), sort);
}

/** How many properties survive if one facet were cleared — powers chip counts. */
export function countMatches(all: Property[], criteria: FilterCriteria): number {
  return filterProperties(all, criteria).length;
}

export function hasActiveFilters(criteria: FilterCriteria): boolean {
  return (
    criteria.budget !== null ||
    criteria.bhk.length > 0 ||
    criteria.type.length > 0 ||
    criteria.locality.length > 0 ||
    criteria.furnishing !== null ||
    criteria.possession !== null ||
    criteria.areaMin !== null ||
    criteria.listingFor !== null
  );
}

/** Distinct `possession` values present in the data, "ready" first. */
export function possessionOptions(all: Property[]): string[] {
  const found = Array.from(new Set(all.map((p) => p.possession)));
  return found.sort((a, b) =>
    a === 'ready' ? -1 : b === 'ready' ? 1 : a.localeCompare(b),
  );
}
