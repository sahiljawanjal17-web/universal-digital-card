'use client';

import { VCARD_MIME } from './build-vcard';

/**
 * iOS Safari silently ignores `blob:` downloads for .vcf, so those devices are
 * navigated to `/api/vcard` instead, where a real Content-Disposition header
 * makes the contact card open in Contacts.
 */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true;
  // iPadOS 13+ reports as a Mac; touch points are the only reliable tell.
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

/** Server route that streams the same vCard with download headers. */
export function vcardRouteHref(role?: string): string {
  return role ? `/api/vcard?role=${encodeURIComponent(role)}` : '/api/vcard';
}

export interface DownloadVCardOptions {
  content: string;
  filename: string;
  /** Used for the iOS fallback navigation. */
  role?: string;
}

/** Returns `'blob'` or `'route'` so the caller can report what actually ran. */
export function downloadVCard({
  content,
  filename,
  role,
}: DownloadVCardOptions): 'blob' | 'route' {
  if (typeof window === 'undefined') return 'route';

  if (isIOS()) {
    window.location.href = vcardRouteHref(role);
    return 'route';
  }

  const blob = new Blob([content], { type: VCARD_MIME });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoking immediately races the download in Firefox.
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return 'blob';
}
