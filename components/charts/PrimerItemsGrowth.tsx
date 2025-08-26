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
import { useState } from "react";

// Custom X-axis tick component with theme-aware styling
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

// Custom tooltip with theme-aware styling
const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-600/50 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-slate-600 dark:text-slate-300 text-sm flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="font-medium">{entry.name}:</span>
              <span className="font-semibold">
                {entry.name === "Growth" ? `${entry.value}%` : entry.value}
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Custom Legend with theme-aware styling
const CustomLegend = ({ payload }: any) => {
  if (!payload) return null;
  
  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export type PrimerDatum = {
  category: string;
  items: number;
  growth: number;
  color: string;
};

export default function PrimerItemsGrowth({
  data,
  height = 380,
}: {
  data: PrimerDatum[];
  height?: number;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sample data for demonstration
  const sampleData = (data && data.length > 0) ? data : [
    { category: "Electronics", items: 120, growth: 15.2, color: "#6366f1" },
    { category: "Clothing", items: 85, growth: 8.7, color: "#8b5cf6" },
    { category: "Home & Garden", items: 95, growth: 12.3, color: "#06b6d4" },
    { category: "Sports", items: 110, growth: 18.5, color: "#10b981" },
    { category: "Books", items: 60, growth: 5.4, color: "#f59e0b" },
    { category: "Beauty", items: 75, growth: 9.8, color: "#ef4444" },
  ];

  const successColor = "#10b981"; // Emerald-500 for better theme compatibility

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={sampleData} 
          margin={{ top: 20, right: 30, bottom: 60, left: 20 }}
          onMouseMove={(data: any) => {
            if (data && data.activeTooltipIndex !== undefined) {
              setHoveredIndex(data.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Theme-aware grid */}
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
            axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
          />
          
          {/* Left Y Axis - Items */}
          <YAxis 
            yAxisId="left"
            tickLine={false} 
            axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }} 
            width={50} 
            tick={{ 
              fill: "#64748b", 
              fontSize: 12, 
              fontWeight: 500
            }}
          />
          
          {/* Right Y Axis - Growth % */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tickFormatter={(v) => `${v}%`} 
            tickLine={false} 
            axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }} 
            width={50} 
            tick={{ 
              fill: "#64748b", 
              fontSize: 12, 
              fontWeight: 500
            }}
          />
          
          {/* Bar Chart for Items */}
          <Bar 
            yAxisId="left" 
            dataKey="items" 
            name="Items" 
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
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
          
          {/* Line Chart for Growth */}
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="growth" 
            name="Growth" 
            stroke={successColor} 
            strokeWidth={3} 
            dot={{ 
              r: 4, 
              fill: successColor, 
              strokeWidth: 2,
              stroke: "#fff"
            }} 
            activeDot={{ 
              r: 6, 
              fill: successColor,
              stroke: "#fff",
              strokeWidth: 2,
              style: {
                filter: "drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))"
              }
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
          
          {/* Custom Legend */}
          <Legend content={<CustomLegend />} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}