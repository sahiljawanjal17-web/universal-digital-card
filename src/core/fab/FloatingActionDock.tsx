'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, MessageCircle, Phone, Siren } from 'lucide-react';
import { Dock, DockIcon } from '@/components/motion';
import { useRole } from '@/lib/hooks/useRole';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { EVENTS, track } from '@/core/analytics';
import { openIntent } from '@/core/whatsapp';
import { buildDirectionsUrl } from '@/lib/utils/maps';
import { toTelHref } from '@/lib/utils/phone';
import { FabAction, type FabActionItem } from './FabAction';
import { useFabVisibility } from './useFabVisibility';

const PULSE_KEY = 'fab-pulse-shown';
const PULSE_DELAY_MS = 8_000;

/**
 * Structural read, not a role check: any module block may expose an
 * `emergency` object, and only the preset decides whether it is rendered.
 */
function readEmergencyPhone(module: unknown): string | null {
  if (typeof module !== 'object' || module === null) return null;
  const emergency = (module as Record<string, unknown>).emergency;
  if (typeof emergency !== 'object' || emergency === null) return null;
  const { enabled, number } = emergency as Record<string, unknown>;
  return enabled === true && typeof number === 'string' ? number : null;
}

/**
 * C2 — the always-reachable contact bar, as a bottom-right rail. Below `lg`
 * the phone gets <StickyBottomBar/> instead, so the two never stack.
 * Spec: docs/04-DESIGN-SYSTEM.md §7.
 */
export function FloatingActionDock() {
  const { preset, data, role } = useRole();
  const visible = useFabVisibility();
  const reducedMotion = useReducedMotion();
  const [pulsing, setPulsing] = useState(false);

  const emergencyPhone = readEmergencyPhone((data as { module?: unknown }).module);

  useEffect(() => {
    if (!preset.fab.whatsapp || reducedMotion) return;
    if (sessionStorage.getItem(PULSE_KEY)) return;
    const timer = window.setTimeout(() => {
      setPulsing(true);
      sessionStorage.setItem(PULSE_KEY, '1');
      window.setTimeout(() => setPulsing(false), 6_000);
    }, PULSE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [preset.fab.whatsapp, reducedMotion]);

  const actions = useMemo<FabActionItem[]>(() => {
    const { contact, profile } = data;
    const list: FabActionItem[] = [];

    if (preset.fab.whatsapp) {
      list.push({
        key: 'whatsapp',
        label: 'Chat on WhatsApp',
        icon: MessageCircle,
        tone: 'brand',
        onClick: () => {
          setPulsing(false);
          track(EVENTS.FAB_ACTION, { action: 'whatsapp', role });
          openIntent({
            phone: contact.whatsapp,
            intent: 'general_inquiry',
            business: profile.name,
            source: 'fab',
            section: 'fab',
          });
        },
      });
    }

    if (preset.fab.call) {
      list.push({
        key: 'call',
        label: 'Call now',
        icon: Phone,
        tone: 'accent',
        href: toTelHref(contact.phone),
        onClick: () => track(EVENTS.FAB_ACTION, { action: 'call', role }),
      });
    }

    if (preset.fab.directions) {
      list.push({
        key: 'directions',
        label: 'Get directions',
        icon: MapPin,
        tone: 'accent',
        href: buildDirectionsUrl(contact.address),
        onClick: () => track(EVENTS.FAB_ACTION, { action: 'directions', role }),
      });
    }

    if (preset.fab.emergency && emergencyPhone) {
      list.push({
        key: 'emergency',
        label: 'Emergency call',
        icon: Siren,
        tone: 'danger',
        href: toTelHref(emergencyPhone),
        onClick: () => track(EVENTS.FAB_ACTION, { action: 'emergency', role }),
      });
    }

    return list;
  }, [data, preset.fab, emergencyPhone, role]);

  if (actions.length === 0) return null;

  return (
    <motion.div
      aria-label="Quick contact actions"
      className="pointer-events-none fixed right-6 bottom-6 hidden justify-end lg:flex"
      style={{
        zIndex: 'var(--z-fab)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)',
      }}
      initial={false}
      animate={{ y: visible ? 0 : '140%', opacity: visible ? 1 : 0 }}
      transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 32 }}
    >
      <Dock
        iconSize={48}
        disableMagnification
        className="pointer-events-auto mt-0 h-auto rounded-full shadow-lg md:flex-col"
      >
        {actions.map((action) => (
          <DockIcon key={action.key} className="hover:bg-transparent">
            <FabAction
              action={action}
              withTooltip
              pulsing={pulsing && action.key === 'whatsapp'}
              className="size-11"
            />
          </DockIcon>
        ))}
      </Dock>
    </motion.div>
  );
}
