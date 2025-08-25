"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  Cell,
} from "recharts";
import XTick from "./XTick";
import ChartTooltip from "./ChartTooltip";

export type PrimerDatum = {
  category: string;
  items: number;
  growth: number;
  color: string;
};

const success = "#09f6e9";

export default function PrimerItemsGrowth({
  data,
  height = 320,
}: {
  data: PrimerDatum[];
  height?: number;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 36, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2b3546" />
          <XAxis dataKey="category" interval={0} height={40} tickMargin={10} tick={<XTick />} tickLine={false} axisLine={false} />
          <YAxis yAxisId="left"  tickLine={false} axisLine={false} width={48} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} width={44} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
          <Bar yAxisId="left" dataKey="items" name="Items" radius={[6, 6, 0, 0]}>
            {data.map((p, i) => (
              <Cell key={i} fill={p.color} />
            ))}
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey="growth" name="Growth" stroke={success} strokeWidth={3} dot={{ r: 3, fill: success }} />
          <Tooltip cursor={false} content={<ChartTooltip />} />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
