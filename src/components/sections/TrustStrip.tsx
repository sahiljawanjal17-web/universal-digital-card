'use client';

import { SectionShell } from './SectionShell';
import { Marquee } from '@/components/motion';
import { TrustBadge } from '@/components/shared';
import { useRole } from '@/lib/hooks/useRole';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const SECTION = 'trustStrip';

/**
 * Credentials ticker. It scrolls only when there is enough to scroll and the
 * visitor has not asked for reduced motion — otherwise it is a plain wrap row.
 */
export function TrustStrip() {
  const { data } = useRole();
  const { badges, registrationId, associations } = data.trust;
  const reduced = useReducedMotion();

  if (badges.length === 0) return null;
  const scrolls = !reduced && badges.length > 3;

  return (
    <SectionShell sectionKey={SECTION} tone="default" innerClassName="gap-4">
      {scrolls ? (
        <Marquee pauseOnHover className="[--duration:32s]">
          {badges.map((badge) => (
            <TrustBadge key={badge.label} {...badge} className="mx-1.5" />
          ))}
        </Marquee>
      ) : (
        <ul className="flex flex-wrap items-center justify-center gap-3">
          {badges.map((badge) => (
            <li key={badge.label}>
              <TrustBadge {...badge} />
            </li>
          ))}
        </ul>
      )}

      {registrationId || associations.length > 0 ? (
        <p className="text-caption text-center text-fg-subtle">
          {[registrationId, ...associations].filter(Boolean).join(' · ')}
        </p>
      ) : null}
    </SectionShell>
  );
}
