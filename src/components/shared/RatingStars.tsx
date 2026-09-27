import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Rounded to the nearest half star, drawn as a clipped overlay so a 4.6 does
 * not read as a 5. The numeric value is the accessible label.
 */
export function RatingStars({
  value,
  count = 5,
  size = 16,
  showValue = false,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  const filled = Math.round(value * 2) / 2;

  return (
    <span
      className={cn('inline-flex items-center gap-1', className)}
      role="img"
      aria-label={`${value.toFixed(1)} out of ${count}`}
    >
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: count }, (_, i) => {
          const fill = Math.min(1, Math.max(0, filled - i));
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-border-strong" strokeWidth={1.5} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star size={size} className="text-accent fill-accent" strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </span>
      {showValue ? <span className="text-small font-medium text-fg">{value.toFixed(1)}</span> : null}
    </span>
  );
}
