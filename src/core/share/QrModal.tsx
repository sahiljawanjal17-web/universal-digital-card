'use client';

import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRole } from '@/lib/hooks/useRole';
import { EVENTS, track } from '@/core/analytics';
import { slugifyName } from '@/core/vcard/build-vcard';
import { useShareUrl } from './useShare';

const QR_SIZE = 240;

/**
 * Reads a semantic token off the live DOM so the QR matches the active role
 * theme. Canvas cannot paint a CSS variable, hence the computed lookup.
 */
function readToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export interface QrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QrModal({ open, onOpenChange }: QrModalProps) {
  const { data } = useRole();
  const url = useShareUrl();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [colors, setColors] = useState({ fg: '#111111', bg: '#ffffff' });

  useEffect(() => {
    if (!open) return;
    setColors({ fg: readToken('--brand', '#111111'), bg: readToken('--surface', '#ffffff') });
    track(EVENTS.QR_OPEN);
  }, [open]);

  const logo = data.profile.logo ?? data.profile.avatar;

  function downloadPng() {
    const canvas = wrapperRef.current?.querySelector('canvas');
    if (!canvas) return;
    const anchor = document.createElement('a');
    anchor.href = canvas.toDataURL('image/png');
    anchor.download = `${slugifyName(data.profile.name)}-qr.png`;
    anchor.click();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Scan to open this card</DialogTitle>
          <DialogDescription>
            Point a camera at the code, or download it for a print or a poster.
          </DialogDescription>
        </DialogHeader>

        <div ref={wrapperRef} className="bg-surface flex justify-center rounded-xl p-4">
          {url ? (
            <QRCodeCanvas
              value={url}
              size={QR_SIZE}
              fgColor={colors.fg}
              bgColor={colors.bg}
              level="H"
              marginSize={2}
              imageSettings={{ src: logo, height: 44, width: 44, excavate: true }}
            />
          ) : (
            <div className="bg-surface-2 size-[240px] animate-pulse rounded-lg" />
          )}
        </div>

        <Button type="button" size="lg" onClick={downloadPng} className="gap-2">
          <Download className="size-4" aria-hidden />
          Download PNG
        </Button>
      </DialogContent>
    </Dialog>
  );
}
