'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useRole } from '@/lib/hooks/useRole';
import { cn } from '@/lib/utils';

/**
 * Renders nothing when site.config.json sets `theme.allowToggle: false`.
 * Mounted-guard avoids a hydration mismatch: the server cannot know which
 * mode next-themes resolved.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { site } = useRole();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!site.theme.allowToggle) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={mounted ? isDark : undefined}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative inline-flex size-10 items-center justify-center rounded-full',
        'border border-border bg-surface text-fg-muted shadow-sm',
        'transition-colors duration-200 hover:bg-surface-2 hover:text-fg',
        className,
      )}
    >
      <Sun
        aria-hidden
        className={cn(
          'absolute size-5 transition-all duration-300',
          mounted && isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          'absolute size-5 transition-all duration-300',
          mounted && isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0',
        )}
      />
    </button>
  );
}
