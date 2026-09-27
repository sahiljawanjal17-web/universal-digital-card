'use client';

import { Heart, Scale } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartImage } from '@/components/media';
import { IntentButton } from '@/components/shared';
import { getIcon } from '@/lib/icons';
import { cn, formatINR, formatINRShort } from '@/lib/utils';
import { propertyFields } from '../lib/wa-templates';
import type { Property } from '../types';
import { PropertySpecs } from './PropertySpecs';
import { ReraBadge } from './ReraBadge';

const SECTION = 'propertyFilter';
const CARD_SIZES = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw';
const MAX_AMENITY_ICONS = 4;

/**
 * One listing. Shortlist and compare are wired by the parent so this stays a
 * presentational card — chunk 2 adds the tray and the ♡ persistence.
 */
export function PropertyCard({
  property,
  isShortlisted = false,
  isCompared = false,
  onShortlist,
  onCompare,
}: {
  property: Property;
  isShortlisted?: boolean;
  isCompared?: boolean;
  onShortlist?: (property: Property) => void;
  onCompare?: (property: Property) => void;
}) {
  const isRent = property.listingFor === 'rent';
  const amenities = property.amenities.slice(0, MAX_AMENITY_ICONS);
  const extraAmenities = property.amenities.length - amenities.length;

  return (
    <article className="surface-card flex h-full flex-col overflow-hidden p-0">
      <div className="relative">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent className="ml-0">
            {property.images.map((src, index) => (
              <CarouselItem key={`${property.id}-${index}`} className="pl-0">
                <div className="relative aspect-[4/3] w-full">
                  <SmartImage
                    src={src}
                    alt={`${property.title} — photo ${index + 1}`}
                    sizes={CARD_SIZES}
                  />
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

        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
          {property.featured ? <Badge>Featured</Badge> : null}
          <Badge variant="secondary">{isRent ? 'For rent' : 'For sale'}</Badge>
        </div>

        <Button
          type="button"
          size="icon"
          variant="secondary"
          aria-pressed={isShortlisted}
          aria-label={isShortlisted ? `Remove ${property.title} from shortlist` : `Shortlist ${property.title}`}
          className="absolute right-3 top-3 size-9 rounded-full"
          onClick={() => onShortlist?.(property)}
        >
          <Heart className={cn('size-4', isShortlisted && 'fill-brand text-brand')} aria-hidden />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-h3 font-display font-semibold text-fg">
              {formatINRShort(property.price)}
              {isRent ? <span className="text-small text-fg-muted"> / mo</span> : null}
            </span>
            <span className="text-caption text-fg-subtle">{formatINR(property.price)}</span>
          </div>
          <span className="text-caption text-fg-muted">
            ₹{property.pricePerSqft.toLocaleString('en-IN')} / sq.ft.
          </span>
        </div>

        <h3 className="text-body-lg font-medium text-fg">{property.title}</h3>
        <PropertySpecs property={property} />

        {amenities.length > 0 ? (
          <ul className="flex flex-wrap items-center gap-2" aria-label="Amenities">
            {amenities.map((amenity) => {
              const Icon = getIcon(amenity);
              return (
                <li
                  key={amenity}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2 py-1 text-caption text-fg-muted"
                >
                  <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
                  {amenity.replace(/-/g, ' ')}
                </li>
              );
            })}
            {extraAmenities > 0 ? (
              <li className="text-caption text-fg-subtle">+{extraAmenities} more</li>
            ) : null}
          </ul>
        ) : null}

        <ReraBadge reraId={property.reraId} />

        <div className="mt-auto flex items-center gap-2 pt-2">
          <IntentButton
            intent="property_inquiry"
            label="Enquire"
            section={SECTION}
            size="sm"
            className="h-10 flex-1 px-3"
            values={propertyFields(property)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={isCompared}
            className="h-10"
            onClick={() => onCompare?.(property)}
          >
            <Scale className="size-4" aria-hidden />
            Compare
          </Button>
        </div>
      </div>
    </article>
  );
}
