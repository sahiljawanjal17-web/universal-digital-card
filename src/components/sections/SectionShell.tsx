'use client';

import { useSectionView } from '@/core/analytics';
import { FAB_HIDE_ATTR } from '@/core/fab';
import { SectionHeading } from '@/components/shared';
import { Reveal } from '@/components/motion';
import { cn } from '@/lib/utils';

const TONES = {
  default: 'bg-bg',
  muted: 'bg-surface',
  raised: 'bg-surface-2',
} as const;

export type SectionTone = keyof typeof TONES;

/**
 * Every section on the page is exactly one of these: the anchor id, the page
 * gutter, the vertical rhythm, the heading and the `section_view` beacon all
 * live here so no section re-invents them.
 */
export function SectionShell({
  sectionKey,
  eyebrow,
  title,
  subtitle,
  align = 'start',
  tone = 'default',
  fabHide = false,
  className,
  innerClassName,
  headingSlot,
  children,
}: {
  /** Doubles as the DOM anchor (`#hero`) and the analytics section name. */
  sectionKey: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  align?: 'start' | 'center';
  tone?: SectionTone;
  /** Sections the FAB should step aside for (footer CTA, contact block). */
  fabHide?: boolean;
  className?: string;
  innerClassName?: string;
  /** Rendered to the right of the heading on desktop — a CTA or a filter row. */
  headingSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useSectionView<HTMLElement>(sectionKey);
  const headingId = title ? `${sectionKey}-heading` : undefined;

  return (
    <section
      ref={ref}
      id={sectionKey}
      aria-labelledby={headingId}
      className={cn('section-y scroll-mt-20', TONES[tone], className)}
      {...(fabHide ? { [FAB_HIDE_ATTR]: '' } : {})}
    >
      <div className={cn('container-page flex flex-col gap-8', innerClassName)}>
        {title ? (
          <Reveal
            className={cn(
              'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
              align === 'center' && 'sm:flex-col sm:items-center',
            )}
          >
            <SectionHeading
              id={headingId}
              eyebrow={eyebrow}
              title={title}
              subtitle={subtitle}
              align={align}
            />
            {headingSlot ? <div className="shrink-0">{headingSlot}</div> : null}
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}
