'use client';

import { ExternalLink } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { IntentButton } from '@/components/shared';
import { SmartImage } from '@/components/media';
import { Reveal } from '@/components/motion';
import { cn, formatINR, formatINRShort } from '@/lib/utils';
import { getIcon } from '@/lib/icons';
import { propertyFields } from '../lib/wa-templates';
import type { Property } from '../types';
import { PropertySpecs } from './PropertySpecs';
import { ReraBadge } from './ReraBadge';
import { LocalityChips } from './LocalityChips';

const SECTION = 'propertyDetailDrawer';
const DETAIL_SIZES = '(min-width: 768px) 50vw, 95vw';
const MAX_SHOWN_AMENITIES = 8;

/**
 * Inner content panel of the property detail drawer. Kept separate so the
 * drawer shell stays under 200 lines (PropertyDetailDrawer.tsx handles open
 * state and the Drawer wrapper).
 */
export function PropertyDetailPanel({ property }: { property: Property }) {
  const isRent = property.listingFor === 'rent';
  const amenities = property.amenities.slice(0, MAX_SHOWN_AMENITIES);
  const extraAmenities = property.amenities.length - amenities.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Image carousel */}
      <div className="relative -mx-6 overflow-hidden">
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {property.images.map((src, i) => (
              <CarouselItem key={`${property.id}-detail-${i}`}>
                <div className="relative aspect-[16/9]">
                  <SmartImage src={src} alt={`${property.title} — photo ${i + 1}`} sizes={DETAIL_SIZES} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {property.images.length > 1 ? (
            <>
              <CarouselPrevious className="left-3" />
              <CarouselNext className="right-3" />
            </>
          ) : null}
        </Carousel>
      </div>

      {/* Price + heading */}
      <Reveal>
        <div className="flex flex-col gap-1">
          <span className="text-h2 font-display font-bold text-fg">
            {formatINRShort(property.price)}
            {isRent ? <span className="text-body text-fg-muted"> / month</span> : null}
          </span>
          <span className="text-small text-fg-subtle">{formatINR(property.price)}</span>
          <h2 className="mt-1 text-h3 font-semibold text-fg">{property.title}</h2>
        </div>
      </Reveal>

      {/* Specs row */}
      <PropertySpecs property={property} />

      {/* RERA */}
      <ReraBadge reraId={property.reraId} />

      {/* Details grid */}
      <Reveal>
        <dl className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface p-4 text-small sm:grid-cols-3">
          {[
            ['Type', property.type],
            ['Facing', property.facing],
            ['Age', property.ageYears === 0 ? 'New' : `${property.ageYears} yr`],
            ['Furnishing', property.furnishing === 'semi' ? 'Semi-furnished' : property.furnishing],
            ['Super built-up', `${property.superBuiltUp} sq.ft.`],
            ['₹/sq.ft.', property.pricePerSqft.toLocaleString('en-IN')],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <dt className="text-caption text-fg-subtle">{label}</dt>
              <dd className="font-medium capitalize text-fg">{value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* Possession */}
      <Reveal>
        <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-4 py-3">
          <span className="text-small text-fg-muted">Possession:</span>
          <span className={cn('text-small font-semibold', property.possession === 'ready' ? 'text-success' : 'text-warning')}>
            {property.possession === 'ready' ? 'Ready to Move' : property.possession}
          </span>
        </div>
      </Reveal>

      {/* Amenities */}
      {amenities.length > 0 ? (
        <Reveal>
          <h3 className="text-body font-semibold text-fg">Amenities</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {amenities.map((amenity) => {
              const Icon = getIcon(amenity);
              return (
                <li
                  key={amenity}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-caption text-fg-muted"
                >
                  <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
                  {amenity.replace(/-/g, ' ')}
                </li>
              );
            })}
            {extraAmenities > 0 ? (
              <li className="text-caption text-fg-subtle self-center">+{extraAmenities} more</li>
            ) : null}
          </ul>
        </Reveal>
      ) : null}

      {/* Nearby places */}
      {property.nearby.length > 0 ? (
        <Reveal>
          <h3 className="text-body font-semibold text-fg">Nearby</h3>
          <LocalityChips nearby={property.nearby} className="mt-2" />
        </Reveal>
      ) : null}

      {/* Floor plan */}
      {property.floorPlan ? (
        <Reveal>
          <h3 className="text-body font-semibold text-fg">Floor Plan</h3>
          <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-xl border border-border">
            <SmartImage src={property.floorPlan} alt={`${property.title} floor plan`} sizes="95vw" />
          </div>
        </Reveal>
      ) : null}

      {/* Virtual tour */}
      {property.tourUrl ? (
        <Reveal>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            render={<a href={property.tourUrl} target="_blank" rel="noopener noreferrer" />}
          >
            <ExternalLink className="size-4" aria-hidden />
            Watch Virtual Tour
          </Button>
        </Reveal>
      ) : null}
    </div>
  );
}

/** The 3 CTAs that always appear at the bottom of the detail panel. */
export function PropertyDetailCtas({ property }: { property: Property }) {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4">
      <IntentButton
        intent="property_inquiry"
        label="Enquire on WhatsApp"
        section={SECTION}
        className="w-full"
        values={propertyFields(property)}
      />
      <IntentButton
        intent="site_visit_book"
        label="Book a Site Visit"
        section={SECTION}
        variant="outline"
        className="w-full"
        values={propertyFields(property)}
      />
      <IntentButton
        intent="brochure_request"
        label="Get Brochure & Floor Plan"
        section={SECTION}
        variant="outline"
        className="w-full"
        values={propertyFields(property)}
      />
    </div>
  );
}

