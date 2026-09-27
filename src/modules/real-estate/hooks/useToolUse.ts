'use client';

import { useCallback, useRef } from 'react';
import { EVENTS, track } from '@/core/analytics';

/**
 * A calculator fires `tool_use` the first time someone actually moves a
 * control, not on every keystroke — the interesting signal is "this tool got
 * used", and a slider drag would otherwise emit dozens of events.
 */
export function useToolUse(tool: string): () => void {
  const fired = useRef(false);

  return useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    track(EVENTS.TOOL_USE, { section: tool, tool });
  }, [tool]);
}
