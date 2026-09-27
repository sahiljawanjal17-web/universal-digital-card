/**
 * Google Maps deep links. The data's own `googleMapsUrl` wins when present
 * (it may be a short link an owner curated); lat/lng is the fallback.
 */
import type { z } from 'zod';
import type { AddressSchema } from '@/config/schema/common.schema';

type Address = z.infer<typeof AddressSchema>;

/** Directions from the user's current location to the business address. */
export function buildDirectionsUrl(address: Address): string {
  if (address.googleMapsUrl) return address.googleMapsUrl;
  const destination = encodeURIComponent(`${address.lat},${address.lng}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

/** A plain map pin, used where "directions" would be too aggressive. */
export function buildMapUrl(address: Address): string {
  const query = encodeURIComponent(`${address.lat},${address.lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** Embeddable map for an in-page iframe — never a link target. */
export function buildMapEmbedUrl(address: Address): string {
  const query = encodeURIComponent(`${address.lat},${address.lng}`);
  return `https://www.google.com/maps?q=${query}&z=15&output=embed`;
}

/** One-line postal address for vCards, WhatsApp messages and schema.org. */
export function formatAddress(address: Address): string {
  return [address.line1, address.line2, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(', ');
}
