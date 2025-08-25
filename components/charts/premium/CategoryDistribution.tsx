// components/charts/premium/CategoryDistribution.tsx
"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Line,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import KategoriTooltip from "@/components/charts/KategoriTooltip";

export type Orientation = "vertical" | "horizontal";

export type CategoryDatum = {
  category: string;
  sales: number;   // nilai bar
  growth: number;  // nilai line (%)
  color?: string;  // warna bar
};

type Props = {
  data: CategoryDatum[];
  orientation?: Orientation;
  height?: number; // px
};

export default function CategoryDistribution({
  data,
  orientation = "vertical",
  height = 320,
}: Props) {
  // Guard: kalau tidak ada tinggi/width parent, ResponsiveContainer akan 0x0.
  // Maka kita pakai div dengan style {height} supaya pasti punya tinggi.
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400"
        style={{ height }}
      >
        Tidak ada data
      </div>
    );
  }

  if (orientation === "horizontal") {
    return (
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            layout="vertical"
            data={data}
            margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
            barCategoryGap={18}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#2b3546" />
            <XAxis
              xAxisId="sales"
              type="number"
              tick={{ fill: "#9aa4b2", fontSize: 12 }}
            />
            <XAxis
              xAxisId="growth"
              type="number"
              orientation="top"
              tick={{ fill: "#9aa4b2", fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              dataKey="category"
              type="category"
              width={120}
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Bar
              xAxisId="sales"
              dataKey="sales"
              name="Sales"
              radius={[0, 6, 6, 0]}
              maxBarSize={22}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color || "#60a5fa"} />
              ))}
            </Bar>
            <Line
              xAxisId="growth"
              type="monotone"
              dataKey="growth"
              name="Growth"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 3, fill: "#22c55e" }}
              activeDot={{ r: 5, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }}
            />
            <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<KategoriTooltip />} />
            <Legend />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // VERTICAL
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 16, bottom: 36, left: 16 }}
          barCategoryGap={24}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#2b3546" />
          <XAxis
            dataKey="category"
            interval={0}
            height={40}
            tickMargin={10}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9aa4b2", fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            width={56}
            tick={{ fill: "#9aa4b2", fontSize: 12 }}
            tickFormatter={(v) => `${(Number(v) / 1000).toFixed(1)}K`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            width={44}
            tick={{ fill: "#9aa4b2", fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Bar yAxisId="left" dataKey="sales" name="Sales" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color || "#60a5fa"} />
            ))}
          </Bar>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="growth"
            name="Growth"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4, fill: "#22c55e" }}
            activeDot={{ r: 5, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }}
          />
          <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<KategoriTooltip />} />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
