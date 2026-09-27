'use client';

import { ContactRound, MessageCircle, Phone, Share2, type LucideIcon } from 'lucide-react';
import { SectionShell } from './SectionShell';
import { StaggerGroup } from '@/components/motion';
import { EVENTS, track, trackCta } from '@/core/analytics';
import { useShare } from '@/core/share';
import { useVCard } from '@/core/vcard';
import { openIntent } from '@/core/whatsapp';
import { useRole } from '@/lib/hooks/useRole';
import { formatPhone, toTelHref } from '@/lib/utils';

const SECTION = 'quickActions';

type Tile = {
  key: string;
  icon: LucideIcon;
  label: string;
  desc: string;
  href?: string;
  onClick?: () => void;
};

/** Save Contact · WhatsApp · Call · Share — 2x2 on phones, one row on desktop. */
export function QuickActions() {
  const { data } = useRole();
  const { profile, contact } = data;
  const { download, isDownloading } = useVCard();
  const { share } = useShare();

  const tiles: Tile[] = [
    {
      key: 'vcard',
      icon: ContactRound,
      label: isDownloading ? 'Saving…' : 'Save Contact',
      desc: 'Add to your phonebook',
      onClick: () => void download(),
    },
    {
      key: 'whatsapp',
      icon: MessageCircle,
      label: 'WhatsApp',
      desc: 'Chat, usually replies fast',
      onClick: () =>
        openIntent({
          phone: contact.whatsapp,
          intent: 'general_inquiry',
          business: profile.name,
          source: SECTION,
          section: SECTION,
        }),
    },
    {
      key: 'call',
      icon: Phone,
      label: 'Call',
      desc: formatPhone(contact.phone),
      href: toTelHref(contact.phone),
    },
    {
      key: 'share',
      icon: Share2,
      label: 'Share',
      desc: 'Send this card to someone',
      onClick: () => {
        track(EVENTS.SHARE_CLICK, { section: SECTION });
        void share();
      },
    },
  ];

  return (
    <SectionShell sectionKey={SECTION} tone="muted">
      <StaggerGroup className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {tiles.map((tile) => (
          <QuickActionTile key={tile.key} tile={tile} />
        ))}
      </StaggerGroup>
    </SectionShell>
  );
}

function QuickActionTile({ tile }: { tile: Tile }) {
  const { icon: Icon, label, desc, href, onClick } = tile;
  const body = (
    <>
      <Icon className="size-6 text-brand" strokeWidth={1.75} aria-hidden />
      <span className="flex flex-col gap-0.5">
        <span className="text-body font-medium text-fg">{label}</span>
        <span className="text-caption text-fg-subtle">{desc}</span>
      </span>
    </>
  );

  const classes =
    'surface-card flex h-full flex-col items-start gap-3 p-4 text-left transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={() => trackCta(label, SECTION, { action: tile.key })}
      >
        {body}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={() => {
        trackCta(label, SECTION, { action: tile.key });
        onClick?.();
      }}
    >
      {body}
    </button>
  );
}
