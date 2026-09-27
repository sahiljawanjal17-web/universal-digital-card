import { getIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

/** One credential chip. Shape mirrors `data.trust.badges[]` exactly. */
export function TrustBadge({
  icon,
  label,
  sub,
  className,
}: {
  icon: string;
  label: string;
  sub?: string;
  className?: string;
}) {
  const Icon = getIcon(icon);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2.5',
        className,
      )}
    >
      <Icon className="size-5 shrink-0 text-brand" strokeWidth={1.75} aria-hidden />
      <span className="flex flex-col leading-tight">
        <span className="text-small font-medium text-fg">{label}</span>
        {sub ? <span className="text-caption text-fg-subtle">{sub}</span> : null}
      </span>
    </span>
  );
}
