'use client';

import { useId } from 'react';
import { formatINRShort } from '@/lib/utils';
import type { Property } from '../types';

/**
 * Listing chooser shared by the calculators. Native `<select>` for the same
 * reason the sort control is one (PART-05 §9 decision 2): the Base UI select's
 * label API is unverified here, and the native control is better on mobile.
 */
export function PropertyPicker({
  properties,
  value,
  onChange,
  label = 'Property',
}: {
  properties: Property[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-caption font-medium uppercase tracking-wide text-fg-subtle">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-small text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {properties.map((property) => (
          <option key={property.id} value={property.id}>
            {property.title} — {formatINRShort(property.price)}
          </option>
        ))}
      </select>
    </div>
  );
}
