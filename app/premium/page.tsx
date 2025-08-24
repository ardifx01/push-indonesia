// app/premium/page.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Cell,
} from "recharts";
import { Users, Shield, DollarSign, TrendingUp } from "lucide-react";

import { Card, CardHeader, CardContent, CardTitle, Stat } from "@/components/insights-ui";
import KategoriTooltip from "@/components/charts/KategoriTooltip";
import { kategoriBudaya, kunjunganBulanan, sumberDataSekunder, tabelDetail } from "@/lib/budaya-data";

type TimeRange = "7d" | "30d" | "90d";
type ViewMode = "charts" | "table";
type Orientation = "vertical" | "horizontal";

export default function PremiumDashboardPage() {
  const search = useSearchParams();
  const router = useRouter();

  const initialMode = (search.get("mode") === "table" ? "table" : "charts") as ViewMode;
  const [mode, setMode] = useState<ViewMode>(initialMode);
  const [range, setRange] = useState<TimeRange>("30d");

  useEffect(() => {
    const m = search.get("mode");
    setMode(m === "table" ? "table" : "charts");
  }, [search]);

  const setModeAndUrl = (m: ViewMode) => {
    const qs = m === "table" ? "?mode=table" : "?mode=charts";
    router.replace(`/premium${qs}`);
    setMode(m);
  };

  const kpis = useMemo(
    () => ({ penelitiAktif: 824, instansiTerdaftar: 112, dokPublikasi: 486, konversiInsight: 3.4 }),
    []
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Premium · Budaya Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Insight untuk akademisi &amp; pemerintah. Primer → chart, Sekunder → card.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="range-user" className="text-xs text-gray-600 dark:text-gray-400">
            Rentang
          </label>
          <select
            id="range-user"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-2 py-1 text-xs"
            value={range}
            onChange={(e) => setRange(e.target.value as TimeRange)}
          >
            <option value="7d">7 hari</option>
            <option value="30d">30 hari</option>
            <option value="90d">90 hari</option>
          </select>

          <div className="ml-2 flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setModeAndUrl("charts")}
              className={`px-2 py-1 rounded-md text-xs ${
                mode === "charts"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Charts
            </button>
            <button
              onClick={() => setModeAndUrl("table")}
              className={`px-2 py-1 rounded-md text-xs ${
                mode === "table"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label="Peneliti Aktif" value={kpis.penelitiAktif.toLocaleString("id-ID")} color="text-blue-500" />
        <Stat icon={Shield} label="Instansi Terdaftar" value={kpis.instansiTerdaftar} color="text-emerald-500" />
        <Stat icon={DollarSign} label="Publikasi (YTD)" value={kpis.dokPublikasi} color="text-purple-500" />
        <Stat icon={TrendingUp} label="Konversi Insight" value={`${kpis.konversiInsight}%`} hint="unduhan → sitasi" color="text-orange-500" />
      </div>

      {mode === "charts" ? (
        /* ========================= CHARTS VIEW (1 kolom) ========================= */
        <div className="grid grid-cols-1 gap-6 mt-6">
          {/* 1) Partisipasi Event Budaya */}
          <Card>
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle>Partisipasi Event Budaya (Bulanan)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kunjunganBulanan} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2b3546" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
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
                      contentStyle={{ backgroundColor: "rgb(15 23 42)", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }}
                      labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
                      formatter={(raw: any) => [`${Number(raw).toLocaleString("id-ID")} partisipasi`, "Total"]}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 2) Distribusi Kategori (Primer) */}
          <CategoryDistributionCard />

          {/* 3) Tabel detail */}
          <Card>
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle>Detail Primer (Table)</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contoh tabel untuk unduhan CSV/filter</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nilai</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wilayah</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {tabelDetail.map((row, i) => (
                      <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-3 text-gray-900 dark:text-gray-100 font-medium">{i + 1}</td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center gap-2 text-gray-900 dark:text-gray-100 font-medium">
                            <span
                              className="w-3 h-3 rounded-sm"
                              style={{ background: kategoriBudaya.find((k) => k.category === row.category)?.color || "#6b7280" }}
                            />
                            {row.category}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{row.item}</td>
                        <td className="px-6 py-3 text-gray-900 dark:text-gray-100 font-semibold">
                          {row.value.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{row.region}</td>
                        <td className={`px-6 py-3 font-medium ${row.growth >= 10 ? "text-green-600" : "text-orange-500"}`}>
                          +{row.growth}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* ========================= CARDS (SEKUNDER) ========================= */
        <Card className="mt-6">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Data Sekunder (Cards)</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ringkas, klik ke sumber</p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sumberDataSekunder.map((s) => (
                <Card key={s.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">{s.title}</CardTitle>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.org}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{s.summary}</p>
                    <a href={s.url} className="text-xs text-blue-500 hover:underline">
                      Ke sumber →
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ===================== KOMPONEN CHART KATEGORI ===================== */

function CategoryDistributionCard() {
  const [orientation, setOrientation] = useState<Orientation>("vertical");

  return (
    <Card>
      <CardHeader className="flex items-start justify-between border-b border-gray-200 dark:border-gray-700">
        <div>
          <CardTitle>Distribusi Kategori (Primer)</CardTitle>
        </div>
        {/* switch orientasi */}
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-md text-xs">
          <button
            onClick={() => setOrientation("vertical")}
            className={`px-2 py-1 rounded ${orientation === "vertical" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
          >
            Vertical
          </button>
          <button
            onClick={() => setOrientation("horizontal")}
            className={`px-2 py-1 rounded ${orientation === "horizontal" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
          >
            Horizontal
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-80">
          {orientation === "vertical" ? <CategoryChartVertical /> : <CategoryChartHorizontal />}
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryChartVertical() {
  // bungkus label jadi max 2 baris
  const wrap = (label: string, limit = 12) => {
    const words = label.split(" ");
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > limit && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = (cur + " " + w).trim();
      }
    }
    if (cur) lines.push(cur);
    return lines.slice(0, 2);
  };

  const Tick = (props: any) => {
    const { x, y, payload } = props;
    const lines = wrap(String(payload.value));
    return (
      <g transform={`translate(${x},${y})`}>
        <text textAnchor="middle" fill="#9aa4b2" fontSize={12}>
          {lines.map((ln, i) => (
            <tspan key={i} x={0} dy={i === 0 ? 0 : 14}>
              {ln}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={kategoriBudaya}
        margin={{ top: 8, right: 16, bottom: 36, left: 16 }}
        barCategoryGap={24}
      >
        <CartesianGrid strokeDasharray="4 4" stroke="#2b3546" />
        <XAxis
          dataKey="category"
          interval={0}
          height={40}
          tickMargin={10}
          tick={<Tick />}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="left"
          tickLine={false}
          axisLine={false}
          width={56}
          tick={{ fill: "#9aa4b2", fontSize: 12 }}
          tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickLine={false}
          axisLine={false}
          width={44}
          tick={{ fill: "#9aa4b2", fontSize: 12 }}
          tickFormatter={(v) => `${v}%`}
        />
        <Bar yAxisId="left" dataKey="sales" radius={[6, 6, 0, 0]} maxBarSize={42}>
          {kategoriBudaya.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={entry.color} fillOpacity={0.9} />
          ))}
        </Bar>
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="growth"
          stroke="#22c55e"
          strokeWidth={3}
          dot={{ r: 4, fill: "#22c55e" }}
          activeDot={{ r: 5, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }}
        />
        <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<KategoriTooltip />} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function CategoryChartHorizontal() {
  // Horizontal = bar mendatar; label kategori aman di kiri
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        layout="vertical"
        data={kategoriBudaya}
        margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
        barCategoryGap={18}
      >
        <CartesianGrid strokeDasharray="4 4" stroke="#2b3546" />
        {/* sumbu angka untuk sales (bawah) */}
        <XAxis
          xAxisId="sales"
          type="number"
          tick={{ fill: "#9aa4b2", fontSize: 12 }}
          tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
        />
        {/* sumbu angka untuk growth (atas) */}
        <XAxis
          xAxisId="growth"
          type="number"
          orientation="top"
          tick={{ fill: "#9aa4b2", fontSize: 12 }}
          tickFormatter={(v) => `${v}%`}
        />
        {/* kategori di sisi kiri */}
        <YAxis
          type="category"
          dataKey="category"
          width={120}
          tick={{ fill: "#cbd5e1", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Bar xAxisId="sales" dataKey="sales" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {kategoriBudaya.map((entry, i) => (
            <Cell key={`cell-h-${i}`} fill={entry.color} fillOpacity={0.9} />
          ))}
        </Bar>
        <Line
          xAxisId="growth"
          type="monotone"
          dataKey="growth"
          stroke="#22c55e"
          strokeWidth={3}
          dot={{ r: 3, fill: "#22c55e" }}
          activeDot={{ r: 5, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }}
        />
        <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<KategoriTooltip />} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
