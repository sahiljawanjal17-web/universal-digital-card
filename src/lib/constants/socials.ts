/**
 * The social networks `contact.socials` can carry. Keys come from
 * `SocialsSchema`, so this map is the one place a network name becomes a
 * label and a glyph — the footer and the social proof section share it.
 */
import { Facebook, Globe, Instagram, Linkedin, Youtube, type LucideIcon } from 'lucide-react';
import type { Contact } from '@/config/schema/common.schema';

export type SocialNetwork = keyof Contact['socials'];

export const SOCIAL_NETWORKS: Record<SocialNetwork, { label: string; icon: LucideIcon }> = {
  instagram: { label: 'Instagram', icon: Instagram },
  facebook: { label: 'Facebook', icon: Facebook },
  linkedin: { label: 'LinkedIn', icon: Linkedin },
  youtube: { label: 'YouTube', icon: Youtube },
  /** lucide ships no X / Justdial / Google Business glyph — neutral stand-in. */
  x: { label: 'X', icon: Globe },
  justdial: { label: 'Justdial', icon: Globe },
  googleBusiness: { label: 'Google Business', icon: Globe },
};

export type SocialLink = { network: SocialNetwork; label: string; icon: LucideIcon; url: string };

/** Non-empty handles only, in the schema's declaration order. */
export function getSocialLinks(socials: Contact['socials']): SocialLink[] {
  return (Object.keys(SOCIAL_NETWORKS) as SocialNetwork[])
    .filter((network) => socials[network] !== '')
    .map((network) => ({ network, ...SOCIAL_NETWORKS[network], url: socials[network] }));
}
