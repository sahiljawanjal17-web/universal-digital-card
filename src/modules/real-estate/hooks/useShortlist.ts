'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { buildWhatsAppLink, buildIntentMessage, openWhatsApp } from '@/core/whatsapp';
import { useRole } from '@/lib/hooks/useRole';
import { propertySummaryLine } from '../lib/wa-templates';
import type { Property } from '../types';

const STORAGE_KEY = 'sharma-realty:shortlist';
/** WhatsApp message budget: keep the body under 1800 chars for 10 properties. */
const MAX_CHARS = 1800;

export interface ShortlistState {
  ids: string[];
  items: Property[];
  count: number;
  isShortlisted: (id: string) => boolean;
  toggle: (property: Property) => void;
  clear: () => void;
  sendOnWhatsApp: () => void;
}

/**
 * R9 — localStorage-persisted shortlist. Survives page reloads and is shared
 * via a single hook so the bar, the cards and the navbar all read the same set.
 */
export function useShortlist(): ShortlistState {
  const { data } = useRole();
  const [ids, setIds] = useLocalStorage<string[]>(STORAGE_KEY, []);

  const allProperties = useMemo(() => {
    const m = data.module as { properties: Property[] };
    return m.properties ?? [];
  }, [data.module]);

  const items = useMemo(
    () => ids.map((id) => allProperties.find((p) => p.id === id)).filter(Boolean) as Property[],
    [ids, allProperties],
  );

  const isShortlisted = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (property: Property) => {
      setIds((prev) =>
        prev.includes(property.id) ? prev.filter((x) => x !== property.id) : [...prev, property.id],
      );
    },
    [setIds],
  );

  const clear = useCallback(() => setIds([]), [setIds]);

  const sendOnWhatsApp = useCallback(() => {
    if (items.length === 0) return;

    const lines = items.map((p, i) => `${i + 1}. ${propertySummaryLine(p)}`);
    // Trim lines until we fit within MAX_CHARS
    const header = `*My Shortlist* \u2665 (${items.length} ${items.length === 1 ? 'property' : 'properties'})\n\n`;
    const footer = `\nPlease share details & arrange visits.`;
    let body = lines.join('\n');

    // Keep trimming from the end until under budget
    let trimmed = lines;
    while (
      header.length + body.length + footer.length > MAX_CHARS &&
      trimmed.length > 1
    ) {
      trimmed = trimmed.slice(0, -1);
      body = trimmed.join('\n') + `\n…and ${lines.length - trimmed.length} more`;
    }

    const message = buildIntentMessage({
      intent: 'property_inquiry',
      business: data.profile.name,
      values: [],
      note: `${header}${body}${footer}`,
    });

    const link = buildWhatsAppLink({ phone: data.contact.whatsapp, message, source: 'shortlist' });
    openWhatsApp(link, { intent: 'property_inquiry', section: 'shortlistBar', label: 'shortlist' });
  }, [items, data]);

  return { ids, items, count: ids.length, isShortlisted, toggle, clear, sendOnWhatsApp };
}
