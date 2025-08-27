// components/charts/community/CategorySplitChart.tsx
"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Cell,
  Tooltip,
} from "recharts";

export type CategoryCount = {
  category: string;
  count: number;
  color?: string;
};

type Props = {
  data: CategoryCount[];
  height?: number; // px
};

/** Tooltip kustom: badge nilai "count" putih di dark mode, kontras di light mode */
function KategoriTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const value = p?.value ?? 0;

  return (
    <div className="
      rounded-md border px-3 py-2 shadow-md
      bg-white text-slate-800 border-slate-200
      dark:bg-slate-900/95 dark:text-slate-100 dark:border-slate-700
    ">
      <div className="text-xs font-semibold opacity-90 mb-1">{label}</div>

      <div className="flex items-center gap-2 text-xs">
        <span
          className="inline-block w-2.5 h-2.5 rounded-[3px]"
          style={{ background: p?.color }}
        />
        <span className="opacity-80">count:</span>

        {/* putih & jelas di dark mode */}
        <span className="
          font-bold px-1.5 py-0.5 rounded
          text-slate-900 bg-slate-100
          dark:text-white dark:bg-slate-700/70
        ">
          {value}
        </span>
      </div>
    </div>
  );
}

export default function CategorySplitChart({ data, height = 260 }: Props) {
  if (!data?.length) {
    return (
      <div
        className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400"
        style={{ height }}
      >
        Tidak ada data
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, bottom: 28, left: 12 }}
          barCategoryGap={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#64748b" strokeOpacity={0.25} />
          <XAxis
            dataKey="category"
            interval={0}
            height={40}
            tickMargin={10}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            width={32}
            tickLine={false}
            axisLine={false}
          />

          {/* Hapus stroke supaya tidak ada garis putih saat hover */}
          <Bar dataKey="count" name="count" radius={[6, 6, 0, 0]} stroke="none">
            {data.map((d, i) => (
              <Cell key={i} fill={d.color || "#60a5fa"} />
            ))}
          </Bar>

          {/* Hilangkan overlay putih saat hover & pakai tooltip kustom */}
          <Tooltip cursor={false} content={<KategoriTooltip />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
