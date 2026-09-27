import { Navbar } from '@/components/layout/Navbar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { StickyBottomBar } from '@/components/layout/StickyBottomBar';
import { ExitIntentDialog } from '@/components/shared';
import { SectionRenderer } from '@/components/sections';

/**
 * The whole product, in one tree: fixed chrome plus whatever the active
 * preset's `sections` array asks for. Changing the role in
 * src/config/site.config.json is the only thing that changes this page.
 */
export function RoleLandingPage() {
  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-(--z-modal) focus:rounded-lg focus:bg-surface-elevated focus:px-4 focus:py-2 focus:text-small focus:text-fg focus:shadow-md"
      >
        Skip to content
      </a>
      <Navbar />
      <main className="pb-20 lg:pb-0">
        <SectionRenderer />
      </main>
      <StickyBottomBar />
      <CommandPalette />
      <ExitIntentDialog />
    </>
  );
}
