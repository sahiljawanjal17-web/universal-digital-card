'use client';

import { SectionShell } from './SectionShell';
import { BorderBeam, Reveal } from '@/components/motion';
import { IntentButton } from '@/components/shared';
import { useRole } from '@/lib/hooks/useRole';

const SECTION = 'ctaBanner';

/**
 * The mid-page conversion break. It carries `fabHide` so the floating dock
 * steps aside rather than covering the very buttons it duplicates.
 */
export function CtaBanner() {
  const { data } = useRole();
  const { profile, cta } = data;

  return (
    <SectionShell sectionKey={SECTION} fabHide innerClassName="gap-0">
      <Reveal>
        <div className="relative overflow-hidden rounded-xl bg-brand px-6 py-12 text-center shadow-lg sm:px-12 sm:py-16">
          <BorderBeam size={220} duration={14} />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            <h2 className="font-display text-h1 text-brand-fg text-balance">{profile.tagline}</h2>
            <p className="text-body-lg text-brand-fg/80 text-pretty">{profile.shortBio}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <IntentButton
                intent={cta.primary.intent}
                label={cta.primary.label}
                section={SECTION}
                variant="secondary"
              />
              <IntentButton
                intent={cta.secondary.intent}
                label={cta.secondary.label}
                section={SECTION}
                variant="outline"
                className="border-brand-fg/40 bg-transparent text-brand-fg hover:bg-brand-fg/10"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
