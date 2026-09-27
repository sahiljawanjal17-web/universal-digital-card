'use client';

import { BeforeAfterSlider } from '@/components/media';
import { StaggerGroup } from '@/components/motion';
import { SectionShell } from '@/components/sections';
import { DisclaimerNote, IntentButton } from '@/components/shared';
import { useDoctorModule } from '../hooks/useDoctorModule';

const SECTION = 'beforeAfterGallery';

/**
 * D5 — treatment results from `module.beforeAfter`, whose pairs are explicit.
 * The universal `beforeAfter` section pairs `data.gallery[]` by position, which
 * would compare two clinic-interior photos here; the doctor preset swaps it
 * for this widget instead.
 */
export function BeforeAfterGallery() {
  const { module } = useDoctorModule();
  const cases = module.beforeAfter;

  if (cases.length === 0) return null;

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Results"
      title="Before & after"
      subtitle="Drag the handle — or use the arrow keys — to compare."
      tone="muted"
    >
      <StaggerGroup className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {cases.map((entry) => (
          <figure key={`${entry.before}-${entry.after}`} className="flex flex-col gap-3">
            <BeforeAfterSlider
              beforeSrc={entry.before}
              afterSrc={entry.after}
              beforeLabel="Before"
              afterLabel="After"
              ratio="4/3"
              slideMode="drag"
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="surface-card overflow-hidden p-0"
            />
            <figcaption className="text-small text-fg-muted">{entry.label}</figcaption>
          </figure>
        ))}
      </StaggerGroup>

      <div className="mt-8 flex flex-col items-center gap-4">
        <DisclaimerNote>Shared with patient consent. Results vary by individual.</DisclaimerNote>
        <IntentButton
          intent="appointment_book"
          label="Book an assessment"
          section={SECTION}
          values={[['Reason', 'Assessment (saw before & after results)']]}
        />
      </div>
    </SectionShell>
  );
}
