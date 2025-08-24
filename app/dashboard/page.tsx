"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Users,
  FolderOpen,
  Image as ImageIcon,
  Shield,
  Filter,
  Search,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Stat,
} from "@/components/insights-ui";
import Link from "next/link";
import { kategoriBudaya as kategoriSeed } from "@/lib/budaya-data";

/* recharts */
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  AreaChart,
  Area,
} from "recharts";

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

const seedContribs: Contribution[] = [
  { id: 101, title: "Upacara Adat Wiwitan", category: "Adat Istiadat", region: "DIY", contributor: "Komunitas Tani Sleman", status: "pending", attachments: 3 },
  { id: 102, title: "Tari Gantar", category: "Seni Pertunjukan", region: "Kaltim", contributor: "Sanggar Dayak", status: "approved", attachments: 5 },
  { id: 103, title: "Permainan Congklak", category: "Permainan Rakyat", region: "Sumut", contributor: "Relawan Budaya", status: "pending", attachments: 2 },
  { id: 104, title: "Kuliner Gudeg", category: "Kuliner Khas", region: "DIY", contributor: "Arsip Kuliner Nusantara", status: "rejected", attachments: 1 },
];

/* ===== palet & komponen kecil ===== */
const colors = {
  success: "#09f6e9",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
      {label && <div className="text-xs font-semibold mb-1">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="opacity-80">{p.name}:</span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const wrapLabel = (text: string, limit = 12) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > limit && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
};

const XTick = (props: any) => {
  const { x, y, payload } = props;
  const lines = wrapLabel(String(payload.value));
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#9aa4b2" fontSize={12}>
        {lines.map((ln: string, i: number) => (
          <tspan key={i} x={0} dy={i === 0 ? 0 : 14}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export default function AdminOverviewPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Status | "all">("pending");
  const [rows, setRows] = useState<Contribution[]>(seedContribs);

  /* KPIs */
  const kpis = useMemo(() => {
    const pending = rows.filter((r) => r.status === "pending").length;
    const approved = rows.filter((r) => r.status === "approved").length;
    const mediaCount = rows.reduce((s, r) => s + r.attachments, 0) + 148;
    const users = 824;
    return { pending, approved, mediaCount, users };
  }, [rows]);

  /* table */
  const filtered = rows.filter((r) => {
    const passFilter = filter === "all" ? true : r.status === filter;
    const kw = q.trim().toLowerCase();
    const passQ =
      !kw ||
      r.title.toLowerCase().includes(kw) ||
      r.category.toLowerCase().includes(kw) ||
      r.region.toLowerCase().includes(kw) ||
      r.contributor.toLowerCase().includes(kw);
    return passFilter && passQ;
  });

  const updateStatus = (id: number, status: Status) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  /* chart data */
  const moderationTrend = useMemo(
    () => [
      { w: "W-1", approved: 1, pending: 2, rejected: 0 },
      { w: "W-2", approved: 2, pending: 2, rejected: 1 },
      { w: "W-3", approved: 3, pending: 1, rejected: 0 },
      { w: "W-4", approved: 2, pending: 3, rejected: 1 },
      { w: "W-5", approved: 4, pending: 2, rejected: 0 },
      { w: "W-6", approved: 5, pending: 2, rejected: 1 },
      { w: "W-7", approved: 6, pending: 2, rejected: 1 },
      { w: "W-8", approved: 7, pending: 1, rejected: 1 },
    ],
    []
  );

  const statusBreakdown = useMemo(() => {
    const p = rows.filter((r) => r.status === "pending").length;
    const a = rows.filter((r) => r.status === "approved").length;
    const rj = rows.filter((r) => r.status === "rejected").length;
    return [
      { name: "Approved", value: a, color: colors.success },
      { name: "Pending", value: p, color: colors.warning },
      { name: "Rejected", value: rj, color: colors.danger },
    ];
  }, [rows]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r) => map.set(r.category, (map.get(r.category) ?? 0) + 1));
    return Array.from(map, ([category, count]) => ({
      category,
      count,
      color:
        kategoriSeed.find((k) => k.category === category)?.color || "#60a5fa",
    })).sort((a, b) => b.count - a.count);
  }, [rows]);

  const primerOverview = useMemo(
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
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat icon={Shield} label="Pengguna Aktif" value={kpis.users.toLocaleString("id-ID")} color="text-blue-500" />
        <Stat icon={FolderOpen} label="Kontribusi Disetujui" value={kpis.approved} color="text-emerald-500" />
        <Stat icon={ImageIcon} label="Item Multimedia" value={kpis.mediaCount.toLocaleString("id-ID")} color="text-purple-500" />
        <Stat icon={Users} label="Menunggu Review" value={kpis.pending} color="text-orange-500" />
      </div>

      {/* Moderasi + Manajemen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Antrian Moderasi</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari judul/kategori/wilayah/kontributor…"
                  className="pl-8 pr-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="inline-flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="all">Semua</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Judul</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Kategori</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Wilayah</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Kontributor</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/60">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{r.id}</td>
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{r.title}</td>
                      <td className="px-4 py-3">{r.category}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.region}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.contributor}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Eye className="h-3.5 w-3.5" /> Lihat
                          </button>
                          <button
                            onClick={() => updateStatus(r.id, "approved")}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-emerald-300 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-900/20"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Setujui
                          </button>
                          <button
                            onClick={() => updateStatus(r.id, "rejected")}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Manajemen Kategori</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Atur warna, target, dan jumlah item per kategori. Perubahan memengaruhi tampilan insight.
            </p>
            <ul className="text-sm space-y-2 mb-4">
              {kategoriSeed.slice(0, 5).map((k) => (
                <li key={k.category} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ background: k.color }} />
                    {k.category}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">{k.items} item</span>
                </li>
              ))}
              <li className="text-gray-500 dark:text-gray-400">…</li>
            </ul>
            <Link href="/dashboard/budaya" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
              Buka editor kategori & item <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* ===== Grafik atas ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Moderation trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Tren Moderasi (8 minggu)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moderationTrend} margin={{ left: 12, right: 12 }}>
                  <defs>
                    <linearGradient id="gOk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.success} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={colors.success} stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="gPend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.warning} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={colors.warning} stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="gRej" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.danger} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={colors.danger} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2b3546" />
                  <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} width={40} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="approved" name="Approved" stroke={colors.success} fill="url(#gOk)" strokeWidth={2} />
                  <Area type="monotone" dataKey="pending" name="Pending" stroke={colors.warning} fill="url(#gPend)" strokeWidth={2} />
                  <Area type="monotone" dataKey="rejected" name="Rejected" stroke={colors.danger} fill="url(#gRej)" strokeWidth={2} />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie status */}
        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Ringkasan Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={80} paddingAngle={3}>
                    {statusBreakdown.map((s, i) => (
                      <Cell key={i} fill={s.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== Distribusi + Primer (bawah) ===== */}
      <div className="grid grid-cols-1 gap-6">
        {/* Distribusi kontribusi */}
        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Distribusi Kontribusi per Kategori</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory} margin={{ top: 8, right: 16, bottom: 36, left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2b3546" />
                  <XAxis dataKey="category" interval={0} height={40} tickMargin={10} tick={<XTick />} tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={40} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
                  <Tooltip cursor={false} content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Jumlah" radius={[6, 6, 0, 0]}>
                    {byCategory.map((b, i) => (
                      <Cell key={i} fill={b.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Primer: Items vs Growth */}
        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Primer · Items vs Growth</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={primerOverview} margin={{ top: 8, right: 16, bottom: 36, left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2b3546" />
                  <XAxis dataKey="category" interval={0} height={40} tickMargin={10} tick={<XTick />} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} width={48} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} width={44} tick={{ fill: "#9aa4b2", fontSize: 12 }} />
                  <Bar yAxisId="left" dataKey="items" name="Items" radius={[6, 6, 0, 0]}>
                    {primerOverview.map((p, i) => (
                      <Cell key={i} fill={p.color} />
                    ))}
                  </Bar>
                  <Line yAxisId="right" type="monotone" dataKey="growth" name="Growth" stroke={colors.success} strokeWidth={3} dot={{ r: 3, fill: colors.success }} />
                  <Tooltip cursor={false} content={<CustomTooltip />} />
                  <Legend />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info API */}
      <Card className="mt-6">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Integrasi & API</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Sambungkan aksi moderasi ke endpoint server (POST/PUT/DELETE) agar perubahan tersimpan.
            Dokumentasi akses data insight tersedia di menu <b>API Docs</b> pada sidebar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
