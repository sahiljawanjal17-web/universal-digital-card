'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatINRShort } from '@/lib/utils';
import type { AmortizationYear } from '../lib/emi';

/**
 * Year-wise repayment split, collapsed by default — a 20-row table would
 * otherwise bury the EMI figure the visitor came for.
 */
export function AmortizationTable({ rows }: { rows: AmortizationYear[] }) {
  const [open, setOpen] = useState(false);

  if (rows.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface">
      <Button
        type="button"
        variant="ghost"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="h-12 w-full justify-between px-4 text-body font-medium text-fg"
      >
        Year-wise repayment ({rows.length} years)
        <ChevronDown
          aria-hidden
          className={cn('size-4 transition-transform', open && 'rotate-180')}
        />
      </Button>

      {open ? (
        <div className="max-h-80 overflow-y-auto border-t border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Interest</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.year}>
                  <TableCell className="font-medium text-fg">{row.year}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatINRShort(row.principalPaid)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatINRShort(row.interestPaid)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-fg-muted">
                    {formatINRShort(row.balance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
