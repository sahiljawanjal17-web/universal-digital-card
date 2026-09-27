'use client';

import { SectionShell } from './SectionShell';
import { StaggerGroup } from '@/components/motion';
import { EmptyState, IntentButton, PriceTag } from '@/components/shared';
import { getIcon } from '@/lib/icons';
import { useRole } from '@/lib/hooks/useRole';
import type { Service } from '@/config/schema/common.schema';

const SECTION = 'services';

/**
 * The offer grid. Every card is driven entirely by one `data.services[]` entry
 * — icon name, price, highlights and its own CTA intent — so a role changes
 * what is sold without this component knowing which role it is.
 */
export function Services() {
  const { data } = useRole();
  const services = data.services;

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Services"
      title="What I can help you with"
      subtitle={data.profile.tagline}
    >
      {services.length === 0 ? (
        <EmptyState
          icon="layout-grid"
          title="Services are being updated"
          description="Message on WhatsApp and I'll walk you through the options."
          action={
            <IntentButton
              intent={data.cta.primary.intent}
              label={data.cta.primary.label}
              section={SECTION}
              size="sm"
            />
          }
        />
      ) : (
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </StaggerGroup>
      )}
    </SectionShell>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = getIcon(service.icon);

  return (
    <article className="surface-card flex h-full flex-col gap-4 p-6 transition-shadow hover:shadow-md">
      <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon className="size-5" aria-hidden />
      </span>

      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-h3 text-fg">{service.title}</h3>
        <p className="text-body text-fg-muted">{service.description}</p>
      </div>

      {service.highlights.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {service.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 text-small text-fg-muted">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between gap-3">
          <PriceTag amount={service.priceFrom} unit={service.priceUnit} />
          {service.duration ? (
            <span className="text-caption text-fg-subtle">{service.duration}</span>
          ) : null}
        </div>
        <IntentButton
          intent={service.ctaIntent}
          label="Enquire"
          section={SECTION}
          size="sm"
          variant="outline"
          className="w-full"
          values={[['Service', service.title]]}
        />
      </div>
    </article>
  );
}
