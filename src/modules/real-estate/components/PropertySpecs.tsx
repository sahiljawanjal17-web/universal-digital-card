import { getIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { Property } from '../types';

/**
 * The BHK · carpet area · floor · locality strip. Plots and commercial units
 * carry no BHK, so the row is derived rather than fixed.
 */
export function PropertySpecs({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const specs: { icon: string; label: string }[] = [
    ...(property.bhk > 0 ? [{ icon: 'bed-double', label: `${property.bhk} BHK` }] : []),
    ...(property.bathrooms > 0 ? [{ icon: 'bath', label: `${property.bathrooms} Bath` }] : []),
    { icon: 'ruler', label: `${property.carpetArea} sq.ft.` },
    ...(property.totalFloors > 1
      ? [{ icon: 'building-2', label: `Floor ${property.floor} / ${property.totalFloors}` }]
      : []),
    { icon: 'map-pin', label: `${property.locality}, ${property.city}` },
  ];

  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
      {specs.map((spec) => {
        const Icon = getIcon(spec.icon);
        return (
          <li key={spec.label} className="inline-flex items-center gap-1.5 text-small text-fg-muted">
            <Icon className="size-4 shrink-0 text-fg-subtle" strokeWidth={1.75} aria-hidden />
            {spec.label}
          </li>
        );
      })}
    </ul>
  );
}
