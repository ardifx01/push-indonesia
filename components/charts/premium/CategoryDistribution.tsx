"use client";

import * as React from "react";
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
import type { TooltipProps } from "recharts";

// Define our own types since they're not exported in newer recharts versions
type ValueType = string | number | Array<string | number>;
type NameType = string | number;

export type Orientation = "vertical" | "horizontal";
export type CategoryDatum = {
  category: string;
  sales: number;   // nilai bar (ex: jumlah / sales)
  growth: number;  // nilai line (%)
  color?: string;  // warna bar
};

type Props = {
  readonly data: CategoryDatum[];
  readonly orientation?: Orientation;   // default: "vertical"
  readonly height?: number;             // default: 320
  readonly showLegend?: boolean;        // default: true
};

/* ---------- hook kecil untuk deteksi tema ---------- */
function useIsDark() {
  const get = () => {
    if (typeof window === "undefined") return false;
    const root = document.documentElement;
    const classDark = root.classList.contains("dark");
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    return classDark || mql;
  };
  const [dark, setDark] = React.useState<boolean>(get);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const obs = new MutationObserver(() => setDark(get));
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setDark(get);
    mql.addEventListener?.("change", onChange);

    return () => {
      obs.disconnect();
      mql.removeEventListener?.("change", onChange);
    };
  }, []);

  return dark;
}

/* ---------- Komponen Tooltip Di Luar ---------- */
const ThemedTooltip: React.FC<TooltipProps<ValueType, NameType> & { dark: boolean }> = ({
  active,
  payload,
  label,
  dark
}) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className={`p-3 rounded-md border shadow-md ${dark
        ? "bg-slate-900 border-slate-700 text-slate-100"
        : "bg-white border-slate-200 text-slate-900"
      }`}>
      <p className="font-medium mb-1">{String(label)}</p>
      {payload.map((p, i) => {
        const name = String(p.name ?? "");
        const val = Number(p.value ?? 0);
        const color = p.color || p.payload?.color || "#60a5fa";
        return (
          <div key={`${name}-${i}`} className="flex items-center gap-2 text-xs">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className={dark ? "text-slate-300" : "text-slate-600"}>{name}:</span>
            <span className="font-semibold">
              {name.toLowerCase() === "sales" ? `${(val / 1000).toFixed(0)}K` : `${val}%`}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function CategoryDistribution({
  data,
  orientation = "vertical",
  height = 320,
  showLegend = true,
}: Props) {
  const isDark = useIsDark();

  const gridColor = isDark ? "#2b3546" : "#e2e8f0";
  const tickColor = isDark ? "#9aa4b2" : "#475569";
  const legendColor = isDark ? "#9aa4b2" : "#475569";

  // Create tooltip component outside of render
  const tooltipComponent = React.useCallback(
    (props: any) => <ThemedTooltip {...props} dark={isDark} />,
    [isDark]
  );

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-gray-500" style={{ height }}>
        Tidak ada data
      </div>
    );
  }

  /* ---------- Horizontal ---------- */
  if (orientation === "horizontal") {
    return (
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            layout="vertical"
            data={data}
            margin={{ top: 16, right: 24, bottom: 16, left: 100 }}
            barCategoryGap={18}
          >
            <defs>
              {data.map((d, i) => (
                <linearGradient key={`hGrad-${d.category}-${i}`} id={`hGrad-${i}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={d.color || "#60a5fa"} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={d.color || "#60a5fa"} stopOpacity={1} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              xAxisId="sales"
              type="number"
              tick={{ fill: tickColor, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}K`}
            />
            <XAxis
              xAxisId="growth"
              type="number"
              orientation="top"
              tick={{ fill: tickColor, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${Number(v)}%`}
            />
            <YAxis
              dataKey="category"
              type="category"
              width={110}
              tick={{ fill: isDark ? "#e5e7eb" : "#334155", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />

            <Bar xAxisId="sales" dataKey="sales" name="Sales" radius={[0, 8, 8, 0]} maxBarSize={24}>
              {data.map((d, i) => <Cell key={`cell-${d.category}-${i}`} fill={`url(#hGrad-${i})`} />)}
            </Bar>

            <Line
              xAxisId="growth"
              type="monotone"
              dataKey="growth"
              name="Growth"
              stroke="#22d3ee"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#22d3ee", strokeWidth: 2, stroke: isDark ? "#0f172a" : "#ffffff" }}
              activeDot={{ r: 6, fill: "#22d3ee", stroke: isDark ? "#0f172a" : "#ffffff", strokeWidth: 2 }}
            />

            <Tooltip content={tooltipComponent} />
            {showLegend && <Legend wrapperStyle={{ color: legendColor }} iconType="rect" />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

  /* ---------- Vertical (default) ---------- */
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 16, right: 24, bottom: 48, left: 16 }} barCategoryGap={24}>
          <defs>
            {data.map((d, i) => (
              <linearGradient key={`vGrad-${d.category}-${i}`} id={`vGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={d.color || "#60a5fa"} stopOpacity={1} />
                <stop offset="100%" stopColor={d.color || "#60a5fa"} stopOpacity={0.7} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="category"
            interval={0}
            height={48}
            tickMargin={8}
            tickLine={false}
            axisLine={false}
            tick={{ fill: tickColor, fontSize: 11 }}
            angle={-35}
            textAnchor="end"
          />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            width={52}
            tick={{ fill: tickColor, fontSize: 11 }}
            tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}K`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            width={44}
            tick={{ fill: tickColor, fontSize: 11 }}
            tickFormatter={(v) => `${Number(v)}%`}
          />

          <Bar yAxisId="left" dataKey="sales" name="Sales" radius={[8, 8, 0, 0]} maxBarSize={48}>
            {data.map((d, i) => <Cell key={`cell-${d.category}-${i}`} fill={`url(#vGrad-${i})`} />)}
          </Bar>

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="growth"
            name="Growth"
            stroke="#22d3ee"
            strokeWidth={3}
            dot={{ r: 5, fill: "#22d3ee", strokeWidth: 2, stroke: isDark ? "#0f172a" : "#ffffff" }}
            activeDot={{ r: 7, fill: "#22d3ee", stroke: isDark ? "#0f172a" : "#ffffff", strokeWidth: 3 }}
          />

          <Tooltip content={tooltipComponent} />
          {showLegend && <Legend wrapperStyle={{ color: legendColor }} iconType="rect" />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
