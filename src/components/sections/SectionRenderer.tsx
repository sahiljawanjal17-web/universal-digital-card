import { resolveConfig } from '@/config';
import { SECTION_KEYS, type SectionKey } from '@/lib/constants/sections';
import { Footer } from '@/components/layout/Footer';
import { ModuleSlot } from './ModuleSlot';
import { Hero } from './Hero';
import { QuickActions } from './QuickActions';
import { TrustStrip } from './TrustStrip';
import { StatsGrid } from './StatsGrid';
import { About } from './About';
import { Credentials } from './Credentials';
import { Services } from './Services';
import { Gallery } from './Gallery';
import { BeforeAfter } from './BeforeAfter';
import { SocialProof } from './SocialProof';
import { ContactInfo } from './ContactInfo';
import { CtaBanner } from './CtaBanner';
import { Testimonials } from './Testimonials';
import { Faq } from './Faq';
import { LeadForm } from './LeadForm';

/**
 * The dispatcher. `preset.sections` is the page order, and this map is the
 * only place a section key becomes a component — no section may branch on the
 * role. It is a total map, so adding a key to `SECTION_KEYS` without wiring a
 * component here is a type error rather than a blank strip on the page.
 */
const SECTIONS: Record<SectionKey, React.ComponentType> = {
  hero: Hero,
  quickActions: QuickActions,
  trustStrip: TrustStrip,
  stats: StatsGrid,
  about: About,
  credentials: Credentials,
  services: Services,
  gallery: Gallery,
  beforeAfter: BeforeAfter,
  clinicInfo: ContactInfo,
  ctaBanner: CtaBanner,
  socialFeed: SocialProof,
  testimonials: Testimonials,
  faq: Faq,
  leadForm: LeadForm,
  footer: Footer,
};

function isSectionKey(value: string): value is SectionKey {
  return (SECTION_KEYS as readonly string[]).includes(value);
}

export function SectionRenderer() {
  const { preset } = resolveConfig();

  return (
    <>
      {preset.sections.map((key, index) => {
        if (key.startsWith('module:')) {
          const widget = key.slice('module:'.length);
          return <ModuleSlot key={`${key}-${index}`} widget={widget} />;
        }

        if (!isSectionKey(key)) return null;

        const Section = SECTIONS[key];
        return <Section key={`${key}-${index}`} />;
      })}
    </>
  );
}
