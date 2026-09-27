import { cn } from '@/lib/utils';

/**
 * The eyebrow + title + subtitle stack every section header uses.
 * `id` is wired by SectionShell so the anchor and aria-labelledby match.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = 'start',
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
  className?: string;
}) {
  return (
    <header
      className={cn(
        'flex flex-col gap-2',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-caption font-medium tracking-widest text-brand uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 id={id} className="text-h2 font-display text-balance text-fg">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-body text-pretty text-fg-muted max-w-prose">{subtitle}</p>
      ) : null}
    </header>
  );
}
