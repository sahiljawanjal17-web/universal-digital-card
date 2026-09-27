import { getIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

/**
 * What a section shows when its data array is empty. Sections must render this
 * instead of disappearing, so a half-filled client JSON is obvious in review.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  const Icon = getIcon(icon);

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center',
        className,
      )}
    >
      <Icon className="size-8 text-fg-subtle" strokeWidth={1.5} aria-hidden />
      <p className="text-body font-medium text-fg">{title}</p>
      {description ? <p className="text-small text-fg-muted max-w-sm">{description}</p> : null}
      {action}
    </div>
  );
}
