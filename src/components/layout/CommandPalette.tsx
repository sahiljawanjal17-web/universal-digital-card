'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import { ArrowRight, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCommandItems, type CommandItem } from './useCommandItems';
import { COMMAND_PALETTE_EVENT } from '@/lib/constants/ui-events';
import { trackCta } from '@/core/analytics';
import { cn } from '@/lib/utils';

const SECTION = 'commandPalette';

const GROUP_LABELS: Record<CommandItem['group'], string> = {
  section: 'Jump to',
  action: 'Actions',
};

/**
 * ⌘K / Ctrl+K. Everything it can do is derived — sections from
 * `useNavSections()`, actions from `data.cta` and the contact block — so the
 * palette never lists something the current role does not have.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const items = useCommandItems();

  const toggle = useCallback((next: boolean) => {
    setOpen(next);
    if (next) setQuery('');
  }, []);

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      toggle(!open);
    }
  });

  // Custom event, so any trigger in the tree can open the single mounted
  // palette without the chrome having to own its state.
  useEffect(() => {
    const onOpen = () => toggle(true);
    window.addEventListener(COMMAND_PALETTE_EVENT, onOpen);
    return () => window.removeEventListener(COMMAND_PALETTE_EVENT, onOpen);
  }, [toggle]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => item.label.toLowerCase().includes(needle));
  }, [items, query]);

  const groups = (['section', 'action'] as const)
    .map((group) => ({ group, entries: results.filter((item) => item.group === group) }))
    .filter(({ entries }) => entries.length > 0);

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent
        showCloseButton={false}
        className="top-[12vh] max-w-lg translate-y-0 gap-0 p-0 sm:max-w-lg"
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>

        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="size-4 shrink-0 text-fg-subtle" aria-hidden />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sections and actions…"
            aria-label="Search sections and actions"
            className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {groups.length === 0 ? (
            <p className="px-3 py-8 text-center text-small text-fg-subtle">Nothing matches that.</p>
          ) : (
            groups.map(({ group, entries }) => (
              <div key={group} className="py-1">
                <p className="px-3 py-1.5 text-caption font-medium tracking-wide text-fg-subtle uppercase">
                  {GROUP_LABELS[group]}
                </p>
                <ul>
                  {entries.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          trackCta(item.label, SECTION, { command: item.id });
                          setOpen(false);
                          item.run();
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-body text-fg',
                          'transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand',
                        )}
                      >
                        <item.icon className="size-4 shrink-0 text-fg-subtle" aria-hidden />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        <ArrowRight className="size-3.5 shrink-0 text-fg-subtle" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
