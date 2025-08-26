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
import { useState } from "react";

// Custom X-axis tick component
const XTick = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="currentColor"
        fontSize="12"
        fontWeight="500"
        className="select-none text-slate-600 dark:text-slate-400"
      >
        {payload.value}
      </text>
    </g>
  );
};

// Custom tooltip
const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-600/50 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm mb-1">{label}</p>
        <p className="text-slate-600 dark:text-slate-300 text-sm flex items-center gap-2">
          <span 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.payload.color }}
          ></span>
          <span className="font-medium">{data.value}</span> items
        </p>
      </div>
    );
  }
  return null;
};

export type CategoryBar = { category: string; count: number; color: string };

export default function CategoryDistribution({
  data,
  height = 320,
}: {
  data: CategoryBar[];
  height?: number;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sample data for demonstration
  const sampleData = (data && data.length > 0) ? data : [
    { category: "Technology", count: 45, color: "#6366f1" },
    { category: "Design", count: 32, color: "#8b5cf6" },
    { category: "Marketing", count: 28, color: "#06b6d4" },
    { category: "Sales", count: 38, color: "#10b981" },
    { category: "Support", count: 22, color: "#f59e0b" },
    { category: "HR", count: 15, color: "#ef4444" },
  ];

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={sampleData} 
          margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
          onMouseMove={(data: any) => {
            if (data && data.activeTooltipIndex !== undefined) {
              setHoveredIndex(data.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Grid */}
          <CartesianGrid 
            strokeDasharray="2 4" 
            stroke="#e2e8f0"
            strokeOpacity={0.4}
            horizontal={true}
            vertical={false}
          />
          
          {/* X Axis */}
          <XAxis 
            dataKey="category" 
            interval={0} 
            height={60} 
            tickMargin={15} 
            tick={<XTick />} 
            tickLine={false} 
            axisLine={{ 
              stroke: "#e2e8f0", 
              strokeWidth: 1
            }}
          />
          
          {/* Y Axis */}
          <YAxis 
            tickLine={false} 
            axisLine={{ 
              stroke: "#e2e8f0", 
              strokeWidth: 1 
            }} 
            width={50} 
            tick={{ 
              fill: "#64748b", 
              fontSize: 12, 
              fontWeight: 500
            }}
          />
          
          {/* Tooltip */}
          <Tooltip 
            cursor={{ 
              fill: "rgba(99, 102, 241, 0.05)",
              stroke: "rgba(99, 102, 241, 0.2)",
              strokeWidth: 1
            }} 
            content={<ChartTooltip />}
          />
          
          {/* Bar */}
          <Bar 
            dataKey="count" 
            name="Jumlah" 
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          >
            {sampleData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                fillOpacity={hoveredIndex === index ? 1 : 0.85}
                style={{
                  filter: hoveredIndex === index 
                    ? "drop-shadow(0 8px 16px rgba(0,0,0,0.15))" 
                    : "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}