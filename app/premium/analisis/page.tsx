// app/premium/page.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";

/** ----- View state ----- */
type TimeRange = "7d" | "30d" | "90d";
type ViewMode = "charts" | "table";

/** ----- Data tren (dipakai untuk snapshot pie) ----- */
const trendBudaya = [
  { month: "Jan", adat: 92,  seniPertunjukan: 80,  permainanRakyat: 64,  kulinerKhas: 120, pakaianAdat: 70,  seniRupaKerajinan: 78,  ceritaRakyat: 55,  bangunanTrad: 66,  bahasaAksara: 50 },
  { month: "Feb", adat: 98,  seniPertunjukan: 84,  permainanRakyat: 66,  kulinerKhas: 126, pakaianAdat: 73,  seniRupaKerajinan: 82,  ceritaRakyat: 58,  bangunanTrad: 69,  bahasaAksara: 53 },
  { month: "Mar", adat: 104, seniPertunjukan: 88,  permainanRakyat: 69,  kulinerKhas: 133, pakaianAdat: 76,  seniRupaKerajinan: 86,  ceritaRakyat: 61,  bangunanTrad: 72,  bahasaAksara: 55 },
  { month: "Apr", adat: 111, seniPertunjukan: 92,  permainanRakyat: 72,  kulinerKhas: 139, pakaianAdat: 79,  seniRupaKerajinan: 90,  ceritaRakyat: 64,  bangunanTrad: 75,  bahasaAksara: 58 },
  { month: "Mei", adat: 118, seniPertunjukan: 97,  permainanRakyat: 76,  kulinerKhas: 147, pakaianAdat: 83,  seniRupaKerajinan: 95,  ceritaRakyat: 68,  bangunanTrad: 79,  bahasaAksara: 61 },
  { month: "Jun", adat: 126, seniPertunjukan: 101, permainanRakyat: 79,  kulinerKhas: 154, pakaianAdat: 86,  seniRupaKerajinan: 99,  ceritaRakyat: 71,  bangunanTrad: 82,  bahasaAksara: 64 },
  { month: "Jul", adat: 134, seniPertunjukan: 106, permainanRakyat: 83,  kulinerKhas: 162, pakaianAdat: 90,  seniRupaKerajinan: 104,  ceritaRakyat: 75,  bangunanTrad: 86,  bahasaAksara: 67 },
  { month: "Agu", adat: 143, seniPertunjukan: 111, permainanRakyat: 86,  kulinerKhas: 170, pakaianAdat: 94,  seniRupaKerajinan: 109,  ceritaRakyat: 78,  bangunanTrad: 90,  bahasaAksara: 70 },
  { month: "Sep", adat: 152, seniPertunjukan: 116, permainanRakyat: 90,  kulinerKhas: 179, pakaianAdat: 98,  seniRupaKerajinan: 114,  ceritaRakyat: 82,  bangunanTrad: 94,  bahasaAksara: 73 },
  { month: "Okt", adat: 162, seniPertunjukan: 121, permainanRakyat: 94,  kulinerKhas: 188, pakaianAdat: 102, seniRupaKerajinan: 119,  ceritaRakyat: 86,  bangunanTrad: 98,  bahasaAksara: 76 },
  { month: "Nov", adat: 172, seniPertunjukan: 126, permainanRakyat: 98,  kulinerKhas: 198, pakaianAdat: 106, seniRupaKerajinan: 124,  ceritaRakyat: 90,  bangunanTrad: 102,  bahasaAksara: 79 },
  { month: "Des", adat: 183, seniPertunjukan: 132, permainanRakyat: 102, kulinerKhas: 209, pakaianAdat: 111, seniRupaKerajinan: 130, ceritaRakyat: 94,  bangunanTrad: 106, bahasaAksara: 82 },
];

const TREND_KEYS: { key: keyof (typeof trendBudaya)[number]; label: string; color: string }[] = [
  { key: "adat",              label: "Adat Istiadat",               color: "#60a5fa" },
  { key: "seniPertunjukan",   label: "Seni Pertunjukan",            color: "#22c55e" },
  { key: "permainanRakyat",   label: "Permainan Rakyat",            color: "#f59e0b" },
  { key: "kulinerKhas",       label: "Kuliner Khas",                color: "#a855f7" },
  { key: "pakaianAdat",       label: "Pakaian Adat",                color: "#ef4444" },
  { key: "seniRupaKerajinan", label: "Seni Rupa & Kerajinan",       color: "#06b6d4" },
  { key: "ceritaRakyat",      label: "Cerita Rakyat & Folklore",    color: "#84cc16" },
  { key: "bangunanTrad",      label: "Bangunan & Arsitektur Trad.", color: "#ec4899" },
  { key: "bahasaAksara",      label: "Bahasa & Aksara Daerah",      color: "#94a3b8" },
];

const PIE_COLORS = ["#60a5fa","#22c55e","#f59e0b","#a855f7","#ef4444","#06b6d4","#84cc16","#ec4899","#94a3b8"];

const budayaPerProvinsi = [
  { prov: "Aceh", total: 184 },
  { prov: "Sumatera Utara", total: 210 },
  { prov: "Sumatera Barat", total: 175 },
  { prov: "Riau", total: 142 },
  { prov: "Jambi", total: 120 },
  { prov: "Sumatera Selatan", total: 168 },
  { prov: "Bengkulu", total: 96 },
  { prov: "Lampung", total: 130 },
  { prov: "DKI Jakarta", total: 115 },
  { prov: "Jawa Barat", total: 260 },
  { prov: "Jawa Tengah", total: 295 },
  { prov: "DI Yogyakarta", total: 188 },
  { prov: "Jawa Timur", total: 310 },
  { prov: "Banten", total: 105 },
  { prov: "Bali", total: 278 },
  { prov: "NTB", total: 136 },
  { prov: "NTT", total: 190 },
  { prov: "Kalimantan Barat", total: 150 },
  { prov: "Kalimantan Timur", total: 128 },
  { prov: "Sulawesi Selatan", total: 240 },
];

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
    router.replace(`/premium${m === "table" ? "?mode=table" : "?mode=charts"}`);
    setMode(m);
  };

  const distribusiPrimer = useMemo(() => {
    const last = trendBudaya[trendBudaya.length - 1];
    return [
      { name: "Adat Istiadat", value: last.adat },
      { name: "Seni Pertunjukan", value: last.seniPertunjukan },
      { name: "Permainan Rakyat", value: last.permainanRakyat },
      { name: "Kuliner Khas", value: last.kulinerKhas },
      { name: "Pakaian Adat", value: last.pakaianAdat },
      { name: "Seni Rupa & Kerajinan", value: last.seniRupaKerajinan },
      { name: "Cerita Rakyat & Folklore", value: last.ceritaRakyat },
      { name: "Bangunan & Arsitektur Tradisional", value: last.bangunanTrad },
      { name: "Bahasa & Aksara Daerah", value: last.bahasaAksara },
    ];
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400" />
        <div className="flex items-center gap-2">
          <label htmlFor="range-user" className="text-xs text-gray-600 dark:text-gray-400">Rentang</label>
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
              className={`px-2 py-1 rounded-md text-xs ${mode === "charts" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
            >
              Charts
            </button>
            <button
              onClick={() => setModeAndUrl("table")}
              className={`px-2 py-1 rounded-md text-xs ${mode === "table" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Charts only */}
      <div className="grid grid-cols-1 gap-6 mt-2">
        {/* Tren kategori */}
        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Tren Kategori Budaya (Bulanan)</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400">Menunjukkan kategori budaya yang lagi naik sepanjang tahun.</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendBudaya} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} width={60} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  {TREND_KEYS.map(({ key, label, color }) => (
                    <Line
                      key={String(key)}
                      type="monotone"
                      dataKey={key}
                      name={label}
                      stroke={color}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: color, stroke: "#fff", strokeWidth: 2 }}
                    />
                  ))}
                  <Tooltip<number, string>
                    contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }}
                    labelStyle={{ color: "#111827", fontWeight: 600 }}
                    formatter={(v, name) => [Number(v).toLocaleString("id-ID"), String(name)]}
                  />
                  <Legend wrapperStyle={{ color: "#374151" }} iconType="circle" verticalAlign="bottom" height={24} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Total budaya per provinsi */}
        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Total Budaya per Provinsi</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400">Jumlah entitas budaya (contoh data) yang tercatat di setiap provinsi.</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[520px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budayaPerProvinsi} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis type="category" dataKey="prov" width={160} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip<number, string>
                    contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }}
                    formatter={(v) => [`${Number(v).toLocaleString("id-ID")} budaya`, "Total"]}
                  />
                  <Bar dataKey="total" radius={[4, 4, 4, 4]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie distribusi kategori */}
        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Distribusi Kategori (Primer)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribusiPrimer}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    labelLine={false}
                  >
                    {distribusiPrimer.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  <Tooltip<number, string>
                    contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }}
                    formatter={(v, name) => [`${Number(v).toLocaleString("id-ID")}`, String(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
