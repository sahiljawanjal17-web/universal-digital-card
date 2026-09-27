'use client';

import { useCallback, useState } from 'react';
import type { Property } from '../types';

const MAX_COMPARE = 3;

export interface CompareState {
  items: Property[];
  count: number;
  isCompared: (id: string) => boolean;
  toggle: (property: Property) => void;
  remove: (id: string) => void;
  clear: () => void;
  canAdd: boolean;
}

/**
 * R8 — in-memory compare tray. Max 3 properties. Intentionally NOT persisted
 * to localStorage: a compare session is ephemeral and the user resets it by
 * closing the tray or navigating away.
 */
export function useCompare(): CompareState {
  const [items, setItems] = useState<Property[]>([]);

  const isCompared = useCallback((id: string) => items.some((p) => p.id === id), [items]);

  const toggle = useCallback(
    (property: Property) => {
      setItems((prev) => {
        if (prev.some((p) => p.id === property.id)) {
          return prev.filter((p) => p.id !== property.id);
        }
        if (prev.length >= MAX_COMPARE) return prev; // silently ignore over-limit clicks
        return [...prev, property];
      });
    },
    [],
  );

  const remove = useCallback((id: string) => setItems((prev) => prev.filter((p) => p.id !== id)), []);

  const clear = useCallback(() => setItems([]), []);

  return {
    items,
    count: items.length,
    isCompared,
    toggle,
    remove,
    clear,
    canAdd: items.length < MAX_COMPARE,
  };
}

export { MAX_COMPARE };

