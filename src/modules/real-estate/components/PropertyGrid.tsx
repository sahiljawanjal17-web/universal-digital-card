'use client';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared';
import { Reveal } from '@/components/motion';
import { PropertyCard } from './PropertyCard';
import { PropertyDetailDrawer } from './PropertyDetailDrawer';
import type { Property } from '../types';

/**
 * The results list. The stagger delay is capped at one screenful — a 24-card
 * list on `StaggerGroup`'s open-ended rhythm would still be fading in two
 * seconds after the user started scrolling.
 */
const MAX_STAGGER_STEPS = 5;
const STAGGER_STEP = 0.08;

export function PropertyGrid({
  properties,
  onReset,
  shortlisted = [],
  compared = [],
  onShortlist,
  onCompare,
}: {
  properties: Property[];
  onReset: () => void;
  shortlisted?: string[];
  compared?: string[];
  onShortlist?: (property: Property) => void;
  onCompare?: (property: Property) => void;
}) {
  if (properties.length === 0) {
    return (
      <EmptyState
        icon="search-x"
        title="No property matches these filters"
        description="Widen the budget or clear a filter — new listings are added every week."
        action={
          <Button type="button" variant="outline" onClick={onReset}>
            Reset filters
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property, index) => (
        <Reveal key={property.id} delay={Math.min(index, MAX_STAGGER_STEPS) * STAGGER_STEP}>
          <PropertyDetailDrawer
            property={property}
            trigger={
              <PropertyCard
                property={property}
                isShortlisted={shortlisted.includes(property.id)}
                isCompared={compared.includes(property.id)}
                onShortlist={onShortlist}
                onCompare={onCompare}
              />
            }
          />
        </Reveal>
      ))}
    </div>
  );
}
