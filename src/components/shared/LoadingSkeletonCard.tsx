import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** The lazy-module fallback. `ModuleSlot` renders this while a widget loads. */
export function LoadingSkeletonCard({
  lines = 3,
  withMedia = false,
  className,
}: {
  lines?: number;
  withMedia?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('surface-card flex flex-col gap-3 p-5', className)} aria-hidden>
      {withMedia ? <Skeleton className="h-40 w-full rounded-lg" /> : null}
      <Skeleton className="h-5 w-1/3" />
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}
