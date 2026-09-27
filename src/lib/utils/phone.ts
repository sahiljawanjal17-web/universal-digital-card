/**
 * Phone helpers. Data always stores E.164 (`+919876543210`); every other shape
 * — wa.me digits, tel: href, human display — is derived here so that no
 * component ever slices a phone string by hand.
 */

const E164 = /^\+[1-9]\d{7,14}$/;
/** Indian numbers are the only ones the placeholder data carries today. */
const IN_NATIONAL_LENGTH = 10;

/**
 * Normalise loose user/data input to E.164. Assumes India (+91) when the number
 * carries no country code, which is the only market this product ships to.
 */
export function toE164(input: string, defaultCountry = '91'): string {
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';
  if (input.trim().startsWith('+')) return `+${digits}`;
  if (digits.length === IN_NATIONAL_LENGTH) return `+${defaultCountry}${digits}`;
  if (digits.startsWith(defaultCountry)) return `+${digits}`;
  return `+${defaultCountry}${digits}`;
}

export function isE164(input: string): boolean {
  return E164.test(input);
}

/** `wa.me/<number>` wants digits only — no `+`, no spaces. */
export function toWaNumber(phone: string): string {
  return toE164(phone).replace(/\D/g, '');
}

export function toTelHref(phone: string): string {
  return `tel:${toE164(phone)}`;
}

/**
 * Display form: `+91 98765 43210`. Non-Indian numbers fall back to a single
 * space after the country code rather than guessing a grouping.
 */
export function formatPhone(phone: string): string {
  const e164 = toE164(phone);
  if (!e164) return '';
  const match = /^\+91(\d{5})(\d{5})$/.exec(e164);
  if (match) return `+91 ${match[1]} ${match[2]}`;
  const generic = /^(\+\d{1,3})(\d+)$/.exec(e164);
  return generic ? `${generic[1]} ${generic[2]}` : e164;
}
