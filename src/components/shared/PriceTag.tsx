import { formatINR } from '@/lib/utils';
import { cn } from '@/lib/utils';

/**
 * `₹2,500 / visit` with an optional struck-through original.
 * Nothing formats rupees inline — everything comes through `formatINR`.
 */
export function PriceTag({
  amount,
  unit,
  strikeFrom,
  prefix = 'from',
  className,
}: {
  amount: number | null;
  unit?: string;
  strikeFrom?: number | null;
  prefix?: string | null;
  className?: string;
}) {
  if (amount === null) return null;

  return (
    <span className={cn('inline-flex items-baseline gap-1.5', className)}>
      {prefix ? <span className="text-caption text-fg-subtle">{prefix}</span> : null}
      <span className="text-body-lg font-semibold text-fg">{formatINR(amount)}</span>
      {unit ? <span className="text-caption text-fg-muted">/ {unit}</span> : null}
      {strikeFrom ? (
        <span className="text-caption text-fg-subtle line-through">{formatINR(strikeFrom)}</span>
      ) : null}
    </span>
  );
}
