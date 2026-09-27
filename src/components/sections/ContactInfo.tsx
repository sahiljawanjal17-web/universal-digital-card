'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { SectionShell } from './SectionShell';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion';
import { IntentButton } from '@/components/shared';
import { EVENTS, track } from '@/core/analytics';
import { getIcon } from '@/lib/icons';
import { useRole } from '@/lib/hooks/useRole';
import {
  buildDirectionsUrl,
  buildMapEmbedUrl,
  cn,
  formatAddress,
  formatPhone,
  toTelHref,
} from '@/lib/utils';
import { dayLabel, formatHourRange, getOpenState, orderedWeek, type OpenState } from '@/lib/hours';

const SECTION = 'clinicInfo';

/** Re-checks the clock every minute so the badge never goes stale on screen. */
function useOpenState(hours: Parameters<typeof getOpenState>[0]): OpenState | null {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const tick = () => setState(getOpenState(hours));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [hours]);

  return state;
}

/**
 * Where to find them and when. The open/closed badge is client-only on purpose
 * — rendering it on the server would bake a build-time clock into the HTML.
 */
export function ContactInfo() {
  const { data } = useRole();
  const { address, hours, phone } = data.contact;
  const state = useOpenState(hours);
  const [mapLoaded, setMapLoaded] = useState(false);
  const PinIcon = getIcon('map-pin');

  const copyAddress = async () => {
    await navigator.clipboard.writeText(formatAddress(address));
    toast.success('Address copied');
    track(EVENTS.CTA_CLICK, { section: SECTION, label: 'copy_address' });
  };

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Visit"
      title="Location & hours"
      tone="muted"
      fabHide
      headingSlot={state ? <OpenBadge state={state} /> : null}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-4">
          <div className="surface-card flex flex-col gap-4 p-6">
            <div className="flex items-start gap-3">
              <PinIcon className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
              <address className="text-body text-fg-muted not-italic">
                {formatAddress(address)}
              </address>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                className="h-10"
                onClick={() => track(EVENTS.CTA_CLICK, { section: SECTION, label: 'directions' })}
                render={
                  <a
                    href={buildDirectionsUrl(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Get directions
              </Button>
              <Button variant="outline" size="sm" className="h-10" onClick={copyAddress}>
                Copy address
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-10"
                render={<a href={toTelHref(phone)} />}
              >
                {formatPhone(phone)}
              </Button>
            </div>
          </div>

          <MapCard
            loaded={mapLoaded}
            onLoad={() => {
              setMapLoaded(true);
              track(EVENTS.CTA_CLICK, { section: SECTION, label: 'map_load' });
            }}
            src={buildMapEmbedUrl(address)}
            label={formatAddress(address)}
          />
        </Reveal>

        <Reveal delay={0.08} className="surface-card overflow-hidden p-0">
          <table className="w-full text-body">
            <caption className="sr-only">Opening hours, Indian Standard Time</caption>
            <tbody>
              {orderedWeek(hours).map((hour) => {
                const isToday = state?.today?.day === hour.day;
                return (
                  <tr key={hour.day} className={cn('border-b border-border last:border-0', isToday && 'bg-surface-2')}>
                    <th scope="row" className="px-5 py-3 text-left font-medium text-fg">
                      {dayLabel(hour.day)}
                    </th>
                    <td className="px-5 py-3 text-right text-fg-muted">{formatHourRange(hour)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="border-t border-border p-5">
            <IntentButton
              intent={data.cta.primary.intent}
              label={data.cta.primary.label}
              section={SECTION}
              className="w-full"
            />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

function OpenBadge({ state }: { state: OpenState }) {
  const tone = state.open ? 'bg-success/15 text-success' : state.onBreak ? 'bg-warning/15 text-warning' : 'bg-danger/10 text-danger';
  const label = state.open ? 'Open now' : state.onBreak ? 'On a break' : 'Closed';

  return (
    <span className={cn('inline-flex items-center gap-2 rounded-lg px-3 py-2 text-small font-medium', tone)}>
      <span aria-hidden className="size-2 rounded-full bg-current" />
      {label}
      <span className="font-normal opacity-80">· {state.detail}</span>
    </span>
  );
}

/** The iframe only mounts on click — an embedded map is a third-party cost. */
function MapCard({
  loaded,
  onLoad,
  src,
  label,
}: {
  loaded: boolean;
  onLoad: () => void;
  src: string;
  label: string;
}) {
  if (loaded) {
    return (
      <iframe
        title={`Map showing ${label}`}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-64 w-full rounded-xl border border-border"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={onLoad}
      className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-2 text-fg-muted transition-colors hover:bg-surface-elevated"
    >
      <span className="text-body font-medium">Load map</span>
      <span className="text-small text-fg-subtle">Opens Google Maps inside this page</span>
    </button>
  );
}
