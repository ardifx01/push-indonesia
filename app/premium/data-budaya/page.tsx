// app/premium/data-budaya/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";

type RowBudaya = {
  id: string;
  nama: string;
  kategori: string;
  wilayah: string;
  trending: number;
  interaksi: number;
};

// --- contoh data; ganti dari API-mu bila perlu ---
const DATA_BUDAYA: RowBudaya[] = [
  { id: "1",  nama: "Reog Ponorogo",  kategori: "Seni Pertunjukan",        wilayah: "Jawa Timur",        trending: 260, interaksi: 12450 },
  { id: "2",  nama: "Batik Madura",   kategori: "Seni Rupa & Kerajinan",   wilayah: "Jawa Timur",        trending: 310, interaksi: 18420 },
  { id: "3",  nama: "Rawon",          kategori: "Kuliner Khas",            wilayah: "Jawa Timur",        trending: 520, interaksi: 22410 },
  { id: "4",  nama: "Gamelan Jawa",   kategori: "Seni Pertunjukan",        wilayah: "DI Yogyakarta",     trending: 440, interaksi: 17680 },
  { id: "5",  nama: "Kasada",         kategori: "Adat Istiadat",           wilayah: "Jawa Timur",        trending: 180, interaksi: 8640  },
  { id: "6",  nama: "Tari Saman",     kategori: "Seni Pertunjukan",        wilayah: "Aceh",              trending: 300, interaksi: 15230 },
  { id: "7",  nama: "Wayang Kulit",   kategori: "Seni Pertunjukan",        wilayah: "Jawa Tengah",       trending: 360, interaksi: 20110 },
  { id: "8",  nama: "Rendang",        kategori: "Kuliner Khas",            wilayah: "Sumatera Barat",    trending: 610, interaksi: 33210 },
  { id: "9",  nama: "Tenun Ikat",     kategori: "Seni Rupa & Kerajinan",   wilayah: "NTT",               trending: 275, interaksi: 12890 },
  { id: "10", nama: "Ogoh-ogoh",      kategori: "Adat Istiadat",           wilayah: "Bali",              trending: 390, interaksi: 22110 },
  { id: "11", nama: "Angklung",       kategori: "Seni Pertunjukan",        wilayah: "Jawa Barat",        trending: 340, interaksi: 16750 },
  { id: "12", nama: "Coto Makassar",  kategori: "Kuliner Khas",            wilayah: "Sulawesi Selatan",  trending: 290, interaksi: 13400 },
];

export default function DataBudayaPage() {
  const [wilayah, setWilayah] = useState<string>("Semua");

  const wilayahOptions = useMemo(() => {
    const set = new Set<string>(["Semua"]);
    DATA_BUDAYA.forEach((r) => set.add(r.wilayah));
    return Array.from(set);
  }, []);

  const rows = useMemo(() => {
    const r = wilayah === "Semua" ? DATA_BUDAYA : DATA_BUDAYA.filter((x) => x.wilayah === wilayah);
    return [...r].sort((a, b) => b.trending - a.trending);
  }, [wilayah]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700">
          <div>
            <CardTitle>Data Budaya</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400">Filter berdasarkan wilayah untuk melihat daftar budaya.</p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="wilayah" className="text-xs text-gray-600 dark:text-gray-400">Wilayah</label>
            <select
              id="wilayah"
              value={wilayah}
              onChange={(e) => setWilayah(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-2 py-1 text-xs"
            >
              {wilayahOptions.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Budaya</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wilayah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Trending</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Interaksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row, i) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-gray-900">{i + 1}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{row.nama}</td>
                    <td className="px-6 py-3 text-gray-700">{row.kategori}</td>
                    <td className="px-6 py-3 text-gray-700">{row.wilayah}</td>
                    <td className="px-6 py-3 text-gray-900">{row.trending.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-3 text-gray-900">{row.interaksi.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-center text-gray-500">Tidak ada data untuk wilayah tersebut.</td>
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
