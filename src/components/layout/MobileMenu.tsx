'use client';

import { useState } from 'react';
import { Menu, Phone } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { IntentButton } from '@/components/shared';
import { trackCta } from '@/core/analytics';
import { useRole } from '@/lib/hooks/useRole';
import type { NavSection } from '@/lib/hooks/useNavSections';
import { formatPhone, toTelHref } from '@/lib/utils';

const SECTION = 'mobileMenu';

/** The navbar's small-screen half: same section list, thumb-sized targets. */
export function MobileMenu({ sections }: { sections: NavSection[] }) {
  const { data } = useRole();
  const { profile, contact, cta } = data;
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-lg" aria-label="Open menu" className="lg:hidden">
            <Menu className="size-5" aria-hidden />
          </Button>
        }
      />
      <SheetContent side="right" className="flex w-[min(20rem,85vw)] flex-col gap-6">
        <SheetHeader>
          <SheetTitle className="text-h3 font-display text-fg">{profile.name}</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1">
          {sections.map((item) => (
            <SheetClose
              key={item.key}
              render={
                <a
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-body text-fg-muted transition-colors hover:bg-surface hover:text-fg"
                  onClick={() => trackCta(item.label, SECTION, { target: item.key })}
                >
                  {item.label}
                </a>
              }
            />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <IntentButton
            intent={cta.primary.intent}
            label={cta.primary.label}
            section={SECTION}
            className="w-full"
          />
          <a
            href={toTelHref(contact.phone)}
            className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-small text-fg-muted transition-colors hover:bg-surface hover:text-fg"
            onClick={() => trackCta('call', SECTION)}
          >
            <Phone className="size-4" aria-hidden />
            {formatPhone(contact.phone)}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
