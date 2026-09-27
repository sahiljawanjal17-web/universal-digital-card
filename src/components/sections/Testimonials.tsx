'use client';

import { SectionShell } from './SectionShell';
import { Marquee } from '@/components/motion';
import { EmptyState, RatingStars } from '@/components/shared';
import { useRole } from '@/lib/hooks/useRole';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { averageRating } from '@/lib/reviews';
import { cn, formatDate } from '@/lib/utils';
import type { CommonData } from '@/config/schema/common.schema';

type Testimonial = CommonData['testimonials'][number];

const SECTION = 'testimonials';

const SOURCE_LABELS: Record<Testimonial['source'], string> = {
  google: 'Google review',
  facebook: 'Facebook review',
  justdial: 'JustDial review',
  direct: 'Shared directly',
};

/**
 * Social proof. Past three reviews it becomes a paused-on-hover marquee; with
 * reduced motion, or fewer reviews, it stays a plain grid that never moves.
 */
export function Testimonials() {
  const { data } = useRole();
  const items = data.testimonials;
  const reduced = useReducedMotion();
  const average = averageRating(items);
  const scrolls = !reduced && items.length > 3;

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Testimonials"
      title="What clients say"
      subtitle={
        average === null
          ? undefined
          : `${average.toFixed(1)} average across ${items.length} review${items.length === 1 ? '' : 's'}`
      }
      headingSlot={
        average === null ? undefined : (
          <RatingStars value={average} size={20} showValue count={5} />
        )
      }
      innerClassName={scrolls ? 'gap-8 overflow-hidden' : undefined}
    >
      {items.length === 0 ? (
        <EmptyState
          icon="message-square-quote"
          title="Reviews coming soon"
          description="The first ones land here as soon as they arrive."
        />
      ) : scrolls ? (
        <Marquee pauseOnHover className="[--duration:48s]">
          {items.map((item) => (
            <TestimonialCard key={`${item.name}-${item.date}`} item={item} className="w-80" />
          ))}
        </Marquee>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={`${item.name}-${item.date}`} className="h-full">
              <TestimonialCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}

function TestimonialCard({ item, className }: { item: Testimonial; className?: string }) {
  return (
    <figure
      className={cn('surface-card mx-1.5 flex h-full flex-col gap-4 p-6 text-left', className)}
    >
      <RatingStars value={item.rating} size={16} />
      <blockquote className="text-body text-fg-muted">&ldquo;{item.text}&rdquo;</blockquote>
      <figcaption className="mt-auto flex flex-col gap-0.5">
        <span className="text-body font-medium text-fg">{item.name}</span>
        {item.role ? <span className="text-small text-fg-subtle">{item.role}</span> : null}
        <span className="text-caption text-fg-subtle">
          {SOURCE_LABELS[item.source]} · {formatDate(item.date)}
        </span>
      </figcaption>
    </figure>
  );
}
