/**
 * Contrast audit for the 6 role themes x light/dark (PART-02 DoD).
 *
 * Reads the real CSS (src/styles/tokens.css + role-themes.css) instead of a
 * hand-kept copy of the palette, so the report can never drift from the theme.
 * Writes docs/assets/contrast-report.md and exits 1 if a required pair fails.
 *
 * Run: npm run contrast
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROLE_KEYS, type RoleKey } from '../src/types/role';

type Mode = 'light' | 'dark';
type Vars = Record<string, string>;

const ROOT = process.cwd();
const CSS_FILES = ['src/styles/tokens.css', 'src/styles/role-themes.css'];

/** Minimal CSS block reader — only what this file needs, no CSS parser dep. */
function readBlocks(css: string): Array<{ selector: string; vars: Vars }> {
  const blocks: Array<{ selector: string; vars: Vars }> = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    const selector = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim();
    const vars: Vars = {};
    for (const decl of m[2].split(';')) {
      const [rawName, ...rest] = decl.split(':');
      const name = rawName.trim();
      if (!name.startsWith('--')) continue;
      vars[name] = rest.join(':').trim();
    }
    if (Object.keys(vars).length > 0) blocks.push({ selector, vars });
  }
  return blocks;
}

const blocks = CSS_FILES.flatMap((f) =>
  readBlocks(readFileSync(join(ROOT, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')),
);

function varsFor(selector: string): Vars {
  return blocks
    .filter((b) => b.selector === selector)
    .reduce<Vars>((acc, b) => ({ ...acc, ...b.vars }), {});
}

function resolve(role: RoleKey, mode: Mode): Vars {
  const layers = [':root'];
  if (mode === 'dark') layers.push("[data-theme='dark']");
  layers.push(`[data-role='${role}']`);
  if (mode === 'dark') layers.push(`[data-role='${role}'][data-theme='dark']`);
  return layers.reduce<Vars>((acc, s) => ({ ...acc, ...varsFor(s) }), {});
}

/* --- OKLCH -> sRGB (Björn Ottosson's oklab matrices) --------------------- */
function oklchToRgb(l: number, c: number, hDeg: number): [number, number, number] {
  const h = (hDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return lin.map((v) => Math.min(1, Math.max(0, v))) as [number, number, number];
}

function parseOklch(value: string): [number, number, number] | null {
  const m = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(value.trim());
  if (!m) return null;
  return oklchToRgb(Number(m[1]), Number(m[2]), Number(m[3]));
}

const toHex = (rgb: [number, number, number]) =>
  '#' +
  rgb
    .map((v) =>
      Math.round((v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('');

const luminance = ([r, g, b]: [number, number, number]) =>
  0.2126 * r + 0.7152 * g + 0.0722 * b;

function contrast(fg: string, bg: string): number | null {
  const a = parseOklch(fg);
  const b = parseOklch(bg);
  if (!a || !b) return null;
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* --- audit --------------------------------------------------------------- */
const PAIRS: Array<{ label: string; fg: string; bg: string; min: number }> = [
  { label: 'fg / bg', fg: '--fg', bg: '--bg', min: 4.5 },
  { label: 'fg / surface', fg: '--fg', bg: '--surface', min: 4.5 },
  { label: 'fg-muted / bg', fg: '--fg-muted', bg: '--bg', min: 4.5 },
  { label: 'fg-muted / surface-2', fg: '--fg-muted', bg: '--surface-2', min: 4.5 },
  { label: 'brand-fg / brand', fg: '--brand-fg', bg: '--brand', min: 4.5 },
  { label: 'accent-fg / accent', fg: '--accent-fg', bg: '--accent', min: 4.5 },
  { label: 'brand / bg (large/UI)', fg: '--brand', bg: '--bg', min: 3 },
  { label: 'fg-subtle / bg (large)', fg: '--fg-subtle', bg: '--bg', min: 3 },
  { label: 'border-strong / bg (UI)', fg: '--border-strong', bg: '--bg', min: 3 },
];

const rows: string[] = [];
const failures: string[] = [];
const themeColors: string[] = [];

for (const role of ROLE_KEYS) {
  for (const mode of ['light', 'dark'] as const) {
    const vars = resolve(role, mode);
    themeColors.push(`| \`${role}\` | ${mode} | \`${toHex(parseOklch(vars['--bg'])!)}\` |`);
    for (const pair of PAIRS) {
      const ratio = contrast(vars[pair.fg] ?? '', vars[pair.bg] ?? '');
      if (ratio === null) {
        failures.push(`${role}/${mode} ${pair.label}: unresolved token`);
        continue;
      }
      const pass = ratio >= pair.min;
      if (!pass) failures.push(`${role}/${mode} ${pair.label}: ${ratio.toFixed(2)} < ${pair.min}`);
      rows.push(
        `| \`${role}\` | ${mode} | ${pair.label} | ${ratio.toFixed(2)}:1 | ${pair.min}:1 | ${pass ? '✅' : '❌'} |`,
      );
    }
  }
}

const md = `# Contrast report — 6 roles x light/dark

> Generated by \`npm run contrast\` from \`src/styles/tokens.css\` + \`src/styles/role-themes.css\`.
> Do not edit by hand. Last run: ${new Date().toISOString().slice(0, 10)}

**Result: ${failures.length === 0 ? 'all pairs pass ✅' : `${failures.length} failing pair(s) ❌`}** — ${rows.length} checks across 12 variants.

| Role | Mode | Pair | Ratio | Min | |
|------|------|------|-------|-----|--|
${rows.join('\n')}

## Browser theme-color (sRGB of \`--bg\`)

| Role | Mode | Hex |
|------|------|-----|
${themeColors.join('\n')}
`;

writeFileSync(join(ROOT, 'docs/assets/contrast-report.md'), md, 'utf8');

if (failures.length > 0) {
  console.error('Contrast failures:\n' + failures.map((f) => ` - ${f}`).join('\n'));
  process.exit(1);
}
console.log(`Contrast: ${rows.length}/${rows.length} pairs pass. Report written.`);
