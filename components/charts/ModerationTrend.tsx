"use client";

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import ChartTooltip from "./ChartTooltip";

export type ModerationPoint = {
  w: string;
  approved: number;
  pending: number;
  rejected: number;
};

const defaultColors = {
  success: "#09f6e9",
  warning: "#f59e0b",
  danger: "#ef4444",
};

export default function ModerationTrend({
  data,
  colors = defaultColors,
  height = 288, // 72 * 4
}: {
  data: ModerationPoint[];
  colors?: typeof defaultColors;
  height?: number;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 12, right: 12 }}>
          <defs>
            <linearGradient id="gOk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.success} stopOpacity={0.25} />
              <stop offset="95%" stopColor={colors.success} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gPend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.warning} stopOpacity={0.25} />
              <stop offset="95%" stopColor={colors.warning} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gRej" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.danger} stopOpacity={0.25} />
              <stop offset="95%" stopColor={colors.danger} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2b3546" />
          <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} width={40} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="approved" name="Approved" stroke={colors.success} fill="url(#gOk)" strokeWidth={2} />
          <Area type="monotone" dataKey="pending"  name="Pending"  stroke={colors.warning} fill="url(#gPend)" strokeWidth={2} />
          <Area type="monotone" dataKey="rejected" name="Rejected" stroke={colors.danger}  fill="url(#gRej)"  strokeWidth={2} />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
