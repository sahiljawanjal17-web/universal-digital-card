'use client';

import { SectionShell } from './SectionShell';
import { AspectBox, SmartImage } from '@/components/media';
import { Reveal } from '@/components/motion';
import { IntentButton } from '@/components/shared';
import { useRole } from '@/lib/hooks/useRole';

const SECTION = 'about';

/**
 * The long-form introduction: portrait on one side, `profile.longBio` on the
 * other, with the two facts a visitor scans for (years in practice, languages
 * spoken) pulled out as their own chips.
 */
export function About() {
  const { data } = useRole();
  const { profile, cta } = data;
  const paragraphs = profile.longBio.split(/\n{2,}/).filter(Boolean);

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="About"
      title={profile.name}
      subtitle={profile.designation}
      tone="muted"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-12">
        <Reveal>
          <AspectBox ratio="4/5" className="shadow-md lg:sticky lg:top-24">
            <SmartImage
              src={profile.avatar}
              alt={`${profile.name}, ${profile.designation}`}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </AspectBox>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal delay={0.08} className="flex flex-col gap-4">
            {paragraphs.map((text, i) => (
              <p key={i} className="text-body-lg text-fg-muted">
                {text}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Fact label="Experience" value={`${profile.experienceYears}+ years`} />
              <Fact label="Speaks" value={profile.languages.join(' · ')} />
            </dl>
          </Reveal>

          <Reveal delay={0.24} className="flex flex-wrap gap-3">
            <IntentButton
              intent={cta.primary.intent}
              label={cta.primary.label}
              section={SECTION}
            />
            <IntentButton
              intent={cta.secondary.intent}
              label={cta.secondary.label}
              section={SECTION}
              variant="outline"
            />
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card flex flex-col gap-1 p-4">
      <dt className="text-caption tracking-wide text-fg-subtle uppercase">{label}</dt>
      <dd className="font-display text-h3 text-fg">{value}</dd>
    </div>
  );
}
