'use client';

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useRole } from '@/lib/hooks/useRole';
import { EVENTS } from './events';
import { configureAnalytics, track } from './track';

/**
 * Configures the dispatcher from `site.flags.analytics` and mounts the Vercel
 * collector. Rendered once, inside <RoleProvider>.
 */
export function AnalyticsProvider({ children }: { children?: React.ReactNode }) {
  const { site, role } = useRole();
  const enabled = site.flags.analytics;

  useEffect(() => {
    configureAnalytics({
      enabled,
      context: { role, locale: site.locale },
      debug: process.env.NODE_ENV !== 'production',
    });
    track(EVENTS.PAGE_VIEW);
  }, [enabled, role, site.locale]);

  return (
    <>
      {children}
      {enabled ? <Analytics /> : null}
    </>
  );
}
