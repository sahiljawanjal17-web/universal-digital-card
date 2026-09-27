import { cn } from '@/lib/utils';

/**
 * Reserves the box before the media loads — this is what keeps CLS at zero.
 * Ratio is a plain "16/9" style string so data JSON can carry it.
 */
export function AspectBox({
  ratio = '16/9',
  className,
  children,
}: {
  ratio?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-xl bg-surface-2', className)}
      style={{ aspectRatio: ratio }}
    >
      {children}
    </div>
  );
}
