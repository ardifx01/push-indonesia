"use client";
import React from "react";
import type { TooltipProps as RechartsTooltipProps } from "recharts";
import { TrendingUp } from "lucide-react";

type Category = {
  category: string;
  sales: number;
  growth: number;
  items: number;
  target: number;
  color: string;
};

export default function KategoriTooltip({ active, payload, label }: RechartsTooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as Category;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 min-w-[220px]">
        <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-600 pb-2">
          {label}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: data.color }} />
              <span className="text-gray-600 dark:text-gray-400">Aktivitas:</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100">{data.sales.toLocaleString()} event</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">Pertumbuhan:</span>
            </div>
            <span className={`font-medium ${data.growth >= 10 ? "text-green-500" : "text-orange-500"}`}>+{data.growth}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-dashed border-gray-400 rounded-sm" />
              <span className="text-gray-600 dark:text-gray-400">Target:</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100">{data.target.toLocaleString()} event</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-400">Total Subkategori:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{data.items}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
