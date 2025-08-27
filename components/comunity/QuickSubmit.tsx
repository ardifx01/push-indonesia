// components/community/QuickSubmit.tsx
"use client";

import React, { useState } from "react";
import { kategoriBudaya } from "@/lib/budaya--data";

type Payload = {
  title: string;
  category: string;
  region: string;
  description?: string;
  files?: File[];
};

export default function QuickSubmit({ onSubmit }: { onSubmit: (payload: Payload) => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(kategoriBudaya[0]?.category ?? "");
  const [region, setRegion] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title, category, region, description: desc, files });
        setTitle(""); setRegion(""); setDesc(""); setFiles([]);
      }}
    >
      <div className="space-y-2">
        <label className="text-xs text-gray-600 dark:text-gray-400">Judul</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          placeholder="Nama budaya / acara / cerita"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-600 dark:text-gray-400">Kategori</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
        >
          {kategoriBudaya.map(k => (
            <option key={k.category} value={k.category}>{k.category}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-600 dark:text-gray-400">Wilayah</label>
        <input
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          placeholder="contoh: DIY, Jatim, Sumbar"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-600 dark:text-gray-400">Lampiran (foto/video/audio)</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <label className="text-xs text-gray-600 dark:text-gray-400">Deskripsi</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          placeholder="Cerita / konteks budaya"
        />
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
        >
          Kirim untuk Moderasi
        </button>
      </div>
    </form>
  );
}
