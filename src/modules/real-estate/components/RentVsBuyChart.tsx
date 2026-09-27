'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatINRShort } from '@/lib/utils';
import type { ProjectionYear } from '../lib/rent-vs-buy';

interface TooltipPayload {
  dataKey?: string | number;
  value?: number;
  color?: string;
}

/**
 * Ten years of net cost, both ways. Colours come from the theme's CSS variables
 * so the chart re-skins with the role, and the breakeven year is drawn as a
 * reference line rather than left for the eye to find.
 */
export function RentVsBuyChart({
  rows,
  breakevenYear,
}: {
  rows: ProjectionYear[];
  breakevenYear: number | null;
}) {
  const series = rows.map((row) => ({
    year: row.year,
    buy: row.buyCost,
    rent: row.rentCost,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 8, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            tick={{ fill: 'var(--fg-subtle)', fontSize: 12 }}
            tickFormatter={(year: number) => `Y${year}`}
          />
          <YAxis
            width={64}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--fg-subtle)', fontSize: 12 }}
            tickFormatter={(value: number) => formatINRShort(value)}
          />
          <Tooltip
            cursor={{ stroke: 'var(--border-strong)' }}
            contentStyle={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              color: 'var(--fg)',
              fontSize: 13,
            }}
            labelFormatter={(year: number | string) => `Year ${year}`}
            formatter={(value: number, name: string) => [
              formatINRShort(value),
              name === 'buy' ? 'Buying' : 'Renting',
            ]}
            itemSorter={(item: TooltipPayload) => (item.dataKey === 'buy' ? 0 : 1)}
          />
          {breakevenYear ? (
            <ReferenceLine
              x={breakevenYear}
              stroke="var(--success)"
              strokeDasharray="4 4"
              label={{
                value: `Breakeven Y${breakevenYear}`,
                position: 'insideTopRight',
                fill: 'var(--success)',
                fontSize: 12,
              }}
            />
          ) : null}
          <Line
            type="monotone"
            dataKey="buy"
            stroke="var(--brand)"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="rent"
            stroke="var(--accent)"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
