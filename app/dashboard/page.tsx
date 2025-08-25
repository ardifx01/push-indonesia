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
import { Card, CardHeader, CardContent, CardTitle, Stat } from "@/components/insights-ui";
import Link from "next/link";
import { kategoriBudaya as kategoriSeed } from "@/lib/budaya--data";

/* charts (komponen terpisah) */
import ModerationTrend, { ModerationPoint } from "@/components/charts/ModerationTrend";
import StatusPie, { StatusSlice } from "@/components/charts/StatusPie";
import CategoryDistribution, { CategoryBar } from "@/components/charts/CategoryDistribution";
import PrimerItemsGrowth, { PrimerDatum } from "@/components/charts/PrimerItemsGrowth";

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

const seedContribs: Contribution[] = [
  { id: 101, title: "Upacara Adat Wiwitan", category: "Adat Istiadat", region: "DIY", contributor: "Komunitas Tani Sleman", status: "pending", attachments: 3 },
  { id: 102, title: "Tari Gantar", category: "Seni Pertunjukan", region: "Kaltim", contributor: "Sanggar Dayak", status: "approved", attachments: 5 },
  { id: 103, title: "Permainan Congklak", category: "Permainan Rakyat", region: "Sumut", contributor: "Relawan Budaya", status: "pending", attachments: 2 },
  { id: 104, title: "Kuliner Gudeg", category: "Kuliner Khas", region: "DIY", contributor: "Arsip Kuliner Nusantara", status: "rejected", attachments: 1 },
];

const colors = { success: "#09f6e9", warning: "#f59e0b", danger: "#ef4444" };

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

  /* ====== DATA UNTUK GRAFIK ====== */

  const moderationTrend: ModerationPoint[] = useMemo(
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

  const statusBreakdown: StatusSlice[] = useMemo(() => {
    const p = rows.filter((r) => r.status === "pending").length;
    const a = rows.filter((r) => r.status === "approved").length;
    const rj = rows.filter((r) => r.status === "rejected").length;
    return [
      { name: "Approved", value: a, color: colors.success },
      { name: "Pending", value: p, color: colors.warning },
      { name: "Rejected", value: rj, color: colors.danger },
    ];
  }, [rows]);

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
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Tren Moderasi (8 minggu)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ModerationTrend data={moderationTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Ringkasan Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <StatusPie data={statusBreakdown} />
          </CardContent>
        </Card>
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
            <CardTitle>Primer · Items vs Growth</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <PrimerItemsGrowth data={primerOverview} />
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
