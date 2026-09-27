import { cn } from '@/lib/utils';

/**
 * The page gutter as a component, for the few places that need it outside a
 * <SectionShell> (navbar, footer, sticky bars).
 */
export function Container({
  as: Tag = 'div',
  className,
  children,
}: {
  as?: 'div' | 'nav' | 'footer' | 'header';
  className?: string;
  children: React.ReactNode;
}) {
  return <Tag className={cn('container-page', className)}>{children}</Tag>;
}
