'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import { Container } from './Container';
import { IntentButton } from '@/components/shared';
import { useSectionView } from '@/core/analytics';
import { FAB_HIDE_ATTR } from '@/core/fab';
import { trackCta } from '@/core/analytics';
import { useRole } from '@/lib/hooks/useRole';
import { useNavSections } from '@/lib/hooks/useNavSections';
import { getSocialLinks } from '@/lib/constants/socials';
import { buildDirectionsUrl, formatAddress, formatPhone, toTelHref } from '@/lib/utils';

const SECTION = 'footer';

/**
 * Closing CTA + contact block. It carries `data-fab-hide`, so the floating
 * dock fades out once the footer's own buttons are on screen.
 */
export function Footer() {
  const ref = useSectionView<HTMLElement>(SECTION);
  const { data } = useRole();
  const { profile, contact, cta } = data;
  const sections = useNavSections();
  const socials = getSocialLinks(contact.socials);

  return (
    <footer
      ref={ref}
      id={SECTION}
      className="section-y border-t border-border bg-surface"
      {...{ [FAB_HIDE_ATTR]: '' }}
    >
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-5 rounded-xl border border-border bg-surface-elevated p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-h3 font-display text-balance text-fg">{profile.tagline}</p>
            <p className="text-small text-fg-muted">{profile.shortBio}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <IntentButton intent={cta.primary.intent} label={cta.primary.label} section={SECTION} />
            <IntentButton
              intent={cta.secondary.intent}
              label={cta.secondary.label}
              section={SECTION}
              variant="outline"
            />
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-3">
            <p className="text-small font-semibold text-fg">{profile.name}</p>
            <p className="text-small text-fg-muted">{profile.designation}</p>
            <p className="text-caption text-fg-subtle">
              Speaks {contact.address.city} · {profile.languages.join(', ')}
            </p>
          </div>

          <ul className="flex flex-col gap-2.5 text-small text-fg-muted">
            <li>
              <a
                href={toTelHref(contact.phone)}
                className="flex items-center gap-2 hover:text-fg"
                onClick={() => trackCta('call', SECTION)}
              >
                <Phone className="size-4 shrink-0" aria-hidden />
                {formatPhone(contact.phone)}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 hover:text-fg"
                onClick={() => trackCta('email', SECTION)}
              >
                <Mail className="size-4 shrink-0" aria-hidden />
                {contact.email}
              </a>
            </li>
            <li>
              <a
                href={buildDirectionsUrl(contact.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-fg"
                onClick={() => trackCta('directions', SECTION)}
              >
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{formatAddress(contact.address)}</span>
              </a>
            </li>
          </ul>

          <nav className="flex flex-col gap-2.5 text-small text-fg-muted">
            {sections.map((item) => (
              <a key={item.key} href={item.href} className="hover:text-fg">
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <p className="text-caption text-fg-subtle">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          {socials.length > 0 ? (
            <ul className="flex items-center gap-2">
              {socials.map(({ network, label, icon: Icon, url }) => (
                <li key={network}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-lg border border-border text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
                    onClick={() => trackCta(label, SECTION)}
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
