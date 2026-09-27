/**
 * Data JSON carries icon names as kebab-case strings, so nothing in the data
 * layer imports React. This is the single place that turns such a name into a
 * lucide component — sections never import an icon by role.
 */
import {
  Activity,
  Camera,
  Dumbbell,
  FileText,
  Heart,
  HeartPulse,
  Home,
  Key,
  Receipt,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  camera: Camera,
  dumbbell: Dumbbell,
  'file-text': FileText,
  heart: Heart,
  'heart-pulse': HeartPulse,
  home: Home,
  key: Key,
  receipt: Receipt,
  shield: Shield,
  'shield-check': ShieldCheck,
  star: Star,
  /** lucide has no tooth glyph — the dental data set uses this stand-in. */
  tooth: Smile,
  users: Users,
};

export const FALLBACK_ICON: LucideIcon = Sparkles;

/** Never throws: an unknown name degrades to a neutral glyph. */
export function getIcon(name: string | null | undefined): LucideIcon {
  return (name && ICONS[name]) || FALLBACK_ICON;
}
