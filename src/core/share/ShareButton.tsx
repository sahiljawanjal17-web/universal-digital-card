'use client';

import { useState } from 'react';
import { QrCode, Share2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useRole } from '@/lib/hooks/useRole';
import { useShare } from './useShare';
import { QrModal } from './QrModal';

export interface ShareButtonProps extends VariantProps<typeof buttonVariants> {
  label?: string;
  className?: string;
  /** Hide the QR affordance even when `flags.qrShare` is on. */
  showQr?: boolean;
}

/** Native share sheet, with a QR sibling for desk-to-phone handover. */
export function ShareButton({
  label = 'Share',
  className,
  variant = 'outline',
  size = 'lg',
  showQr = true,
}: ShareButtonProps) {
  const { site } = useRole();
  const { share } = useShare();
  const [qrOpen, setQrOpen] = useState(false);
  const qrEnabled = showQr && site.flags.qrShare;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button type="button" variant={variant} size={size} onClick={share} className="gap-2">
        <Share2 className="size-4" aria-hidden />
        {label}
      </Button>

      {qrEnabled ? (
        <>
          <Button
            type="button"
            variant={variant}
            size={size === 'lg' ? 'icon-lg' : 'icon'}
            aria-label="Show QR code"
            onClick={() => setQrOpen(true)}
          >
            <QrCode className="size-4" aria-hidden />
          </Button>
          <QrModal open={qrOpen} onOpenChange={setQrOpen} />
        </>
      ) : null}
    </div>
  );
}
