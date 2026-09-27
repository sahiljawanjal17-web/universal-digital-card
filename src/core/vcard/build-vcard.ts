/**
 * vCard 3.0 builder. The escaping, 75-octet line folding and CRLF endings that
 * iOS insists on come from the `vcard-creator` package — we do not hand-roll
 * them (docs/07-CONVENTIONS.md hard rule #4).
 *
 * Source: vcard-creator — https://github.com/joaocarmo/vcard-creator
 * License: MIT
 */
import VCard from 'vcard-creator';
import type { z } from 'zod';
import type { ContactSchema, ProfileSchema } from '@/config/schema/common.schema';
import type { RolePreset } from '@/config/schema/preset.schema';
import { buildWhatsAppChatLink } from '@/core/whatsapp/build-link';

type Profile = z.infer<typeof ProfileSchema>;
type Contact = z.infer<typeof ContactSchema>;

/** Honorifics that belong in the vCard `prefix` slot, not in the given name. */
const NAME_PREFIXES = ['dr.', 'dr', 'ca', 'adv.', 'adv', 'mr.', 'mrs.', 'ms.', 'shri', 'smt.'];

export interface NameParts {
  prefix: string;
  first: string;
  last: string;
}

/** "Dr. Ananya Sharma" → `{ prefix: 'Dr.', first: 'Ananya', last: 'Sharma' }`. */
export function splitName(full: string): NameParts {
  const parts = full.trim().split(/\s+/);
  let prefix = '';
  if (parts.length > 1 && NAME_PREFIXES.includes(parts[0].toLowerCase())) {
    prefix = parts.shift() ?? '';
  }
  const last = parts.length > 1 ? (parts.pop() ?? '') : '';
  return { prefix, first: parts.join(' '), last };
}

/** `/images/x.jpg` → `https://site/images/x.jpg`; absolute refs pass through. */
export function absoluteUrl(ref: string, baseUrl: string): string {
  if (/^https?:\/\//.test(ref)) return ref;
  if (!baseUrl) return '';
  return `${baseUrl.replace(/\/+$/, '')}${ref.startsWith('/') ? ref : `/${ref}`}`;
}

/** `Dr. Ananya Sharma` → `dr-ananya-sharma` for the .vcf filename. */
export function slugifyName(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'contact'
  );
}

export interface BuildVCardInput {
  profile: Profile;
  contact: Contact;
  preset: RolePreset;
  /** Absolute site origin; media refs and the URL field are resolved against it. */
  baseUrl?: string;
}

export interface BuiltVCard {
  content: string;
  filename: string;
}

export function buildVCard({
  profile,
  contact,
  preset,
  baseUrl = '',
}: BuildVCardInput): BuiltVCard {
  const { prefix, first, last } = splitName(profile.name);
  const card = new VCard();

  card.addName(last, first, '', prefix);
  // TODO(part-11): ORG once the data schema carries a distinct business name —
  // today `profile.name` is both the person and the practice.
  card.addJobtitle(preset.vcard.titleField === 'tagline' ? profile.tagline : profile.designation);
  card.addPhoneNumber(contact.whatsapp, 'PREF;CELL;VOICE');
  if (contact.phone !== contact.whatsapp) card.addPhoneNumber(contact.phone, 'WORK;VOICE');
  if (contact.altPhone) card.addPhoneNumber(contact.altPhone, 'WORK;VOICE');
  card.addEmail(contact.email, 'PREF;WORK');

  const address = contact.address;
  card.addAddress(
    '',
    '',
    [address.line1, address.line2].filter(Boolean).join(', '),
    address.city,
    address.state,
    address.pincode,
    address.country,
    'WORK',
  );

  const website = contact.website ?? baseUrl;
  if (website) card.addURL(website, 'WORK');

  card.addNote(`${profile.shortBio} Chat on WhatsApp: ${buildWhatsAppChatLink(contact.whatsapp)}`);

  // Media goes in as a URI rather than base64: a 100KB PHOTO line bloats every
  // download and Android/iOS both fetch URI photos fine for vCard 3.0.
  if (preset.vcard.includePhoto) {
    const photo = absoluteUrl(profile.avatar, baseUrl);
    if (photo) card.addPhotoURL(photo);
  }
  if (preset.vcard.includeLogo && profile.logo) {
    const logo = absoluteUrl(profile.logo, baseUrl);
    if (logo) card.addLogoURL(logo);
  }

  return { content: card.buildVCard(), filename: `${slugifyName(profile.name)}.vcf` };
}

export const VCARD_MIME = 'text/vcard; charset=utf-8';
