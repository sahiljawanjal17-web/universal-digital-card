/**
 * Turns a flat `data.gallery[]` into before/after pairs. Tagged items win
 * (`before` / `after` on the same optional case tag); anything left over is
 * paired in document order, which is how an untagged data set still works.
 */
import type { GalleryItem } from '@/config/schema/common.schema';

type GalleryImage = Extract<GalleryItem, { type: 'image' }>;

export type BeforeAfterPair = { id: string; before: GalleryImage; after: GalleryImage };

const BEFORE = 'before';
const AFTER = 'after';

function isImage(item: GalleryItem): item is GalleryImage {
  return item.type === 'image';
}

function has(item: GalleryImage, tag: string): boolean {
  return item.tags.some((value) => value.toLowerCase() === tag);
}

/** The tag that is neither `before` nor `after` — the case this pair is about. */
function caseTag(item: GalleryImage): string | null {
  return item.tags.find((tag) => tag.toLowerCase() !== BEFORE && tag.toLowerCase() !== AFTER) ?? null;
}

export function buildBeforeAfterPairs(items: readonly GalleryItem[]): BeforeAfterPair[] {
  const images = items.filter(isImage);
  const pairs: BeforeAfterPair[] = [];
  const used = new Set<GalleryImage>();

  for (const before of images) {
    if (used.has(before) || !has(before, BEFORE)) continue;
    const tag = caseTag(before);
    const after = images.find(
      (candidate) =>
        !used.has(candidate) &&
        candidate !== before &&
        has(candidate, AFTER) &&
        (tag === null || caseTag(candidate) === tag),
    );
    if (!after) continue;
    used.add(before);
    used.add(after);
    pairs.push({ id: tag ?? before.src, before, after });
  }

  const rest = images.filter((image) => !used.has(image));
  for (let i = 0; i + 1 < rest.length; i += 2) {
    pairs.push({ id: rest[i].src, before: rest[i], after: rest[i + 1] });
  }

  return pairs;
}
