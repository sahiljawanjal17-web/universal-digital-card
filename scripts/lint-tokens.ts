import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');
// Vendored shadcn components live in src/components/ui and are scanned too:
// docs/07-CONVENTIONS.md requires raw colors to be swapped for tokens when a
// component is copied in, so an unadapted one should fail this check.
// (An earlier version excluded `src/ui`, a path that does not exist.)

function walk(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath, fileList);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const files = walk(SRC_DIR);
let failed = false;

const rawTailwindColors = /bg-(?:blue|black|white|red|green|yellow|indigo|purple|pink|gray|slate)(?:-\d{2,3}(?:\/\d{1,2})?)?|text-(?:white|black|blue|red|green|yellow|indigo|purple|pink|gray|slate)(?:-\d{2,3}(?:\/\d{1,2})?)?/g;
const roleConditional = /role\s*===\s*['"][^'"]+['"]/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  
  const matches = [];
  
  let match;
  while ((match = rawTailwindColors.exec(content)) !== null) {
    matches.push(`Raw Tailwind color: ${match[0]}`);
  }
  
  while ((match = roleConditional.exec(content)) !== null) {
    matches.push(`Hardcoded role conditional: ${match[0]}`);
  }

  if (matches.length > 0) {
    console.error(`\nFile: ${file}`);
    for (const m of matches) {
      console.error(`  - ${m}`);
    }
    failed = true;
  }
}

if (failed) {
  console.error('\nLinting failed: Found raw Tailwind colors or hardcoded role conditionals in src/.');
  process.exit(1);
} else {
  console.log('Linting passed: No raw Tailwind colors or hardcoded role conditionals found.');
}

