'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import type { SiteConfig } from '@/config/schema/site.schema';

/**
 * Light/dark only — WHICH palette is in play comes from <html data-role>.
 * next-themes writes `data-theme` before paint, which is the attribute
 * src/styles/role-themes.css and the Tailwind `dark:` variant both read.
 */
export function ThemeProvider({
  theme,
  children,
}: {
  theme: SiteConfig['theme'];
  children: React.ReactNode;
}) {
  const system = theme.mode === 'system';

  return (
    <NextThemeProvider
      attribute="data-theme"
      defaultTheme={theme.mode}
      enableSystem={system}
      enableColorScheme={false}
      disableTransitionOnChange
      themes={['light', 'dark']}
    >
      {children}
    </NextThemeProvider>
  );
}
