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
            Insight untuk akademisi & pemerintah. Primer → chart, Sekunder → card.
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
        /* ========================= CHARTS VIEW ========================= */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {/* Partisipasi Bulanan - lebar 2 kolom di lg & xl */}
          <Card className="lg:col-span-2 xl:col-span-2">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle>Partisipasi Event Budaya (Bulanan)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kunjunganBulanan} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={60}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: "#6366f1", r: 4 }}
                      activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8 }}
                      labelStyle={{ color: "#111827", fontWeight: 600 }}
                      formatter={(raw: any) => [`${Number(raw).toLocaleString("id-ID")} partisipasi`, "Total"]}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribusi Kategori (Primer) - lebih lega + scroll horizontal */}
          <Card className="lg:col-span-2 xl:col-span-1">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle>Distribusi Kategori (Primer)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* wrapper scroll horizontal */}
              <div className="h-80 w-full overflow-x-auto">
                {/* width dinamis: 140px per kategori, min 560px */}
                <div style={{ width: Math.max(kategoriBudaya.length * 140, 560), height: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={kategoriBudaya}
                      margin={{ top: 10, right: 24, bottom: 44, left: 24 }}
                      barCategoryGap={24}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="category"
                        interval={0}
                        tickLine={false}
                        axisLine={false}
                        height={50}
                        tickMargin={12}
                        angle={-20}
                        textAnchor="end"
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <YAxis
                        yAxisId="left"
                        tickLine={false}
                        axisLine={false}
                        width={56}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        width={48}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        tickFormatter={(v) => `${v}%`}
                      />

                      <Bar yAxisId="left" dataKey="sales" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {kategoriBudaya.map((entry, i) => (
                          <Cell key={`cell-sales-${i}`} fill={entry.color} fillOpacity={0.85} />
                        ))}
                      </Bar>

                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="growth"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#22c55e" }}
                        activeDot={{ r: 6, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }}
                      />

                      <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} content={<KategoriTooltip />} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabel detail - full width di bawah */}
          <Card className="lg:col-span-2 xl:col-span-3">
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
                    <a href={s.url} className="text-xs text-blue-600 hover:underline">
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
