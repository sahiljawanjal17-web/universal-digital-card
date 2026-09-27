'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRole } from '@/lib/hooks/useRole';
import { EVENTS, track } from '@/core/analytics';

export interface ShareResult {
  method: 'native' | 'clipboard' | 'unsupported';
}

/** Absolute URL of the card. Env wins so QR codes stay valid off-origin. */
export function useShareUrl(): string {
  const [url, setUrl] = useState(process.env.NEXT_PUBLIC_SITE_URL ?? '');
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SITE_URL) setUrl(window.location.origin);
  }, []);
  return url;
}

/**
 * Native share sheet where the browser has one, clipboard + toast everywhere
 * else. `canNativeShare` is resolved after mount to avoid a hydration mismatch.
 */
export function useShare() {
  const { data } = useRole();
  const url = useShareUrl();
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const share = useCallback(async (): Promise<ShareResult> => {
    const payload = {
      title: data.profile.name,
      text: data.profile.tagline,
      url: url || window.location.href,
    };

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(payload);
        track(EVENTS.SHARE_CLICK, { method: 'native' });
        return { method: 'native' };
      } catch {
        // User dismissed the sheet, or the gesture expired — fall through.
      }
    }

    try {
      await navigator.clipboard.writeText(payload.url);
      toast.success('Link copied');
      track(EVENTS.SHARE_CLICK, { method: 'clipboard' });
      return { method: 'clipboard' };
    } catch {
      toast.error('Could not copy the link');
      return { method: 'unsupported' };
    }
  }, [data.profile.name, data.profile.tagline, url]);

  return { share, canNativeShare, url };
}
