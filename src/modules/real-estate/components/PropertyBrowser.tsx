'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { formatINRShort } from '@/lib/utils';
import { SORT_LABELS, SORT_KEYS, isSortKey } from '../lib/filter';
import { usePropertyFilter } from '../hooks/usePropertyFilter';
import { useShortlist } from '../hooks/useShortlist';
import { useCompare } from '../hooks/useCompare';
import { ActiveFilterChips, type ActiveFilter } from './FilterChips';
import { PropertyFilter, possessionLabel } from './PropertyFilter';
import { PropertyGrid } from './PropertyGrid';
import { ShortlistBar } from './ShortlistBar';
import { CompareTray } from './CompareTray';


const SECTION = 'propertyFilter';

/**
 * The whole browse experience: facets, the live count and the results grid.
 * Filter and grid share state through the URL, but they ship as one section so
 * the desktop sidebar can sit beside the results instead of above them.
 */
export function PropertyBrowser() {
  const state = usePropertyFilter();
  const shortlist = useShortlist();
  const compare = useCompare();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { results, all, criteria, sort, setFilter, toggleInList, reset } = state;

  const activeFilters: ActiveFilter[] = [
    ...(criteria.listingFor
      ? [
          {
            key: 'listingFor',
            label: criteria.listingFor === 'rent' ? 'For rent' : 'For sale',
            onRemove: () => setFilter({ listingFor: null }),
          },
        ]
      : []),
    ...(criteria.budget
      ? [
          {
            key: 'budget',
            label: `${formatINRShort(criteria.budget[0])} – ${formatINRShort(criteria.budget[1])}`,
            onRemove: () => setFilter({ budgetMin: null, budgetMax: null }),
          },
        ]
      : []),
    ...criteria.bhk
      .filter((bhk) => state.facets.bhkOptions.includes(bhk))
      .map((bhk) => ({
        key: `bhk-${bhk}`,
        label: bhk === Math.max(...state.facets.bhkOptions) ? `${bhk}+ BHK` : `${bhk} BHK`,
        onRemove: () => toggleInList('bhk', bhk),
      })),
    ...criteria.type.map((type) => ({
      key: `type-${type}`,
      label: type,
      onRemove: () => toggleInList('type', type),
    })),
    ...criteria.locality.map((locality) => ({
      key: `locality-${locality}`,
      label: locality,
      onRemove: () => toggleInList('locality', locality),
    })),
    ...(criteria.furnishing
      ? [
          {
            key: 'furnishing',
            label: criteria.furnishing === 'semi' ? 'Semi-furnished' : `${criteria.furnishing} furnished`,
            onRemove: () => setFilter({ furnishing: null }),
          },
        ]
      : []),
    ...(criteria.possession
      ? [
          {
            key: 'possession',
            label: possessionLabel(criteria.possession),
            onRemove: () => setFilter({ possession: null }),
          },
        ]
      : []),
    ...(criteria.areaMin !== null
      ? [
          {
            key: 'areaMin',
            label: `${criteria.areaMin}+ sq.ft.`,
            onRemove: () => setFilter({ areaMin: null }),
          },
        ]
      : []),
  ];

  const countLabel = `${results.length} of ${all.length} ${
    results.length === 1 ? 'property matches' : 'properties match'
  }`;

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Listings"
      title="Find your next address"
      subtitle="Filter by budget, locality and configuration — share the link and the same shortlist opens for whoever you send it to."
      tone="muted"
    >
      <div className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2">
            <PropertyFilter state={state} />
          </div>
        </aside>

        <div className="flex flex-col gap-5">
          {/* Shortlist bar — visible when ≥1 item shortlisted */}
          <ShortlistBar state={shortlist} />

          {/* Compare tray — visible when ≥1 item compared */}
          <CompareTray state={compare} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-body font-medium text-fg">
              {countLabel}
            </p>

            <div className="flex items-center gap-2">
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger
                  render={
                    <Button type="button" variant="outline" size="sm" className="h-10 lg:hidden">
                      <SlidersHorizontal className="size-4" aria-hidden />
                      Filters
                      {activeFilters.length > 0 ? ` (${activeFilters.length})` : ''}
                    </Button>
                  }
                />
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Filter properties</DrawerTitle>
                  </DrawerHeader>
                  <div className="overflow-y-auto px-4 pb-2">
                    <PropertyFilter state={state} onReset={() => setDrawerOpen(false)} />
                  </div>
                  <DrawerFooter className="flex-row gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={reset}>
                      Reset
                    </Button>
                    <DrawerClose
                      render={
                        <Button type="button" className="flex-1">
                          Show {results.length}
                        </Button>
                      }
                    />
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>

              <label className="flex items-center gap-2">
                <span className="sr-only">Sort properties</span>
                <select
                  value={sort}
                  onChange={(event) => {
                    if (isSortKey(event.target.value)) setFilter({ sort: event.target.value });
                  }}
                  className="h-10 rounded-lg border border-border bg-surface px-3 text-small text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {SORT_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {SORT_LABELS[key]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <ActiveFilterChips filters={activeFilters} onReset={reset} />
          <PropertyGrid
            properties={results}
            onReset={reset}
            shortlisted={shortlist.ids}
            compared={compare.items.map((p) => p.id)}
            onShortlist={shortlist.toggle}
            onCompare={compare.toggle}
          />
        </div>
      </div>
    </SectionShell>
  );
}
