// app/komunitas/page.tsx
"use client";


import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Users, Plus, Upload, CheckCircle2, XCircle, Clock, Eye, Edit3, RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, Stat } from "@/components/insights-ui";

import ContribStatusChart from "@/components/charts/comunity/ContribStatusChart";
import CategorySplitChart from "@/components/charts/comunity/CategorySplitChart";
import MySubmissionsTable, { CommunityContribution } from "@/components/comunity/MySubmissionsTable";
import QuickSubmit from "@/components/comunity/QuickSubmit";
import { kategoriBudaya } from "@/lib/budaya--data";

type Status = "draft" | "pending" | "approved" | "rejected";

const seed: CommunityContribution[] = [
  { id: 201, title: "Festival Tandak", category: "Tari Tradisional", region: "Riau",  submittedAt: "2025-08-18", status: "approved", attachments: 4, views: 812, likes: 96 },
  { id: 202, title: "Cerita Rakyat Malin Kundang", category: "Upacara Adat", region: "Sumbar", submittedAt: "2025-08-20", status: "pending", attachments: 2, views: 150, likes: 21 },
  { id: 203, title: "Gamelan Banyumasan", category: "Musik Daerah", region: "Jateng", submittedAt: "2025-08-22", status: "rejected", attachments: 1, views: 73,  likes: 8 },
  { id: 204, title: "Batik Gedhog", category: "Batik & Tenun", region: "Jatim", submittedAt: "2025-08-24", status: "pending", attachments: 3, views: 204, likes: 27 },
];

export default function CommunityDashboardPage() {
  const [rows, setRows] = useState<CommunityContribution[]>(seed);

  const kpis = useMemo(() => {
    const total = rows.length;
    const approved = rows.filter(r => r.status === "approved").length;
    const pending  = rows.filter(r => r.status === "pending").length;
    const rejected = rows.filter(r => r.status === "rejected").length;
    return { total, approved, pending, rejected };
  }, [rows]);

  // buat ringkasan per-kategori untuk grafik barchart
  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach(r => map.set(r.category, (map.get(r.category) ?? 0) + 1));
    return Array.from(map, ([category, count]) => ({
      category,
      count,
      color: kategoriBudaya.find(k => k.category === category)?.color ?? "#60a5fa",
    })).sort((a,b) => b.count - a.count);
  }, [rows]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat icon={Users}       label="Kontribusi Saya" value={kpis.total}     color="text-blue-500" />
        <Stat icon={CheckCircle2} label="Disetujui"       value={kpis.approved}  color="text-emerald-500" />
        <Stat icon={Clock}        label="Menunggu"        value={kpis.pending}   color="text-amber-500" />
        <Stat icon={XCircle}      label="Ditolak"         value={kpis.rejected}  color="text-red-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Progres Moderasi (8 minggu)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ContribStatusChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Kontribusi per Kategori</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <CategorySplitChart data={byCategory} />
          </CardContent>
        </Card>
      </div>

      {/* Quick submit */}
      <Card id="quick-submit" className="mb-6">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Tambah Kontribusi </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <QuickSubmit
            onSubmit={(payload) => {
              const newRow: CommunityContribution = {
                id: Math.max(...rows.map(r => r.id)) + 1,
                title: payload.title,
                category: payload.category,
                region: payload.region,
                submittedAt: new Date().toISOString().slice(0,10),
                status: "pending",
                attachments: payload.files?.length ?? 0,
                views: 0,
                likes: 0,
              };
              setRows(prev => [newRow, ...prev]);
            }}
          />
        </CardContent>
      </Card>

      {/* Tabel kontribusi saya */}
      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Kontribusi Saya</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <MySubmissionsTable
            rows={rows}
            onAction={(type, row) => {
              if (type === "view") console.log("view", row);
              if (type === "edit") console.log("edit", row);
              if (type === "resubmit") console.log("resubmit", row);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
