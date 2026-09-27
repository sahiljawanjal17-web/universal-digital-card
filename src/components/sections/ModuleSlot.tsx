'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { moduleRegistry } from '@/modules/registry';
import { LoadingSkeletonCard } from '@/components/shared';
import { useRole } from '@/lib/hooks/useRole';

/**
 * Renders a role module's widget by name. Together with <SectionRenderer/> this
 * is the only file allowed to dispatch on the role key — every other component
 * stays role-blind.
 *
 * A module barrel is expected to export `widgets`, a record of widget name to
 * component. Until PART-05..PART-10 fill those in, an unknown widget renders
 * nothing in production and a labelled placeholder in development.
 */
type WidgetComponent = ComponentType<Record<string, never>>;

function readWidget(mod: unknown, widget: string): WidgetComponent | null {
  if (typeof mod !== 'object' || mod === null) return null;
  const widgets = (mod as { widgets?: unknown }).widgets;
  if (typeof widgets !== 'object' || widgets === null) return null;
  const found = (widgets as Record<string, unknown>)[widget];
  return typeof found === 'function' ? (found as WidgetComponent) : null;
}

export function ModuleSlot({ widget }: { widget: string }) {
  const { role } = useRole();
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'missing'; Widget?: WidgetComponent }>({
    status: 'loading',
  });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });

    moduleRegistry[role]()
      .then((mod) => {
        if (!active) return;
        const Widget = readWidget(mod, widget);
        setState(Widget ? { status: 'ready', Widget } : { status: 'missing' });
      })
      .catch(() => {
        if (active) setState({ status: 'missing' });
      });

    return () => {
      active = false;
    };
  }, [role, widget]);

  if (state.status === 'loading') {
    return (
      <div className="section-y">
        <div className="container-page">
          <LoadingSkeletonCard lines={4} withMedia />
        </div>
      </div>
    );
  }

  if (state.status === 'missing' || !state.Widget) {
    if (process.env.NODE_ENV === 'production') return null;
    return (
      <div className="section-y">
        <div className="container-page">
          <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-6 text-center text-small text-fg-subtle">
            Module <code className="font-medium text-fg-muted">{widget}</code> is not implemented
            yet for this role.
          </p>
        </div>
      </div>
    );
  }

  const { Widget } = state;
  return (
    <div id={`module-${widget}`} className="scroll-mt-20">
      <Widget />
    </div>
  );
}
