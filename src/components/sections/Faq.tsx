'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SectionShell } from './SectionShell';
import { EmptyState, IntentButton } from '@/components/shared';
import { EVENTS, track } from '@/core/analytics';
import { useRole } from '@/lib/hooks/useRole';

const SECTION = 'faq';

/**
 * Objection handling, plus the `FAQPage` structured data Google needs to show
 * these answers directly in search results. Both read the same `data.faq[]`.
 */
export function Faq() {
  const { data } = useRole();
  const items = data.faq;

  if (items.length === 0) {
    return (
      <SectionShell sectionKey={SECTION} eyebrow="FAQ" title="Questions & answers">
        <EmptyState
          icon="circle-help"
          title="No questions listed yet"
          description="Ask on WhatsApp and you'll get an answer the same day."
          action={
            <IntentButton
              intent={data.cta.primary.intent}
              label="Ask a question"
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
      eyebrow="FAQ"
      title="Questions & answers"
      tone="muted"
      innerClassName="max-w-3xl"
    >
      <script
        type="application/ld+json"
        // Structured data is generated from the same array rendered below.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(items)) }}
      />

      <Accordion className="surface-card divide-y divide-border px-5">
        {items.map((item, index) => (
          <AccordionItem key={item.q} value={`faq-${index}`} className="border-b-0">
            <AccordionTrigger
              className="py-4 text-body font-medium text-fg"
              onClick={() => track(EVENTS.CTA_CLICK, { section: SECTION, question: item.q })}
            >
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-body text-fg-muted">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionShell>
  );
}

function buildFaqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
