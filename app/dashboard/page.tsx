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
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Bar,
} from "recharts";
import { Database, Shield, Globe, Code2 } from "lucide-react";

import { Card, CardHeader, CardContent, CardTitle, Badge, Stat } from "@/components/insights-ui";
import KategoriTooltip from "@/components/charts/KategoriTooltip";
import { kategoriBudaya, kunjunganBulanan, sumberDataSekunder, trafikSumber } from "@/lib/budaya-data";

type TimeRange = "7d" | "30d" | "90d";
type ViewMode = "charts" | "table";

export default function AdminDashboardPage() {
  const search = useSearchParams();
  const router = useRouter();

  const initialTab = (search.get("tab") === "api" ? "api" : "dashboard") as "dashboard" | "api";
  const [tab, setTab] = useState<"dashboard" | "api">(initialTab);
  const [range] = useState<TimeRange>("30d");
  const [viewMode] = useState<ViewMode>("charts");

  useEffect(() => {
    const t = search.get("tab");
    setTab(t === "api" ? "api" : "dashboard");
  }, [search]);

  const setTabAndUrl = (t: "dashboard" | "api") => {
    const qs = t === "api" ? "?tab=api" : "";
    router.replace(`/dashboard${qs}`);
    setTab(t);
  };

  const kpis = useMemo(
    () => ({ datasets: 142, institutions: 37, apiCalls: 128_430, coverage: "34/38 Kab/Kota Jatim" }),
    []
  );

  const curl = `curl -X GET \\
  'https://api.budaya.id/v1/insights?category=tari&range=2025-01:2025-08' \\
  -H 'Authorization: Bearer <API_KEY>'`;

  const exampleResp = {
    category: "Tari Tradisional",
    range: { from: "2025-01-01", to: "2025-08-24" },
    metrics: { total_events: 1200, growth_pct: 18.6, regions: ["Jatim", "DIY", "Jateng"] },
    series: [
      { month: "Jan", value: 120 },
      { month: "Feb", value: 134 },
      { month: "Mar", value: 150 },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header + Tab */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Admin · Budaya Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Primer → chart · Sekunder → card · API tersedia
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setTabAndUrl("dashboard")}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              tab === "dashboard"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setTabAndUrl("api")}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              tab === "api"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            API Docs
          </button>
        </div>
      </div>

      {tab === "api" ? (
        /* ========================= API DOCS ========================= */
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">API Documentation</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Akses data insight budaya via REST API. Auth: Bearer token.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle>GET /v1/insights</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Param: <code>category</code>, <code>range</code>, <code>region</code>, <code>granularity</code>
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto">
                  <code>{curl}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle>Response (200)</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto">
                  <code>{JSON.stringify(exampleResp, null, 2)}</code>
                </pre>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle>Skema Autentikasi</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm text-gray-700 dark:text-gray-300">
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  Gunakan <code>Authorization: Bearer &lt;API_KEY&gt;</code> di setiap request.
                </li>
                <li>Rate limit default: 60 req/menit. Hubungi admin untuk kuota riset.</li>
                <li>Semua waktu UTC; sediakan <code>timezone</code> bila perlu.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* ========================= DASHBOARD ========================= */
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={Database} label="Total Dataset" value={kpis.datasets} hint="Primer + Sekunder" color="text-blue-500" />
            <Stat icon={Globe} label="Cakupan Wilayah" value={kpis.coverage} color="text-emerald-500" />
            <Stat
              icon={Code2}
              label="Total API Calls"
              value={kpis.apiCalls.toLocaleString("id-ID")}
              hint="periode terpilih"
              color="text-purple-500"
            />
            <Stat icon={Shield} label="Institusi Mitra" value={kpis.institutions} color="text-orange-500" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle>Traffic Penggunaan (Monthly)</CardTitle>
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
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", r: 4 }}
                        activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8 }}
                        labelStyle={{ color: "#111827", fontWeight: 600 }}
                        formatter={(raw: any) => [`${Number(raw).toLocaleString("id-ID")} hits`, "Kunjungan"]}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle>Distribusi Sumber Trafik</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafikSumber}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={4}
                      >
                        {trafikSumber.map((e, i) => {
                          const colors = ["#22c55e", "#06b6d4", "#f59e0b", "#ef4444"];
                          return <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />;
                        })}
                      </Pie>
                      <Legend />
                      <Tooltip
                        contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8 }}
                        formatter={(v: any, n: any) => [`${v}%`, n]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <div>
                  <CardTitle>Performa Kategori (Primer)</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Aktivitas budaya terkurasi oleh tim (data primer)</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge>Primer → Chart</Badge>
                  <Badge>Sekunder → Card</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={kategoriBudaya} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="category"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#6b7280" }}
                        interval={0}
                        tickMargin={8}
                      />
                      <YAxis
                        yAxisId="left"
                        tickLine={false}
                        axisLine={false}
                        width={60}
                        tick={{ fill: "#6b7280" }}
                        tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        width={50}
                        tick={{ fill: "#6b7280" }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Bar yAxisId="left" dataKey="sales" radius={[4, 4, 0, 0]} maxBarSize={44}>
                        {kategoriBudaya.map((entry, i) => (
                          <Cell key={`c-${i}`} fill={entry.color} fillOpacity={0.85} />
                        ))}
                      </Bar>
                      <Bar
                        yAxisId="left"
                        dataKey="target"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        maxBarSize={44}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="growth"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#22c55e" }}
                        activeDot={{ r: 6, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }}
                      />
                      <Tooltip content={<KategoriTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sekunder cards */}
          <Card>
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle>Data Sekunder (Cards)</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gaya BPS: ringkas, bisa diklik ke sumber</p>
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
        </div>
      )}
    </div>
  );
}
