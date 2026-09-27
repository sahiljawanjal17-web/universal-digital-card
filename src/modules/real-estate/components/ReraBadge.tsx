import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * RERA registration is the single strongest trust signal an Indian listing can
 * carry (PART-05 R10), so it is shown verbatim rather than abbreviated.
 */
export function ReraBadge({ reraId, className }: { reraId: string; className?: string }) {
  if (!reraId) return null;

  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1',
        className,
      )}
    >
      <ShieldCheck className="size-3.5 shrink-0 text-success" strokeWidth={2} aria-hidden />
      <span className="text-caption text-fg-muted">
        RERA <span className="font-medium text-fg">{reraId}</span>
      </span>
    </span>
  );
}
