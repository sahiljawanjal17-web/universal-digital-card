'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRole } from '@/lib/hooks/useRole';
import { EVENTS, track } from '@/core/analytics';
import { buildVCard } from './build-vcard';
import { downloadVCard, vcardRouteHref } from './download';

/**
 * Builds the card from the resolved role config and exposes one `download()`.
 * `href` is the no-JS / long-press fallback and always points at the route.
 */
export function useVCard() {
  const { role, preset, data } = useRole();
  const [isDownloading, setIsDownloading] = useState(false);

  const card = useMemo(
    () =>
      buildVCard({
        profile: data.profile,
        contact: data.contact,
        preset,
        baseUrl: typeof window === 'undefined' ? '' : window.location.origin,
      }),
    [data.profile, data.contact, preset],
  );

  const download = useCallback(() => {
    setIsDownloading(true);
    try {
      const method = downloadVCard({ ...card, role });
      track(EVENTS.VCARD_DOWNLOAD, { method, role });
    } finally {
      // Feedback only — the browser owns the download from here.
      window.setTimeout(() => setIsDownloading(false), 1200);
    }
  }, [card, role]);

  return { download, isDownloading, href: vcardRouteHref(role), filename: card.filename };
}
