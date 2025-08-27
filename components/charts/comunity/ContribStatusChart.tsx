// components/charts/community/ContribStatusChart.tsx
"use client";

import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from "recharts";

const data = [
  { w: "W-1", approved: 1, pending: 2, rejected: 0 },
  { w: "W-2", approved: 2, pending: 2, rejected: 1 },
  { w: "W-3", approved: 3, pending: 1, rejected: 0 },
  { w: "W-4", approved: 2, pending: 3, rejected: 1 },
  { w: "W-5", approved: 4, pending: 2, rejected: 0 },
  { w: "W-6", approved: 5, pending: 2, rejected: 1 },
  { w: "W-7", approved: 6, pending: 2, rejected: 1 },
  { w: "W-8", approved: 7, pending: 1, rejected: 1 },
];

const Tt = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
      {label && <div className="text-xs font-semibold mb-1">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="opacity-80">{p.name}:</span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ContribStatusChart() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 12, right: 12 }}>
          <defs>
            <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2b3546" />
          <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} width={40} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
          <Tooltip content={<Tt />} />
          <Area type="monotone" dataKey="approved" name="Approved" stroke="#10b981" fill="url(#ga)" strokeWidth={2} />
          <Area type="monotone" dataKey="pending"  name="Pending"  stroke="#f59e0b" fill="url(#gp)" strokeWidth={2} />
          <Area type="monotone" dataKey="rejected" name="Rejected" stroke="#ef4444" fill="url(#gr)" strokeWidth={2} />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
