'use client';

import { useState } from 'react';
import { FileText, MessageCircle, Paperclip } from 'lucide-react';
import { SectionShell } from '@/components/sections';
import { DisclaimerNote, IntentButton } from '@/components/shared';
import { cn } from '@/lib/utils';
import { useDoctorModule } from '../hooks/useDoctorModule';

const SECTION = 'reportUpload';

const STEPS = [
  { icon: MessageCircle, text: 'Tap the button to open a WhatsApp chat with the clinic.' },
  { icon: Paperclip, text: 'Attach your X-ray, OPG or reports as photos or a PDF.' },
  { icon: FileText, text: 'The doctor reviews them and replies with next steps.' },
] as const;

/**
 * D10 — "send your reports before you visit". The files travel inside the
 * WhatsApp chat itself; this page never receives or stores them. Picking a
 * treatment (from `data.services`) tags the message so the right doctor
 * picks it up.
 */
export function ReportUploadCta() {
  const { services } = useDoctorModule();
  const [treatment, setTreatment] = useState<string | null>(null);

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Get a second opinion"
      title="Send your reports on WhatsApp"
      subtitle="Share old X-rays or reports and get advice before you book a visit."
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <ol className="grid gap-3 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, text }, index) => (
            <li key={text} className="surface-card flex items-start gap-3 px-4 py-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon className="size-4" aria-hidden />
              </span>
              <p className="text-small text-fg">
                <span className="sr-only">Step {index + 1}: </span>
                {text}
              </p>
            </li>
          ))}
        </ol>

        {services.length > 0 && (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-small font-medium text-fg-muted">
              The report is about (optional)
            </legend>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  aria-pressed={treatment === service.title}
                  onClick={() => setTreatment(treatment === service.title ? null : service.title)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-small transition-colors',
                    treatment === service.title
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-border text-fg hover:border-brand',
                  )}
                >
                  {service.title}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <IntentButton
          intent="general_inquiry"
          label="Send my reports"
          section={SECTION}
          values={[
            ['Enquiry', 'Report review'],
            ['Treatment', treatment ?? 'Not sure yet'],
          ]}
          className="mx-auto w-full sm:w-auto"
        />

        <DisclaimerNote>
          Reports are shared only inside your WhatsApp chat — nothing is uploaded to or stored on
          this website. Online review is not a substitute for an in-person examination.
        </DisclaimerNote>
      </div>
    </SectionShell>
  );
}
