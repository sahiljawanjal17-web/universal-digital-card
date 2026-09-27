'use client';

import { useMemo } from 'react';
import {
  Download,
  Hash,
  MessageCircle,
  Phone,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useVCard } from '@/core/vcard';
import { openIntent } from '@/core/whatsapp';
import { useRole } from '@/lib/hooks/useRole';
import { useNavSections } from '@/lib/hooks/useNavSections';
import { toTelHref } from '@/lib/utils';

export type CommandItem = {
  id: string;
  label: string;
  group: 'section' | 'action';
  icon: LucideIcon;
  run: () => void;
};

/**
 * What the palette can do, assembled from the resolved config only. Kept out
 * of the palette component so the dialog stays presentation and this stays
 * the single description of the role's available commands.
 */
export function useCommandItems(): CommandItem[] {
  const { data } = useRole();
  const sections = useNavSections();
  const { download } = useVCard();

  return useMemo(() => {
    const { contact, profile, cta } = data;

    const jumpTo = (href: string) => () => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const chat = (intent: typeof cta.primary.intent, section: string) => () => {
      openIntent({
        phone: contact.whatsapp,
        intent,
        business: profile.name,
        source: 'commandPalette',
        section,
      });
    };

    const items: CommandItem[] = sections.map((section) => ({
      id: `section:${section.key}`,
      label: section.label,
      group: 'section',
      icon: Hash,
      run: jumpTo(section.href),
    }));

    for (const [name, action] of [
      ['primary', cta.primary],
      ['secondary', cta.secondary],
    ] as const) {
      items.push({
        id: `cta:${name}`,
        label: action.label,
        group: 'action',
        icon: action.intent === 'vcard_download' ? Download : Sparkles,
        run: action.intent === 'vcard_download' ? download : chat(action.intent, 'commandPalette'),
      });
    }

    items.push(
      {
        id: 'action:call',
        label: 'Call now',
        group: 'action',
        icon: Phone,
        run: () => {
          window.location.href = toTelHref(contact.phone);
        },
      },
      {
        id: 'action:whatsapp',
        label: 'Chat on WhatsApp',
        group: 'action',
        icon: MessageCircle,
        run: chat('general_inquiry', 'commandPalette'),
      },
      {
        id: 'action:vcard',
        label: 'Save contact',
        group: 'action',
        icon: Download,
        run: download,
      },
    );

    // A role whose primary CTA already is "save contact" would list it twice.
    return items.filter(
      (item, index) => items.findIndex((other) => other.label === item.label) === index,
    );
  }, [data, sections, download]);
}
