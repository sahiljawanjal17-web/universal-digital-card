'use client';

import { useEffect, useState } from 'react';
import { Container } from './Container';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';
import { CommandPaletteTrigger } from './CommandPaletteTrigger';
import { IntentButton } from '@/components/shared';
import { SmartImage } from '@/components/media';
import { trackCta } from '@/core/analytics';
import { useRole } from '@/lib/hooks/useRole';
import { useNavSections } from '@/lib/hooks/useNavSections';
import { cn } from '@/lib/utils';

const SECTION = 'navbar';

/** Sticky, translucent, and it grows a hairline + shadow once the page moves. */
export function Navbar() {
  const { data } = useRole();
  const { profile, cta } = data;
  const sections = useNavSections();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-(--z-header) transition-shadow supports-backdrop-filter:bg-bg/70 supports-backdrop-filter:backdrop-blur-md',
        scrolled ? 'border-b border-border bg-bg/95 shadow-sm' : 'bg-bg/80',
      )}
    >
      <Container as="nav" className="flex h-16 items-center justify-between gap-4">
        <a
          href="#hero"
          className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          onClick={() => trackCta('logo', SECTION)}
        >
          {profile.logo ? (
            <span className="relative size-8 shrink-0 overflow-hidden rounded-lg">
              <SmartImage src={profile.logo} alt="" sizes="32px" />
            </span>
          ) : null}
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-body font-display font-semibold text-fg">
              {profile.name}
            </span>
            <span className="truncate text-caption text-fg-subtle">{profile.designation}</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {sections.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                className="rounded-lg px-3 py-2 text-small text-fg-muted transition-colors hover:bg-surface hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                onClick={() => trackCta(item.label, SECTION, { target: item.key })}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <CommandPaletteTrigger />
          <ThemeToggle />
          <div className="hidden sm:block">
            <IntentButton
              intent={cta.primary.intent}
              label={cta.primary.label}
              section={SECTION}
              size="sm"
              className="h-9 px-4 text-small"
            />
          </div>
          <MobileMenu sections={sections} />
        </div>
      </Container>
    </header>
  );
}
