'use client';

import { Download, Loader2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useVCard } from './useVCard';

export interface VCardButtonProps extends VariantProps<typeof buttonVariants> {
  label?: string;
  className?: string;
}

/** "Save Contact" — the C1 entry point. Label comes from the caller/data. */
export function VCardButton({
  label = 'Save Contact',
  className,
  variant = 'default',
  size = 'lg',
}: VCardButtonProps) {
  const { download, isDownloading } = useVCard();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={download}
      disabled={isDownloading}
      aria-label={label}
      className={cn('gap-2', className)}
    >
      {isDownloading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Download className="size-4" aria-hidden />
      )}
      {label}
    </Button>
  );
}
