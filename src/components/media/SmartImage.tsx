'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const FALLBACK = '/images/placeholder.svg';

/**
 * next/image with the three things we always forget: a required `sizes`,
 * a tinted blur placeholder and a local fallback when a data JSON points at a
 * dead URL. Pair it with <AspectBox> for zero CLS.
 */
export function SmartImage({
  src,
  alt,
  sizes,
  className,
  blurDataURL,
  fill = true,
  ...rest
}: Omit<ImageProps, 'src' | 'sizes'> & {
  src: string;
  /** Mandatory — a responsive image without `sizes` ships the desktop file to phones. */
  sizes: string;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = failed ? FALLBACK : src;

  return (
    <Image
      {...rest}
      src={resolved}
      alt={alt}
      fill={fill}
      sizes={sizes}
      onError={() => setFailed(true)}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      className={cn('object-cover', className)}
    />
  );
}
