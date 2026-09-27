'use client';

import { Award, BadgeCheck, GraduationCap, ScrollText, Users, type LucideIcon } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { useDoctorModule } from '../hooks/useDoctorModule';
import type { CredentialKind } from '../types';

const SECTION = 'credentials';

const KIND_META: Record<CredentialKind, { icon: LucideIcon; label: string }> = {
  education: { icon: GraduationCap, label: 'Degree' },
  registration: { icon: BadgeCheck, label: 'Registration' },
  fellowship: { icon: ScrollText, label: 'Fellowship' },
  award: { icon: Award, label: 'Award' },
  membership: { icon: Users, label: 'Membership' },
};

/**
 * D13 — degrees, council registration and fellowships as a dated timeline,
 * from `module.credentials`. Sorted oldest-first so the career reads forward;
 * a stable sort keeps the data's order for entries in the same year.
 */
export function CredentialsTimeline() {
  const { module } = useDoctorModule();
  const credentials = [...module.credentials].sort((a, b) => a.year - b.year);

  if (credentials.length === 0) return null;

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Qualifications"
      title="Training & credentials"
      subtitle="Verified degrees, registration and specialist training."
    >
      <ol className="relative mx-auto flex max-w-2xl flex-col gap-6 border-l border-border pl-8">
        {credentials.map((credential) => {
          const { icon: Icon, label } = KIND_META[credential.kind];
          return (
            <li key={`${credential.year}-${credential.title}`} className="relative">
              <span className="absolute -left-12 top-0 flex size-8 items-center justify-center rounded-full border border-border bg-bg text-brand">
                <Icon className="size-4" aria-hidden />
              </span>
              <p className="text-small font-semibold text-brand">
                <time dateTime={String(credential.year)}>{credential.year}</time>
                <span className="text-fg-subtle"> · {label}</span>
              </p>
              <p className="font-medium text-fg">{credential.title}</p>
              {credential.institution && (
                <p className="text-small text-fg-muted">{credential.institution}</p>
              )}
            </li>
          );
        })}
      </ol>
    </SectionShell>
  );
}
