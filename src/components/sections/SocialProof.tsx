'use client';

import { SectionShell } from './SectionShell';
import { StaggerGroup } from '@/components/motion';
import { EmptyState, IntentButton, RatingStars } from '@/components/shared';
import { trackCta } from '@/core/analytics';
import { getSocialLinks } from '@/lib/constants/socials';
import { averageRating } from '@/lib/reviews';
import { useRole } from '@/lib/hooks/useRole';

const SECTION = 'socialFeed';

/**
 * Outbound social links, never an embed: a third-party feed script would cost
 * more than the page's whole JS budget and would leak the visitor to the
 * network. Handles come from `contact.socials`, the summary from `trust`.
 */
export function SocialProof() {
  const { data } = useRole();
  const links = getSocialLinks(data.contact.socials);
  const rating = averageRating(data.testimonials);
  const stat = data.trust.stats[0] ?? null;

  if (links.length === 0) {
    return (
      <SectionShell sectionKey={SECTION} eyebrow="Follow" title="Latest from social">
        <EmptyState
          icon="camera"
          title="Social profiles coming soon"
          description="Instagram, Facebook and Google listings will be linked here."
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
      eyebrow="Follow"
      title="Latest from social"
      subtitle="New work goes up here first."
    >
      {rating !== null || stat !== null ? (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl bg-surface-2 px-4 py-3">
          {rating !== null ? (
            <span className="flex items-center gap-2">
              <RatingStars value={rating} showValue />
              <span className="text-small text-fg-muted">
                {data.testimonials.length} reviews
              </span>
            </span>
          ) : null}
          {stat !== null ? (
            <p className="text-small text-fg-muted">
              <span className="font-display font-semibold text-fg">
                {stat.value}
                {stat.suffix}
              </span>{' '}
              {stat.label}
            </p>
          ) : null}
        </div>
      ) : null}

      <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(({ network, label, icon: Icon, url }) => (
          <a
            key={network}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCta(label, SECTION, { network })}
            className="surface-card flex items-center gap-4 transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-fg">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-body font-medium text-fg">{label}</span>
              <span className="truncate text-caption text-fg-subtle">Open profile</span>
            </span>
          </a>
        ))}
      </StaggerGroup>
    </SectionShell>
  );
}
