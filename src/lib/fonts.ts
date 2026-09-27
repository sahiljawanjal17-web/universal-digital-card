/**
 * next/font definitions. Each family exposes a CSS variable; the role preset's
 * `fontPair` decides which two variables are applied to <html>, and
 * src/styles/typography.css maps the pair to --font-display / --font-body.
 *
 * Only the active pair's classNames are rendered, so the other families are
 * never requested by the browser.
 */
import {
  Inter,
  Noto_Sans_Devanagari,
  Outfit,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Sora,
  Source_Serif_4,
} from 'next/font/google';
import type { FontPairId } from '@/config/theme/ids';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], display: 'swap', variable: '--font-sora' });
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});
const outfit = Outfit({ subsets: ['latin'], display: 'swap', variable: '--font-outfit' });

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  display: 'swap',
  variable: '--font-noto-devanagari',
});

/** Body font is Inter for every pair — the display face is what changes. */
const pairVariables: Record<FontPairId, string[]> = {
  'sora+inter': [sora.variable, inter.variable],
  'inter+inter': [inter.variable],
  'plus-jakarta+inter': [plusJakarta.variable, inter.variable],
  'source-serif+inter': [sourceSerif.variable, inter.variable],
  'playfair+inter': [playfair.variable, inter.variable],
  'outfit+inter': [outfit.variable, inter.variable],
};

/**
 * Class names for <html>. `withDevanagari` adds the Hindi fallback family —
 * pass it only when the site actually serves a `hi-*` locale.
 */
export function fontClassNames(pair: FontPairId, withDevanagari = false): string {
  const vars = [...pairVariables[pair]];
  if (withDevanagari) vars.push(notoDevanagari.variable);
  return vars.join(' ');
}
