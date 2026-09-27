/**
 * Human labels for the universal section keys — used by the navbar, the mobile
 * menu and the ⌘K palette. Keyed by SECTION_KEYS so a new key cannot be added
 * without a label.
 */
import type { SectionKey } from './sections';

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: 'Home',
  quickActions: 'Quick actions',
  trustStrip: 'Credentials',
  stats: 'Numbers',
  about: 'About',
  credentials: 'Qualifications',
  services: 'Services',
  gallery: 'Gallery',
  beforeAfter: 'Results',
  clinicInfo: 'Visit us',
  ctaBanner: 'Get started',
  socialFeed: 'Social',
  testimonials: 'Reviews',
  faq: 'FAQ',
  leadForm: 'Enquire',
  footer: 'Contact',
};

/** The subset worth putting in the navbar — the rest are structural. */
export const NAV_SECTION_KEYS: readonly SectionKey[] = [
  'about',
  'services',
  'gallery',
  'beforeAfter',
  'testimonials',
  'clinicInfo',
  'faq',
];
