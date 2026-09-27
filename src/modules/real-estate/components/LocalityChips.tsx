'use client';

import { getIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { NearbyPlace } from '../types';

/**
 * R11 — distance chips derived from `property.nearby[]`. Icon comes from
 * `getIcon(place.type)` so the component stays data-driven.
 */
export function LocalityChips({
  nearby,
  className,
}: {
  nearby: NearbyPlace[];
  className?: string;
}) {
  if (nearby.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap gap-2', className)} aria-label="Nearby places">
      {nearby.map((place) => {
        const Icon = getIcon(place.type);
        return (
          <li
            key={`${place.type}-${place.name}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-caption text-fg-muted"
          >
            <Icon className="size-3.5 shrink-0 text-brand" strokeWidth={1.75} aria-hidden />
            <span className="font-medium">{place.name}</span>
            <span className="text-fg-subtle">{place.km} km</span>
          </li>
        );
      })}
    </ul>
  );
}

