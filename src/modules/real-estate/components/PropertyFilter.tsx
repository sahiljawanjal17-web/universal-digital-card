'use client';

import { Button } from '@/components/ui/button';
import { BudgetSlider } from './BudgetSlider';
import { ChipGroup, FilterChip } from './FilterChips';
import type { PropertyFilterState } from '../hooks/usePropertyFilter';
import type { Furnishing, ListingFor, PropertyType } from '../types';

const LISTING_LABELS: Record<ListingFor, string> = { sale: 'Buy', rent: 'Rent' };
const FURNISHING_LABELS: Record<Furnishing, string> = {
  unfurnished: 'Unfurnished',
  semi: 'Semi-furnished',
  full: 'Fully furnished',
};
const TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Apartment',
  villa: 'Villa',
  plot: 'Plot',
  commercial: 'Commercial',
};
const AREA_STEPS = [750, 1000, 1500, 2000];

function possessionLabel(value: string): string {
  if (value === 'ready') return 'Ready to move';
  const [month, year] = value.split('-');
  if (!year) return value;
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${year}`;
}

/**
 * The facet panel itself — identical markup in the desktop sidebar and the
 * mobile drawer, so there is only ever one set of controls to keep in sync.
 */
export function PropertyFilter({
  state,
  onReset,
}: {
  state: PropertyFilterState;
  onReset?: () => void;
}) {
  const { criteria, facets, possessions, setFilter, toggleInList, reset, isFiltered } = state;
  const topBhk = Math.max(...facets.bhkOptions);

  return (
    <div className="flex flex-col gap-6">
      <ChipGroup legend="Looking to">
        {(Object.keys(LISTING_LABELS) as ListingFor[]).map((value) => (
          <FilterChip
            key={value}
            label={LISTING_LABELS[value]}
            active={criteria.listingFor === value}
            onClick={() =>
              setFilter({ listingFor: criteria.listingFor === value ? null : value })
            }
          />
        ))}
      </ChipGroup>

      <BudgetSlider
        range={facets.budgetRange}
        step={facets.budgetStep}
        value={criteria.budget}
        onCommit={(next) =>
          setFilter({ budgetMin: next?.[0] ?? null, budgetMax: next?.[1] ?? null })
        }
      />

      <ChipGroup legend="Bedrooms">
        {facets.bhkOptions.map((bhk) => (
          <FilterChip
            key={bhk}
            label={bhk === topBhk ? `${bhk}+ BHK` : `${bhk} BHK`}
            active={criteria.bhk.includes(bhk)}
            onClick={() => toggleInList('bhk', bhk)}
          />
        ))}
      </ChipGroup>

      <ChipGroup legend="Property type">
        {facets.typeOptions.map((type) => (
          <FilterChip
            key={type}
            label={TYPE_LABELS[type]}
            active={criteria.type.includes(type)}
            onClick={() => toggleInList('type', type)}
          />
        ))}
      </ChipGroup>

      <ChipGroup legend="Locality">
        {facets.localities.map((locality) => (
          <FilterChip
            key={locality}
            label={locality}
            active={criteria.locality.includes(locality)}
            onClick={() => toggleInList('locality', locality)}
          />
        ))}
      </ChipGroup>

      <ChipGroup legend="Furnishing">
        {(Object.keys(FURNISHING_LABELS) as Furnishing[]).map((value) => (
          <FilterChip
            key={value}
            label={FURNISHING_LABELS[value]}
            active={criteria.furnishing === value}
            onClick={() =>
              setFilter({ furnishing: criteria.furnishing === value ? null : value })
            }
          />
        ))}
      </ChipGroup>

      <ChipGroup legend="Possession">
        {possessions.map((value) => (
          <FilterChip
            key={value}
            label={possessionLabel(value)}
            active={criteria.possession === value}
            onClick={() => setFilter({ possession: criteria.possession === value ? null : value })}
          />
        ))}
      </ChipGroup>

      <ChipGroup legend="Min carpet area">
        {AREA_STEPS.map((area) => (
          <FilterChip
            key={area}
            label={`${area}+ sq.ft.`}
            active={criteria.areaMin === area}
            onClick={() => setFilter({ areaMin: criteria.areaMin === area ? null : area })}
          />
        ))}
      </ChipGroup>

      {isFiltered ? (
        <Button
          type="button"
          variant="ghost"
          className="self-start"
          onClick={() => {
            reset();
            onReset?.();
          }}
        >
          Reset all filters
        </Button>
      ) : null}
    </div>
  );
}

export { possessionLabel };
