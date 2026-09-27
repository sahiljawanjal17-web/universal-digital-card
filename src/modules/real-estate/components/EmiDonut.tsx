'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { formatINRShort } from '@/lib/utils';

/**
 * Principal vs interest, as one ring. shadcn's `chart` wrapper is not in the
 * registry this project can reach, so recharts is used directly and coloured
 * from the theme's CSS variables — the ring re-themes with the role.
 */
export function EmiDonut({
  principal,
  interest,
}: {
  principal: number;
  interest: number;
}) {
  const data = [
    { key: 'principal', label: 'Principal', value: Math.max(0, principal), fill: 'var(--brand)' },
    { key: 'interest', label: 'Interest', value: Math.max(0, interest), fill: 'var(--accent)' },
  ];
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-48 w-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={2}
              strokeWidth={0}
              isAnimationActive={false}
            >
              {data.map((slice) => (
                <Cell key={slice.key} fill={slice.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-caption uppercase tracking-wide text-fg-subtle">Total</span>
          <span className="text-h3 font-semibold text-fg">{formatINRShort(total)}</span>
        </div>
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {data.map((slice) => (
          <li key={slice.key} className="flex items-center gap-2 text-small text-fg-muted">
            <span
              aria-hidden
              className="size-2.5 rounded-full"
              style={{ backgroundColor: slice.fill }}
            />
            {slice.label}
            <span className="font-medium text-fg">{formatINRShort(slice.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
