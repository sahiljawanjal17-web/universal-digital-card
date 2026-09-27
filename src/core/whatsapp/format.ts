/**
 * WhatsApp message primitives. WhatsApp uses its own lightweight markup:
 * *bold*, _italic_, ~strike~ — so the helpers below, not Markdown.
 * See docs/07-CONVENTIONS.md §7 for the message standard these build up to.
 */

/** Conventions §7: 1800 leaves head-room under WhatsApp's ~2000 char URL cap. */
export const MAX_MESSAGE_LENGTH = 1800;
const TRUNCATION_SUFFIX = '\n\n…(details on call)';

export function bold(text: string): string {
  return `*${text}*`;
}

export function italic(text: string): string {
  return `_${text}_`;
}

export function bullet(text: string): string {
  return `• ${text}`;
}

/** `Label: value` — the body line shape every template uses. */
export function field(label: string, value: string): string {
  return `${label}: ${value}`;
}

/** Joins non-empty blocks with a blank line between them. */
export function section(...blocks: Array<string | null | undefined | false>): string {
  return blocks.filter((b): b is string => Boolean(b && b.trim())).join('\n\n');
}

/**
 * Collapses runs of 3+ newlines (a template with an empty block leaves them)
 * and trims — WhatsApp renders every stray blank line.
 */
export function tidy(message: string): string {
  return message.replace(/\n{3,}/g, '\n\n').trim();
}

/** Hard cap with a human-readable tail rather than a mid-word cut. */
export function truncate(message: string, max = MAX_MESSAGE_LENGTH): string {
  if (message.length <= max) return message;
  const budget = max - TRUNCATION_SUFFIX.length;
  const sliced = message.slice(0, budget);
  const lastBreak = sliced.lastIndexOf('\n');
  const body = lastBreak > budget * 0.6 ? sliced.slice(0, lastBreak) : sliced.trimEnd();
  return `${body}${TRUNCATION_SUFFIX}`;
}
