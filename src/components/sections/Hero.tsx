'use client';

import { MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { AspectBox, SmartImage, VideoHero } from '@/components/media';
import { BorderBeam, NumberTicker, Reveal } from '@/components/motion';
import { IntentButton, RatingStars } from '@/components/shared';
import { useSectionView } from '@/core/analytics';
import { useRole } from '@/lib/hooks/useRole';
import { averageRating } from '@/lib/reviews';

const SECTION = 'hero';

/**
 * Split hero: copy left, portrait right, stacked on mobile with the media
 * first. The portrait is the LCP element, so it is `priority` and its box is
 * reserved by <AspectBox>.
 */
export function Hero() {
  const ref = useSectionView<HTMLElement>(SECTION);
  const { data } = useRole();
  const { profile, contact, trust, cta, testimonials } = data;
  const rating = averageRating(testimonials);
  const featured = trust.stats[0];

  return (
    <section ref={ref} id={SECTION} aria-labelledby="hero-heading" className="section-y scroll-mt-20">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <Reveal className="order-2 flex flex-col items-start gap-5 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-caption font-medium text-fg-muted">
            <ShieldCheck className="size-3.5 text-brand" aria-hidden />
            {profile.designation}
          </span>

          <div className="flex flex-col gap-3">
            <h1 id="hero-heading" className="text-display font-display text-balance text-fg">
              {profile.name}
            </h1>
            <p className="text-body-lg text-pretty text-fg-muted">{profile.tagline}</p>
          </div>

          <p className="text-body text-pretty text-fg-subtle max-w-prose">{profile.shortBio}</p>

          <div className="flex flex-wrap items-center gap-3">
            <IntentButton
              intent={cta.primary.intent}
              label={cta.primary.label}
              section={SECTION}
              icon={<MessageCircle className="size-4" aria-hidden />}
            />
            <IntentButton
              intent={cta.secondary.intent}
              label={cta.secondary.label}
              section={SECTION}
              variant="outline"
            />
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-small text-fg-muted">
            <li className="flex items-center gap-1.5">
              <span className="font-semibold text-fg">{profile.experienceYears}+</span>
              years experience
            </li>
            {rating !== null ? (
              <li className="flex items-center gap-1.5">
                <RatingStars value={rating} size={14} showValue />
                <span>({testimonials.length})</span>
              </li>
            ) : null}
            <li className="flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              {contact.address.city}
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <div className="relative">
            {profile.coverVideo ? (
              <VideoHero
                src={profile.coverVideo}
                poster={profile.coverImage}
                ratio="4/5"
                ariaLabel={`${profile.name} — showreel`}
                className="shadow-lg"
              />
            ) : (
              <AspectBox ratio="4/5" className="shadow-lg">
                <SmartImage
                  src={profile.coverImage}
                  alt={`${profile.name}, ${profile.designation}`}
                  sizes="(min-width: 1024px) 480px, 100vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-bg/70 via-transparent to-transparent" />
              </AspectBox>
            )}

            <BorderBeam size={120} duration={10} className="rounded-xl" />

            {featured ? (
              <div className="absolute -bottom-4 left-4 flex flex-col rounded-xl border border-border bg-surface-elevated px-4 py-3 shadow-md sm:left-6">
                <span className="text-h3 font-display text-brand">
                  <NumberTicker value={featured.value} />
                  {featured.suffix}
                </span>
                <span className="text-caption text-fg-muted">{featured.label}</span>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
