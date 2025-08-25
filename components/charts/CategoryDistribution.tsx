"use client";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";
import XTick from "./XTick";
import ChartTooltip from "./ChartTooltip";

export type CategoryBar = { category: string; count: number; color: string };

export default function CategoryDistribution({
  data,
  height = 320,
}: {
  data: CategoryBar[];
  height?: number;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 36, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2b3546" />
          <XAxis dataKey="category" interval={0} height={40} tickMargin={10} tick={<XTick />} tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
          <Tooltip cursor={false} content={<ChartTooltip />} />
          <Bar dataKey="count" name="Jumlah" radius={[6, 6, 0, 0]}>
            {data.map((b, i) => (
              <Cell key={i} fill={b.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
