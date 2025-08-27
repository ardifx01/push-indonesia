// components/community/MySubmissionsTable.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Eye, Edit3, RefreshCw, Search } from "lucide-react";

export type CommunityContribution = {
  id: number;
  title: string;
  category: string;
  region: string;
  submittedAt: string; // YYYY-MM-DD
  status: "draft" | "pending" | "approved" | "rejected";
  attachments: number;
  views: number;
  likes: number;
};

export default function MySubmissionsTable({
  rows,
  onAction,
}: {
  rows: CommunityContribution[];
  onAction: (type: "view" | "edit" | "resubmit", row: CommunityContribution) => void;
}) {
  const [q, setQ] = useState("");

  const data = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return rows;
    return rows.filter(r =>
      r.title.toLowerCase().includes(kw) ||
      r.category.toLowerCase().includes(kw) ||
      r.region.toLowerCase().includes(kw)
    );
  }, [rows, q]);

  const Chip = ({ s }: { s: CommunityContribution["status"] }) => {
    const map: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[s]}`}>{s}</span>;
  };

  return (
    <div>
      <div className="mb-3">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari judul/kategori/wilayah…"
            className="pl-8 pr-3 py-2 w-full rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Judul</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Kategori</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Wilayah</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tanggal</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Views/Likes</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/60">
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-medium">{r.title}</td>
                <td className="px-4 py-3">{r.category}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.region}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {new Date(r.submittedAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3"><Chip s={r.status} /></td>
                <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                  {r.views.toLocaleString("id-ID")} / {r.likes.toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onAction("view", r)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Eye className="h-3.5 w-3.5" /> Lihat
                    </button>
                    <button onClick={() => onAction("edit", r)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-blue-300 text-blue-700 dark:text-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                    {r.status === "rejected" && (
                      <button onClick={() => onAction("resubmit", r)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-amber-300 text-amber-700 dark:text-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                        <RefreshCw className="h-3.5 w-3.5" /> Ajukan Ulang
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  Belum ada kontribusi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
