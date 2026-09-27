/**
 * npm run role <role-key>
 * Rewrites src/config/site.config.json's `role` field, then validates every config.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROLE_KEYS, isRoleKey } from '../src/types/role';

const CONFIG_PATH = resolve(process.cwd(), 'src/config/site.config.json');
const requested = process.argv[2];

if (!isRoleKey(requested)) {
  console.error(`\n  Unknown role: ${requested ?? '(none given)'}`);
  console.error(`   Valid roles: ${ROLE_KEYS.join(', ')}\n`);
  process.exit(1);
}

const raw = readFileSync(CONFIG_PATH, 'utf8');
const config: Record<string, unknown> = JSON.parse(raw);
const previous = config.role;
config.role = requested;
writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, 'utf8');

console.log(`\n  Role switched: ${String(previous)} -> ${requested}\n`);

// A switch that leaves the app in an unbuildable state should fail loudly, now.
execSync('npx tsx scripts/validate-config.ts', { stdio: 'inherit' });
