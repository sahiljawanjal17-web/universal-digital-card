'use client';

import { useMemo } from 'react';
import { SectionShell } from './SectionShell';
import { BeforeAfterSlider } from '@/components/media';
import { StaggerGroup } from '@/components/motion';
import { DisclaimerNote, EmptyState, IntentButton } from '@/components/shared';
import { buildBeforeAfterPairs } from '@/lib/before-after';
import { useRole } from '@/lib/hooks/useRole';

const SECTION = 'beforeAfter';

/**
 * Treatment results as draggable comparisons. The pairs are derived from
 * `data.gallery[]` (tagged `before`/`after`, else consecutive images), so a
 * role gets this section purely by shipping the right photos.
 */
export function BeforeAfter() {
  const { data } = useRole();
  const pairs = useMemo(() => buildBeforeAfterPairs(data.gallery), [data.gallery]);

  if (pairs.length === 0) {
    return (
      <SectionShell
        sectionKey={SECTION}
        eyebrow="Results"
        title="Before & after"
        tone="muted"
      >
        <EmptyState
          icon="sparkles"
          title="Result photos coming soon"
          description="Consented before and after photographs will be published here."
          action={
            <IntentButton
              intent={data.cta.primary.intent}
              label={data.cta.primary.label}
              section={SECTION}
              size="sm"
            />
          }
        />
      </SectionShell>
    );
  }

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Results"
      title="Before & after"
      subtitle="Drag the handle — or use the arrow keys — to compare."
      tone="muted"
    >
      <StaggerGroup className="grid gap-8 md:grid-cols-2">
        {pairs.map((pair) => (
          <figure key={pair.id} className="flex flex-col gap-3">
            <BeforeAfterSlider
              beforeSrc={pair.before.src}
              afterSrc={pair.after.src}
              beforeLabel="Before"
              afterLabel="After"
              ratio="4/3"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="surface-card overflow-hidden p-0"
            />
            <figcaption className="text-small text-fg-muted">{pair.after.alt}</figcaption>
          </figure>
        ))}
      </StaggerGroup>

      <DisclaimerNote>
        Photographs are published with patient consent. Results vary from person to person and are
        not a guarantee of outcome.
      </DisclaimerNote>
    </SectionShell>
  );
}
