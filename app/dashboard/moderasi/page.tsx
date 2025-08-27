// app/dashboard/moderasi/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Eye, CheckCircle2, XCircle, Filter, Search } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";

type Status = "pending" | "approved" | "rejected";
type Contribution = {
  id: number; title: string; category: string; region: string;
  contributor: string; status: Status; attachments: number;
};

const seedContribs: Contribution[] = [
  { id: 101, title: "Upacara Adat Wiwitan", category: "Adat Istiadat", region: "DIY", contributor: "Komunitas Tani Sleman", status: "pending",  attachments: 3 },
  { id: 102, title: "Tari Gantar",         category: "Seni Pertunjukan", region: "Kaltim", contributor: "Sanggar Dayak",      status: "approved", attachments: 5 },
  { id: 103, title: "Permainan Congklak",   category: "Permainan Rakyat", region: "Sumut",  contributor: "Relawan Budaya",     status: "pending",  attachments: 2 },
  { id: 104, title: "Kuliner Gudeg",        category: "Kuliner Khas",      region: "DIY",   contributor: "Arsip Kuliner Nus.",  status: "rejected", attachments: 1 },
];

export default function ModerasiPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Status | "all">("pending");
  const [rows, setRows] = useState<Contribution[]>(seedContribs);

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

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
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
    </div>
  );
}
