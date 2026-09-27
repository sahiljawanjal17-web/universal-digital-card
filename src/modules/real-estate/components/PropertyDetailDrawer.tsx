'use client';

import { type ReactNode, useState } from 'react';
import { X } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import type { Property } from '../types';
import { PropertyDetailCtas, PropertyDetailPanel } from './PropertyDetailPanel';
import { BrochureGate } from './BrochureGate';
import { SiteVisitScheduler } from './SiteVisitScheduler';

/**
 * R12 — full property detail drawer. Triggered by clicking anywhere on a card.
 * Contains: image carousel, full specs, amenities, nearby, floor plan, virtual
 * tour link, RERA badge, and the three primary CTAs + site visit + brochure gate.
 *
 * Split into `PropertyDetailPanel` (inner content) to keep this file ≤200 lines.
 */
export function PropertyDetailDrawer({
  property,
  trigger,
}: {
  property: Property;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
      <DrawerTrigger render={<span className="contents" />}>{trigger}</DrawerTrigger>

      <DrawerContent
        className="flex max-h-dvh w-full flex-col overflow-hidden sm:ml-auto sm:max-w-[36rem]"
      >
        <DrawerHeader className="flex items-center justify-between border-b border-border px-6 py-4">
          <DrawerTitle className="text-h3 font-semibold text-fg">{property.title}</DrawerTitle>
          <DrawerClose
            render={
              <Button type="button" variant="ghost" size="icon" aria-label="Close detail panel">
                <X className="size-5" aria-hidden />
              </Button>
            }
          />
        </DrawerHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <PropertyDetailPanel property={property} />

          {/* Site visit scheduler */}
          <div className="mt-8 border-t border-border pt-6">
            <SiteVisitScheduler property={property} />
          </div>

          {/* Brochure gate */}
          <div className="mt-6">
            <BrochureGate property={property} />
          </div>
        </div>

        {/* Sticky CTA footer */}
        <div className="shrink-0 border-t border-border bg-surface px-6 py-4">
          <PropertyDetailCtas property={property} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
