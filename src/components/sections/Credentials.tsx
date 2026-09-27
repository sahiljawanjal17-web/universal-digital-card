'use client';

import { SectionShell } from './SectionShell';
import { StaggerGroup } from '@/components/motion';
import { EmptyState, TrustBadge } from '@/components/shared';
import { getIcon } from '@/lib/icons';
import { useRole } from '@/lib/hooks/useRole';

const SECTION = 'credentials';

/**
 * Proof of licence. The registration number leads, then the badges, then the
 * bodies this professional is registered with as a plain vertical timeline —
 * every value comes from `data.trust`, nothing is written into this file.
 */
export function Credentials() {
  const { data } = useRole();
  const { badges, registrationId, associations } = data.trust;
  const AssociationIcon = getIcon('badge-check');

  if (!registrationId && associations.length === 0 && badges.length === 0) {
    return (
      <SectionShell sectionKey={SECTION} eyebrow="Credentials" title="Verified & registered">
        <EmptyState
          icon="badge-check"
          title="Credentials coming soon"
          description="Registration details will be published here."
        />
      </SectionShell>
    );
  }

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Credentials"
      title="Verified & registered"
      subtitle={registrationId ? `Registration ${registrationId}` : undefined}
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {badges.length > 0 ? (
          <StaggerGroup className="flex flex-col gap-3">
            {badges.map((badge) => (
              <TrustBadge key={badge.label} {...badge} className="w-full justify-start" />
            ))}
          </StaggerGroup>
        ) : null}

        {associations.length > 0 ? (
          <ol className="relative flex flex-col gap-6 border-l border-border pl-6">
            {associations.map((name) => (
              <li key={name} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[33px] flex size-6 items-center justify-center rounded-full bg-brand text-brand-fg"
                >
                  <AssociationIcon className="size-3.5" />
                </span>
                <p className="text-body font-medium text-fg">{name}</p>
                <p className="text-small text-fg-subtle">Member in good standing</p>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </SectionShell>
  );
}
