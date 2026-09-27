'use client';

import { Scale, X } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { cn, formatINR, formatINRShort } from '@/lib/utils';
import type { CompareState } from '../hooks/useCompare';
import { MAX_COMPARE } from '../hooks/useCompare';
import type { Property } from '../types';

const COMPARE_ROWS: Array<{ label: string; key: (p: Property) => string }> = [
  { label: 'Price', key: (p) => formatINR(p.price) },
  { label: 'Price / sq.ft.', key: (p) => `₹${p.pricePerSqft.toLocaleString('en-IN')}` },
  { label: 'Carpet area', key: (p) => `${p.carpetArea} sq.ft.` },
  { label: 'BHK', key: (p) => (p.bhk ? `${p.bhk} BHK` : p.type) },
  { label: 'Bathrooms', key: (p) => `${p.bathrooms}` },
  { label: 'Floor', key: (p) => `${p.floor} / ${p.totalFloors}` },
  { label: 'Furnishing', key: (p) => (p.furnishing === 'semi' ? 'Semi-furnished' : p.furnishing) },
  { label: 'Possession', key: (p) => (p.possession === 'ready' ? 'Ready' : p.possession) },
  { label: 'RERA', key: (p) => p.reraId },
  { label: 'Locality', key: (p) => `${p.locality}, ${p.city}` },
  { label: 'Type', key: (p) => p.type },
];

function CompareTable({ items, onRemove }: { items: Property[]; onRemove: (id: string) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[28rem] border-separate border-spacing-0 text-small">
        <thead>
          <tr>
            <th className="w-28 border-b border-border pb-2 text-left text-caption text-fg-subtle">
              Feature
            </th>
            {items.map((p) => (
              <th key={p.id} className="border-b border-border pb-2 text-left">
                <div className="flex items-start justify-between gap-2 pr-2">
                  <span className="text-small font-semibold text-fg leading-tight">{formatINRShort(p.price)}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(p.id)}
                    className="mt-0.5 shrink-0 rounded p-0.5 text-fg-muted hover:text-danger"
                    aria-label={`Remove ${p.title} from compare`}
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </div>
                <span className="block text-caption font-medium text-fg-muted leading-snug">{p.title}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map(({ label, key }) => (
            <tr key={label} className="odd:bg-surface-2 even:bg-transparent">
              <td className="py-2 pr-3 text-caption text-fg-subtle">{label}</td>
              {items.map((p) => (
                <td key={p.id} className="py-2 pr-2 font-medium capitalize text-fg">
                  {key(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * R8 — sticky compare tray + Drawer with side-by-side table.
 * Max 3 items enforced in `useCompare`. Table is scrollable on mobile.
 */
export function CompareTray({
  state,
  className,
}: {
  state: CompareState;
  className?: string;
}) {
  const { items, count, clear, remove, canAdd } = state;

  if (count === 0) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-md',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Scale className="size-4 text-brand" aria-hidden />
        <span className="text-small font-semibold text-fg">
          {count} / {MAX_COMPARE} selected for compare
        </span>
        {!canAdd ? (
          <span className="rounded-full bg-warning/20 px-2 py-0.5 text-caption text-warning">
            Max 3 reached
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Drawer>
          <DrawerTrigger
            render={
              <Button type="button" size="sm" variant="outline" disabled={count < 2}>
                Compare
              </Button>
            }
          />
          <DrawerContent className="max-h-[90dvh] overflow-hidden">
            <DrawerHeader className="flex items-center justify-between border-b border-border px-6 py-4">
              <DrawerTitle className="text-h3 font-semibold text-fg">Compare Properties</DrawerTitle>
              <DrawerClose
                render={
                  <Button type="button" variant="ghost" size="icon">
                    <X className="size-5" aria-hidden />
                  </Button>
                }
              />
            </DrawerHeader>
            <div className="overflow-y-auto px-6 py-5">
              <CompareTable items={items} onRemove={remove} />
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <Button type="button" variant="ghost" onClick={clear}>
                Clear all
              </Button>
            </div>
          </DrawerContent>
        </Drawer>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clear}
          className="size-9 text-fg-muted hover:text-danger"
          aria-label="Clear compare"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

