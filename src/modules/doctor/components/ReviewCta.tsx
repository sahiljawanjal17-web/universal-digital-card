'use client';

import { ExternalLink, Star } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { buttonVariants } from '@/components/ui/button';
import { trackCta } from '@/core/analytics';
import { cn } from '@/lib/utils';
import { useDoctorModule } from '../hooks/useDoctorModule';

const SECTION = 'reviewCta';
const LABEL = 'Write a Google review';

/**
 * D15 — asks treated patients for a Google review. The link is
 * `contact.socials.googleBusiness`; with no link in the data the section is
 * simply absent rather than pointing somewhere made up.
 */
export function ReviewCta() {
  const { reviewUrl, business } = useDoctorModule();

  if (!reviewUrl) return null;

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Visited us recently?"
      title="Share your experience"
      subtitle={`A short review helps other patients find ${business} — it takes under a minute.`}
    >
      <div className="surface-card mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-8 text-center">
        <span className="inline-flex items-center gap-1" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-6 fill-accent text-accent" strokeWidth={1.5} />
          ))}
        </span>
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCta(LABEL, SECTION)}
          className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}
        >
          {LABEL}
          <ExternalLink className="size-4" aria-hidden />
        </a>
        <p className="text-small text-fg-muted">Opens Google in a new tab.</p>
      </div>
    </SectionShell>
  );
}
