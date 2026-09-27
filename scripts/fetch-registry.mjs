// Fetches shadcn-style registry items via curl (Node fetch fails on this NAT64 network).
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = 'C:/Users/Admin/ALL_IN_ONE';
const SHADCN = (n) => `https://ui.shadcn.com/r/styles/base-nova/${n}.json`;
const seen = new Set();
const deps = new Set();
const written = [];

function get(url) {
  return JSON.parse(execFileSync('curl', ['-sL', '--max-time', '40', url], { encoding: 'utf8', maxBuffer: 1 << 26 }));
}

function targetPath(f) {
  let p = f.target && f.target.length ? f.target : f.path;
  p = p.replace(/^(registry\/[^/]+\/)/, 'src/').replace(/^src\/src\//, 'src/');
  if (!p.startsWith('src/') && !p.startsWith('public/')) p = 'src/' + p.replace(/^\.?\//, '');
  return join(ROOT, p);
}

function install(name, urlFn) {
  if (seen.has(name)) return;
  seen.add(name);
  const item = get(urlFn(name));
  for (const d of item.dependencies ?? []) deps.add(d);
  for (const rd of item.registryDependencies ?? []) {
    if (/^https?:/.test(rd)) install(rd, (u) => u);
    else install(rd, SHADCN);
  }
  for (const f of item.files ?? []) {
    if (f.type === 'registry:style' || !f.content) continue;
    const out = targetPath(f);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, f.content, 'utf8');
    written.push(out.slice(ROOT.length + 1));
  }
}

const names = process.argv.slice(2);
for (const n of names) {
  try { install(n, /^https?:/.test(n) ? (u) => u : SHADCN); }
  catch (e) { console.error('FAIL', n, String(e).slice(0, 120)); }
}
console.log('WRITTEN', written.length);
console.log(written.join('\n'));
console.log('NPM_DEPS', [...deps].join(' '));
