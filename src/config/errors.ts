/**
 * Config parse failures must point at the exact JSON path, otherwise a typo in
 * a 400-line data file costs an afternoon. Shared by resolveConfig() and
 * scripts/validate-config.ts so dev and CI print the same thing.
 */
import type { z } from 'zod';

/** "module.slots.periods[1].range" */
export function issuePath(path: ReadonlyArray<PropertyKey>): string {
  return path.reduce<string>((acc, segment) => {
    if (typeof segment === 'number') return `${acc}[${segment}]`;
    return acc ? `${acc}.${String(segment)}` : String(segment);
  }, '');
}

export function formatConfigError(source: string, error: z.ZodError): string {
  const lines = error.issues.map((issue) => {
    const at = issuePath(issue.path);
    return `   at ${at || '(root)'}\n   ${issue.message}`;
  });
  return [`Config error in ${source}`, ...lines].join('\n');
}

export class ConfigError extends Error {
  constructor(source: string, error: z.ZodError) {
    super(formatConfigError(source, error));
    this.name = 'ConfigError';
  }
}
