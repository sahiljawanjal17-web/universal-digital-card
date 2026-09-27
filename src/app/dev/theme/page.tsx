import { notFound } from 'next/navigation';
import { resolveConfig, presets } from '@/config';
import { ROLE_KEYS } from '@/types/role';
import { THEME_MODES } from '@/config/theme';
import { Button } from '@/components/ui/button';

/**
 * Dev-only token preview: all 6 roles x light/dark on one page. Each panel sets
 * its own `data-role` / `data-theme`, which is exactly how the cascade works at
 * runtime — so what you see here is what a real page renders.
 * Gated by site.config.json -> flags.devRoleSwitcher.
 */
const TOKENS = [
  '--brand',
  '--accent',
  '--bg',
  '--surface',
  '--surface-2',
  '--fg',
  '--fg-muted',
  '--border-strong',
] as const;

function Swatch({ token }: { token: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="size-10 rounded-md border border-border"
        style={{ background: `var(${token})` }}
      />
      <span className="text-[0.625rem] text-fg-subtle">{token.replace('--', '')}</span>
    </div>
  );
}

function Panel({ role, mode }: { role: string; mode: string }) {
  return (
    <section
      data-role={role}
      data-theme={mode}
      className="overflow-hidden rounded-xl border border-border bg-bg p-5 text-fg"
    >
      <header className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-h3 text-fg">{role}</h2>
        <span className="text-caption text-fg-muted">{mode}</span>
      </header>

      <div className="mb-5 flex flex-wrap gap-3">
        {TOKENS.map((t) => (
          <Swatch key={t} token={t} />
        ))}
      </div>

      <div className="surface-card mb-4 p-4">
        <p className="text-h3 mb-1">Confident Indian Professional</p>
        <p className="text-small text-fg-muted">
          Body copy on a card — muted text must stay readable in both modes.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-brand-fg">
          Brand
        </span>
        <span className="inline-flex items-center rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg">
          Accent
        </span>
        <Button size="lg">shadcn</Button>
        <Button size="lg" variant="outline">
          Outline
        </Button>
        <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs text-success">success</span>
        <span className="rounded-full bg-danger/15 px-2.5 py-1 text-xs text-danger">danger</span>
      </div>
    </section>
  );
}

export default function ThemePreviewPage() {
  const { site } = resolveConfig();
  if (!site.flags.devRoleSwitcher) notFound();

  return (
    <main className="container-page section-y space-y-10">
      <div>
        <h1 className="text-h1">Theme preview</h1>
        <p className="text-body text-fg-muted">
          6 roles × light/dark. Contrast numbers: <code>docs/assets/contrast-report.md</code>.
        </p>
      </div>

      <div>
        <h2 className="text-h2 mb-3">Type scale</h2>
        <div className="space-y-2">
          <p className="text-display">Display</p>
          <p className="text-h1">Heading 1</p>
          <p className="text-h2">Heading 2</p>
          <p className="text-h3">Heading 3</p>
          <p className="text-body-lg">Body large — 1.125rem / 1.65</p>
          <p className="text-body text-fg-muted">Body — 1rem / 1.65</p>
          <p className="text-small text-fg-muted">Small — 0.875rem</p>
          <p className="text-caption text-fg-subtle">Caption</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {ROLE_KEYS.map((role) =>
          THEME_MODES.map((mode) => <Panel key={`${role}-${mode}`} role={role} mode={mode} />),
        )}
      </div>

      <div>
        <h2 className="text-h2 mb-3">Font pairs</h2>
        <ul className="space-y-2">
          {ROLE_KEYS.map((role) => (
            <li key={role} data-font-pair={presets[role].fontPair} className="flex gap-3">
              <span className="text-h3 font-display">{presets[role].label}</span>
              <span className="text-small self-end text-fg-subtle">
                {presets[role].fontPair} · {presets[role].themeId}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
