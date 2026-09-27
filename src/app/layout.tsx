import type { Metadata, Viewport } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { resolveConfig } from '@/config';
import { fontClassNames } from '@/lib/fonts';
import { RoleProvider } from '@/components/providers/RoleProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AnalyticsProvider } from '@/core/analytics';
import { FloatingActionDock } from '@/core/fab';
import { Toaster } from '@/components/ui/sonner';
import '../styles/globals.css';

/** `data-role` + fonts are rendered on the server, so the palette is correct
 *  on the very first paint; next-themes only adds `data-theme` on top. */
export function generateMetadata(): Metadata {
  const { data } = resolveConfig();
  return {
    title: `${data.profile.name} — ${data.profile.tagline}`,
    description: data.profile.tagline,
  };
}

export function generateViewport(): Viewport {
  const { theme } = resolveConfig();
  return {
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: theme.themeColor.light },
      { media: '(prefers-color-scheme: dark)', color: theme.themeColor.dark },
    ],
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const config = resolveConfig();
  const { site, role, preset } = config;
  const needsDevanagari = [site.locale, site.secondaryLocale].some(
    (l) => l?.toLowerCase().startsWith('hi') ?? false,
  );

  return (
    <html
      lang={site.locale}
      data-role={role}
      data-font-pair={preset.fontPair}
      className={fontClassNames(preset.fontPair, needsDevanagari)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider theme={site.theme}>
          <RoleProvider config={config}>
            <NuqsAdapter>
              <AnalyticsProvider>{children}</AnalyticsProvider>
            </NuqsAdapter>
            <FloatingActionDock />
            <Toaster position="top-center" />
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
