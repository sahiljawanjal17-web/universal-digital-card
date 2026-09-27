'use client';

import { useMemo, useState } from 'react';
import { MasonryPhotoAlbum, type Photo } from 'react-photo-album';
import Lightbox, { type Slide } from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'react-photo-album/masonry.css';
import 'yet-another-react-lightbox/styles.css';

import { SectionShell } from './SectionShell';
import { EmptyState } from '@/components/shared';
import { EVENTS, track } from '@/core/analytics';
import { useRole } from '@/lib/hooks/useRole';
import type { GalleryItem } from '@/config/schema/common.schema';

const SECTION = 'gallery';

/** Videos carry no intrinsic size in the data, so the poster gets a 3:2 box. */
const VIDEO_WIDTH = 1600;
const VIDEO_HEIGHT = 1067;

/**
 * Masonry work samples. `data.gallery[]` is a discriminated union, so an image
 * opens as a photo and a video opens in the lightbox's video plugin — the tag
 * filter is derived from the data rather than declared per role.
 */
export function Gallery() {
  const { data } = useRole();
  const items = data.gallery;
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState(-1);

  const tags = useMemo(
    () => Array.from(new Set(items.flatMap((item) => item.tags))).sort(),
    [items],
  );

  const visible = useMemo(
    () => (activeTag ? items.filter((item) => item.tags.includes(activeTag)) : items),
    [items, activeTag],
  );

  const photos = useMemo<Photo[]>(() => visible.map(toPhoto), [visible]);
  const slides = useMemo<Slide[]>(() => visible.map(toSlide), [visible]);

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Gallery"
      title="Recent work"
      tone="muted"
      headingSlot={
        tags.length > 0 ? (
          <TagFilter
            tags={tags}
            active={activeTag}
            onChange={(tag) => {
              setActiveTag(tag);
              track(EVENTS.FILTER_APPLY, { section: SECTION, tag: tag ?? 'all' });
            }}
          />
        ) : undefined
      }
    >
      {visible.length === 0 ? (
        <EmptyState icon="image" title="No photos here yet" description="New work lands soon." />
      ) : (
        <MasonryPhotoAlbum
          photos={photos}
          columns={(width) => (width < 640 ? 2 : width < 1024 ? 3 : 4)}
          spacing={12}
          onClick={({ index }) => {
            setOpenIndex(index);
            track(EVENTS.GALLERY_OPEN, { section: SECTION, index });
          }}
        />
      )}

      <Lightbox
        open={openIndex >= 0}
        index={Math.max(openIndex, 0)}
        close={() => setOpenIndex(-1)}
        slides={slides}
        plugins={[Video]}
      />
    </SectionShell>
  );
}

function toPhoto(item: GalleryItem): Photo {
  return item.type === 'image'
    ? { src: item.src, alt: item.alt, width: item.width, height: item.height }
    : { src: item.poster, alt: item.alt, width: VIDEO_WIDTH, height: VIDEO_HEIGHT };
}

function toSlide(item: GalleryItem): Slide {
  return item.type === 'image'
    ? { type: 'image', src: item.src, alt: item.alt, width: item.width, height: item.height }
    : {
        type: 'video',
        poster: item.poster,
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        sources: [{ src: item.src, type: 'video/mp4' }],
      };
}

function TagFilter({
  tags,
  active,
  onChange,
}: {
  tags: string[];
  active: string | null;
  onChange: (tag: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gallery by tag">
      {[null, ...tags].map((tag) => (
        <button
          key={tag ?? 'all'}
          type="button"
          aria-pressed={active === tag}
          onClick={() => onChange(tag)}
          className="rounded-lg border border-border px-3 py-1.5 text-small text-fg-muted transition-colors hover:bg-surface-2 aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-brand-fg"
        >
          {tag ?? 'All'}
        </button>
      ))}
    </div>
  );
}
