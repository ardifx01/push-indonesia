"use client";

import React from "react";

type RTooltip = { active?: boolean; payload?: any[]; label?: string };

export default function ChartTooltip({ active, payload, label }: RTooltip) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
      {label && <div className="text-xs font-semibold mb-1">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: p.color }}
          />
          <span className="opacity-80">{p.name}:</span>
          <span className="font-semibold">
            {p.value}
            {p.name === "Growth" ? "%" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
