"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type ParticipationPoint = { month: string; value: number };

export default function ParticipationLine({
  data,
  height = 320,
}: {
  data: ParticipationPoint[];
  height?: number;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 12, right: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2b3546" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9aa4b2", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={60}
            tick={{ fill: "#9aa4b2", fontSize: 12 }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7aa2ff"
            strokeWidth={3}
            dot={{ fill: "#7aa2ff", r: 3 }}
            activeDot={{ r: 5, fill: "#7aa2ff", stroke: "#fff", strokeWidth: 2 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgb(15 23 42)",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#e2e8f0",
            }}
            labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
            formatter={(raw: any) => [
              `${Number(raw).toLocaleString("id-ID")} partisipasi`,
              "Total",
            ]}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
