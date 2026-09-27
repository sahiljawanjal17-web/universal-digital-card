'use client';

import { useEffect, useState } from 'react';

/** Pointer has to leave through the top edge — a side exit is tab-switching. */
const TOP_EDGE_PX = 4;
/** A flick back to the top on a phone reads as "I am done here". */
const FAST_SCROLL_UP_PX = 900;
const IDLE_MS = 45_000;

/**
 * Fires once when the visitor looks like they are leaving: pointer out of the
 * top edge on desktop, a fast scroll back up or 45s of no input on touch.
 * Latches — the caller decides whether anything is shown.
 */
export function useExitIntent(enabled = true): boolean {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!enabled || triggered) return;

    // Idle and flick-up are touch heuristics; a desktop visitor who simply
    // reads slowly should not be interrupted.
    const touch = window.matchMedia('(pointer: coarse)').matches;
    let idleTimer = 0;
    let lastY = window.scrollY;
    let lastT = Date.now();

    const fire = () => setTriggered(true);

    const restartIdle = () => {
      if (!touch) return;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(fire, IDLE_MS);
    };

    const onMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget === null && event.clientY <= TOP_EDGE_PX) fire();
    };

    const onScroll = () => {
      const now = Date.now();
      const dy = lastY - window.scrollY;
      const dt = now - lastT;
      if (touch && dy > 200 && dt > 0 && (dy / dt) * 1000 > FAST_SCROLL_UP_PX) fire();
      lastY = window.scrollY;
      lastT = now;
      restartIdle();
    };

    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', restartIdle, { passive: true });
    window.addEventListener('keydown', restartIdle);
    restartIdle();

    return () => {
      window.clearTimeout(idleTimer);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', restartIdle);
      window.removeEventListener('keydown', restartIdle);
    };
  }, [enabled, triggered]);

  return triggered;
}
