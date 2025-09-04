"use client";

import { useMemo, useState } from "react";
import {
  Filter,
  ArrowRight,
  DollarSign,
  Crown,
  Package,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, Stat } from "@/components/insights-ui";
import Link from "next/link";
import { kategoriBudaya as kategoriSeed } from "@/lib/budaya--data";

/* charts (komponen terpisah) */
import CategoryDistribution, { CategoryBar } from "@/components/charts/CategoryDistribution";
import PrimerItemsGrowth, { PrimerDatum } from "@/components/charts/PrimerItemsGrowth";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import ChartTooltip from "@/components/charts/ChartTooltip";

/* ====== types & seed ====== */
type Status = "pending" | "approved" | "rejected";

type Contribution = {
  id: number;
  title: string;
  category: string;
  region: string;
  contributor: string;
  status: Status;
  attachments: number;
};

type RevenueData = {
  month: string;
  revenue: number;
  year: number;
};

type PremiumUserData = {
  month: string;
  users: number;
  year: number;
};

type PremiumPackage = {
  id: number;
  name: string;
  price: number;
  features: string[];
};

const seedContribs: Contribution[] = [
  { id: 101, title: "Upacara Adat Wiwitan", category: "Adat Istiadat", region: "DIY", contributor: "Komunitas Tani Sleman", status: "pending", attachments: 3 },
  { id: 105, title: "Ritual Adat Pernikahan", category: "Adat Istiadat", region: "Jawa Barat", contributor: "Komunitas Tani Sleman", status: "approved", attachments: 4 },
  { id: 102, title: "Tari Gantar", category: "Seni Pertunjukan", region: "Kaltim", contributor: "Sanggar Dayak", status: "approved", attachments: 5 },
  { id: 106, title: "Tari Kecak", category: "Seni Pertunjukan", region: "Bali", contributor: "Sanggar Seni Bali", status: "pending", attachments: 3 },
  { id: 103, title: "Permainan Congklak", category: "Permainan Rakyat", region: "Sumut", contributor: "Relawan Budaya", status: "pending", attachments: 2 },
  { id: 107, title: "Permainan Gobak Sodor", category: "Permainan Rakyat", region: "Jawa Tengah", contributor: "Komunitas Anak", status: "approved", attachments: 2 },
  { id: 104, title: "Kuliner Gudeg", category: "Kuliner Khas", region: "DIY", contributor: "Arsip Kuliner Nusantara", status: "rejected", attachments: 1 },
  { id: 108, title: "Rendang Padang", category: "Kuliner Khas", region: "Sumbar", contributor: "Pecinta Kuliner", status: "approved", attachments: 4 },
  { id: 109, title: "Kebaya Jawa", category: "Pakaian Adat", region: "Jawa Tengah", contributor: "Museum Tekstil", status: "pending", attachments: 6 },
  { id: 110, title: "Baju Bodo Bugis", category: "Pakaian Adat", region: "Sulsel", contributor: "Sanggar Budaya Makassar", status: "approved", attachments: 3 },
  { id: 111, title: "Batik Yogyakarta", category: "Seni Rupa & Kerajinan", region: "DIY", contributor: "Pengrajin Batik", status: "approved", attachments: 8 },
  { id: 112, title: "Ukiran Jepara", category: "Seni Rupa & Kerajinan", region: "Jawa Tengah", contributor: "Asosiasi Pengrajin", status: "pending", attachments: 5 },
  { id: 113, title: "Legenda Sangkuriang", category: "Cerita Rakyat & Folklore", region: "Jawa Barat", contributor: "Penulis Lokal", status: "approved", attachments: 2 },
  { id: 114, title: "Dongeng Timun Mas", category: "Cerita Rakyat & Folklore", region: "Jawa Tengah", contributor: "Pendongeng", status: "pending", attachments: 3 },
  { id: 115, title: "Rumah Gadang", category: "Bangunan & Arsitektur Trad.", region: "Sumbar", contributor: "Arsitek Tradisional", status: "approved", attachments: 7 },
  { id: 116, title: "Rumah Joglo", category: "Bangunan & Arsitektur Trad.", region: "DIY", contributor: "Ahli Arsitektur", status: "pending", attachments: 4 },
  { id: 118, title: "Bahasa Batak", category: "Bahasa & Aksara Daerah", region: "Sumut", contributor: "Komunitas Batak", status: "pending", attachments: 2 },
];

const revenueData: RevenueData[] = [
  { month: "Jan", revenue: 12500000, year: 2025 },
  { month: "Feb", revenue: 14750000, year: 2025 },
  { month: "Mar", revenue: 16200000, year: 2025 },
  { month: "Apr", revenue: 15800000, year: 2025 },
  { month: "May", revenue: 18900000, year: 2025 },
  { month: "Jun", revenue: 21300000, year: 2025 },
  { month: "Jul", revenue: 19600000, year: 2025 },
  { month: "Aug", revenue: 22100000, year: 2025 },
  { month: "Jan", revenue: 10200000, year: 2024 },
  { month: "Feb", revenue: 11800000, year: 2024 },
  { month: "Mar", revenue: 13500000, year: 2024 },
  { month: "Apr", revenue: 12900000, year: 2024 },
  { month: "May", revenue: 15600000, year: 2024 },
  { month: "Jun", revenue: 17800000, year: 2024 },
  { month: "Jul", revenue: 16400000, year: 2024 },
  { month: "Aug", revenue: 18200000, year: 2024 },
  { month: "Sep", revenue: 19500000, year: 2024 },
  { month: "Oct", revenue: 20800000, year: 2024 },
  { month: "Nov", revenue: 22300000, year: 2024 },
  { month: "Dec", revenue: 24100000, year: 2024 },
];

// Trend data for budaya categories
const trendBudaya = [
  { month: "Jan", adat: 92, seniPertunjukan: 80, permainanRakyat: 64, kulinerKhas: 120, pakaianAdat: 70, seniRupaKerajinan: 78, ceritaRakyat: 55, bangunanTrad: 66, bahasaAksara: 50 },
  { month: "Feb", adat: 98, seniPertunjukan: 84, permainanRakyat: 66, kulinerKhas: 126, pakaianAdat: 73, seniRupaKerajinan: 82, ceritaRakyat: 58, bangunanTrad: 69, bahasaAksara: 53 },
  { month: "Mar", adat: 104, seniPertunjukan: 88, permainanRakyat: 69, kulinerKhas: 133, pakaianAdat: 76, seniRupaKerajinan: 86, ceritaRakyat: 61, bangunanTrad: 72, bahasaAksara: 55 },
  { month: "Apr", adat: 111, seniPertunjukan: 92, permainanRakyat: 72, kulinerKhas: 139, pakaianAdat: 79, seniRupaKerajinan: 90, ceritaRakyat: 64, bangunanTrad: 75, bahasaAksara: 58 },
  { month: "Mei", adat: 118, seniPertunjukan: 97, permainanRakyat: 76, kulinerKhas: 147, pakaianAdat: 83, seniRupaKerajinan: 95, ceritaRakyat: 68, bangunanTrad: 79, bahasaAksara: 61 },
  { month: "Jun", adat: 126, seniPertunjukan: 101, permainanRakyat: 79, kulinerKhas: 154, pakaianAdat: 86, seniRupaKerajinan: 99, ceritaRakyat: 71, bangunanTrad: 82, bahasaAksara: 64 },
  { month: "Jul", adat: 134, seniPertunjukan: 106, permainanRakyat: 83, kulinerKhas: 162, pakaianAdat: 90, seniRupaKerajinan: 104, ceritaRakyat: 75, bangunanTrad: 86, bahasaAksara: 67 },
  { month: "Agu", adat: 143, seniPertunjukan: 111, permainanRakyat: 86, kulinerKhas: 170, pakaianAdat: 94, seniRupaKerajinan: 109, ceritaRakyat: 78, bangunanTrad: 90, bahasaAksara: 70 },
];

const TREND_KEYS: { key: keyof (typeof trendBudaya)[number]; label: string; color: string }[] = [
  { key: "adat", label: "Adat Istiadat", color: "#60a5fa" },
  { key: "seniPertunjukan", label: "Seni Pertunjukan", color: "#22c55e" },
  { key: "permainanRakyat", label: "Permainan Rakyat", color: "#f59e0b" },
  { key: "kulinerKhas", label: "Kuliner Khas", color: "#a855f7" },
  { key: "pakaianAdat", label: "Pakaian Adat", color: "#ef4444" },
  { key: "seniRupaKerajinan", label: "Seni Rupa & Kerajinan", color: "#06b6d4" },
  { key: "ceritaRakyat", label: "Cerita Rakyat & Folklore", color: "#84cc16" },
  { key: "bangunanTrad", label: "Bangunan & Arsitektur Trad.", color: "#ec4899" },
  { key: "bahasaAksara", label: "Bahasa & Aksara Daerah", color: "#94a3b8" },
];

const premiumUserData: PremiumUserData[] = [
  { month: "Jan", users: 180, year: 2025 },
  { month: "Feb", users: 195, year: 2025 },
  { month: "Mar", users: 210, year: 2025 },
  { month: "Apr", users: 205, year: 2025 },
  { month: "May", users: 225, year: 2025 },
  { month: "Jun", users: 240, year: 2025 },
  { month: "Jul", users: 235, year: 2025 },
  { month: "Aug", users: 220, year: 2025 },
  { month: "Sep", users: 230, year: 2025 },
  { month: "Oct", users: 245, year: 2025 },
  { month: "Nov", users: 250, year: 2025 },
  { month: "Dec", users: 260, year: 2025 },
  { month: "Jan", users: 150, year: 2024 },
  { month: "Feb", users: 160, year: 2024 },
  { month: "Mar", users: 175, year: 2024 },
  { month: "Apr", users: 170, year: 2024 },
  { month: "May", users: 185, year: 2024 },
  { month: "Jun", users: 200, year: 2024 },
  { month: "Jul", users: 195, year: 2024 },
  { month: "Aug", users: 210, year: 2024 },
  { month: "Sep", users: 215, year: 2024 },
  { month: "Oct", users: 225, year: 2024 },
  { month: "Nov", users: 235, year: 2024 },
  { month: "Dec", users: 247, year: 2024 },
];

const premiumPackages: PremiumPackage[] = [
  {
    id: 1,
    name: "Basic Premium",
    price: 49000,
    features: ["Access to premium content", "Ad-free experience", "Basic analytics"]
  },
  {
    id: 2,
    name: "Pro Premium",
    price: 99000,
    features: ["All Basic features", "Advanced analytics", "Priority support", "Export data"]
  },
  {
    id: 3,
    name: "Business Premium",
    price: 199000,
    features: ["All Pro features", "API access", "Custom branding", "Team collaboration"]
  },
  {
    id: 4,
    name: "Enterprise",
    price: 399000,
    features: ["All Business features", "Dedicated support", "Custom integrations", "SLA guarantee"]
  },
  {
    id: 5,
    name: "Academic",
    price: 25000,
    features: ["Educational discount", "Basic premium access", "Research tools"]
  },
];

const colors = { success: "#09f6e9", warning: "#f59e0b", danger: "#ef4444" };

// Simple Chart Components
const RevenueLineChart = ({ data }: { data: RevenueData[] }) => {
  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 12, right: 12, top: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2b3546" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9aa4b2", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={60}
            tick={{ fill: "#9aa4b2", fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip
            content={<ChartTooltip />}
            formatter={(value: any) => [`Rp ${(value / 1000000).toFixed(1)}M`, "Pendapatan"]}
            labelFormatter={(label) => `Bulan ${label}`}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Pendapatan"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const BudayaTrendLineChart = ({ data }: { data: typeof trendBudaya }) => {
  return (
    <div style={{ height: 380 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 12, right: 12, top: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={60}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
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
          <Tooltip
            contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }}
            labelStyle={{ color: "#111827", fontWeight: 600 }}
            formatter={(v: any, name: any) => [Number(v).toLocaleString("id-ID"), String(name)]}
          />
          <Legend
            wrapperStyle={{ color: "#374151" }}
            iconType="circle"
            verticalAlign="bottom"
            height={24}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const PremiumUserBarChart = ({ data }: { data: PremiumUserData[] }) => {
  const maxUsers = Math.max(...data.map(d => d.users));
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.month} className="flex items-center gap-3">
          <div className="w-8 text-xs font-medium text-gray-600 dark:text-gray-400">
            {item.month}
          </div>
          <div className="flex-1 h-6  dark:bg-gray-700 rounded-sm overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300 hover:bg-purple-600 rounded-sm"
              style={{ width: `${(item.users / maxUsers) * 100}%` }}
              title={`${item.month}: ${item.users} users`}
            />
          </div>
          <div className="w-12 text-xs font-medium text-gray-900 dark:text-gray-100 text-right">
            {item.users}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AdminOverviewPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Status | "all">("pending");
  const [rows, setRows] = useState<Contribution[]>(seedContribs);
  const [revenueFilter, setRevenueFilter] = useState<number>(2025);
  const [premiumFilter, setPremiumFilter] = useState<number>(2025);

  /* KPIs */
  const kpis = useMemo(() => {
    const pending = rows.filter((r) => r.status === "pending").length;
    const approved = rows.filter((r) => r.status === "approved").length;
    const totalRevenue = 156750000; // Total pendapatan dalam Rupiah
    const premiumUsers = 589; // Total pengguna premium
    const newPremiumUserThisMonth = 160;
    const premiumPackages = 5; // Total paket premium tersedia
    return { pending, approved, totalRevenue, premiumUsers, premiumPackages, newPremiumUserThisMonth };
  }, [rows]);

  // Filtered data for charts
  const filteredRevenueData = useMemo(() =>
    revenueData.filter(item => item.year === revenueFilter),
    [revenueFilter]
  );

  const filteredPremiumUserData = useMemo(() =>
    premiumUserData.filter(item => item.year === premiumFilter),
    [premiumFilter]
  );

  const byCategory: CategoryBar[] = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r) => map.set(r.category, (map.get(r.category) ?? 0) + 1));
    return Array.from(map, ([category, count]) => ({
      category,
      count,
      color: kategoriSeed.find((k) => k.category === category)?.color || "#60a5fa",
    })).sort((a, b) => b.count - a.count);
  }, [rows]);

  const primerOverview: PrimerDatum[] = useMemo(
    () =>
      kategoriSeed.slice(0, 8).map((k) => ({
        category: k.category,
        items: k.items,
        growth: k.growth,
        color: k.color,
      })),
    []
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* KPI Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h2>
        <p className="text-gray-600 dark:text-gray-400">Monitor  performa platform dan layanan premium</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat icon={DollarSign} label="Total Pendapatan" value={`Rp ${(kpis.totalRevenue / 1000000).toFixed(1)}M`} color="text-green-500" />
        <Stat icon={Crown} label="Pengguna Premium" value={kpis.premiumUsers.toLocaleString("id-ID")} color="text-purple-500" />
        <Stat icon={Package} label="Paket Premium" value={kpis.premiumPackages} color="text-blue-500" />
        <Stat icon={TrendingUp} label="Pengguna Premium Baru Bulan Ini" value={kpis.newPremiumUserThisMonth} color="text-green-700" />
      </div>

      {/* Revenue Chart */}
      <Card className="mb-6">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Pendapatan Bulanan
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={revenueFilter}
                onChange={(e) => setRevenueFilter(Number(e.target.value))}
                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              >
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <RevenueLineChart data={filteredRevenueData} />
        </CardContent>
      </Card>

      {/* Premium Users and Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          {/* Premium Users Chart */}
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Pengguna Premium Bulanan
              </CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={premiumFilter}
                  onChange={(e) => setPremiumFilter(Number(e.target.value))}
                  className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <PremiumUserBarChart data={filteredPremiumUserData} />
          </CardContent>
        </Card>
        {/* Premium Packages List */}
        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Paket Premium
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {premiumPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{pkg.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {pkg.features.slice(0, 2).join(", ")}
                      {pkg.features.length > 2 && "..."}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    Rp {pkg.price.toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard#" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mt-4">
              Buka editor paket premium <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Budaya Indonesia</h2>
        <p className="text-gray-600 dark:text-gray-400">Monitor dan kelola warisan budaya serta kontribusi masyarakat</p>
      </div>

      {/* Budaya Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat icon={DollarSign} label="Total Item Budaya" value={`${Math.floor(kpis.totalRevenue / 1000000)} Item`} color="text-green-500" />
        <Stat icon={Crown} label="Total Kategori" value={kpis.premiumUsers.toLocaleString("id-ID")} color="text-purple-500" />
        <Stat icon={Package} label="Ajuan Diterima" value={kpis.premiumPackages} color="text-blue-500" />
        <Stat icon={TrendingUp} label="Ajuan Pending" value={kpis.newPremiumUserThisMonth} color="text-green-700" />
      </div>

      {/* ===== Distribusi + Primer (bawah) ===== */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Distribusi Kontribusi per Kategori</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <CategoryDistribution data={byCategory} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Tren Kategori Budaya (Bulanan)</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400">Menunjukkan kategori budaya yang lagi naik sepanjang tahun.</p>
          </CardHeader>
          <CardContent className="pt-6">
            <BudayaTrendLineChart data={trendBudaya} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
