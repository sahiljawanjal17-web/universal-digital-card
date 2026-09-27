/**
 * npm run validate:config
 * Parses site.config.json, all 6 role presets and all 6 role data files.
 * Any failure prints the exact JSON path and exits 1, so CI catches a bad
 * config before it ever reaches a build.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROLE_KEYS } from '../src/types/role';
import { presets } from '../src/config/roles';
import { dataSchemas } from '../src/config/schema';
import { SiteSchema } from '../src/config/schema/site.schema';
import { PresetSchema } from '../src/config/schema/preset.schema';
import { formatConfigError } from '../src/config/errors';

const root = process.cwd();
const failures: string[] = [];

function readJson(relativePath: string): unknown {
  try {
    return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8'));
  } catch (error) {
    failures.push(`Cannot read ${relativePath}\n   ${(error as Error).message}`);
    return undefined;
  }
}

function check(source: string, schema: { safeParse: (v: unknown) => unknown }, value: unknown) {
  if (value === undefined) return;
  const result = schema.safeParse(value) as
    | { success: true }
    | { success: false; error: Parameters<typeof formatConfigError>[1] };
  if (result.success) {
    console.log(`  ok  ${source}`);
    return;
  }
  failures.push(formatConfigError(source, result.error));
}

check('src/config/site.config.json', SiteSchema, readJson('src/config/site.config.json'));

for (const role of ROLE_KEYS) {
  check(`src/config/roles/${role}.preset.ts`, PresetSchema, presets[role]);
  check(`src/data/roles/${role}.json`, dataSchemas[role], readJson(`src/data/roles/${role}.json`));
}

if (failures.length > 0) {
  console.error(`\n${failures.length} config problem(s):\n`);
  for (const failure of failures) console.error(`${failure}\n`);
  process.exit(1);
}

console.log(`\nAll configs valid (${ROLE_KEYS.length} roles).\n`);
