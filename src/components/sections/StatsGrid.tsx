'use client';

import { SectionShell } from './SectionShell';
import { NumberTicker, StaggerGroup } from '@/components/motion';
import { EmptyState } from '@/components/shared';
import { useRole } from '@/lib/hooks/useRole';

const SECTION = 'stats';

/** Counters from `data.trust.stats` — the number animates once, on entry. */
export function StatsGrid() {
  const { data } = useRole();
  const { stats } = data.trust;

  return (
    <SectionShell sectionKey={SECTION} tone="raised">
      {stats.length === 0 ? (
        <EmptyState
          icon="activity"
          title="No numbers yet"
          description="Add entries to trust.stats in this role's data file."
        />
      ) : (
        <StaggerGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface px-4 py-6 text-center"
            >
              <span className="text-h1 font-display text-brand">
                <NumberTicker value={stat.value} />
                {stat.suffix}
              </span>
              <span className="text-small text-fg-muted">{stat.label}</span>
            </div>
          ))}
        </StaggerGroup>
      )}
    </SectionShell>
  );
}
