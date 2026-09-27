import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Every calculator output carries one of these (docs/07-CONVENTIONS §9) —
 * the numbers are indicative, never an offer.
 */
export function DisclaimerNote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'flex items-start gap-2 rounded-lg bg-surface-2 px-3 py-2.5 text-caption text-fg-muted',
        className,
      )}
    >
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
