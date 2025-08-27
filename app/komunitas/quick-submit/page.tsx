// app/komunitas/quick-submit/page.tsx
"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";
import { kategoriBudaya } from "@/lib/budaya--data";

type Form = {
  title: string;
  category: string;
  region: string;
  desc: string;
  files: FileList | null;
  agree: boolean;
};

export default function QuickSubmitPage() {
  const [form, setForm] = useState<Form>({
    title: "",
    category: kategoriBudaya[0]?.category ?? "",
    region: "",
    desc: "",
    files: null,
    agree: false,
  });
  const [submitted, setSubmitted] = useState<null | string>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.region || !form.desc || !form.agree) {
      setSubmitted("Lengkapi semua kolom & setujui ketentuan.");
      return;
    }
    // Simulasi submit sukses
    setSubmitted("Kontribusi terkirim! Menunggu moderasi.");
    setForm(f => ({ ...f, title: "", region: "", desc: "", files: null, agree: false }));
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle>Ajukan Budaya</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-700 dark:text-gray-300">Judul</span>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Nama budaya / acara / cerita"
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700 dark:text-gray-300">Kategori</span>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              >
                {kategoriBudaya.map(k => (
                  <option key={k.category} value={k.category}>{k.category}</option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Wilayah</span>
              <input
                value={form.region}
                onChange={e => setForm({ ...form, region: e.target.value })}
                placeholder="contoh: DIY, Jatim, Sumbar"
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">Deskripsi</span>
            <textarea
              value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })}
              rows={5}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              placeholder="Cerita / konteks budaya"
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{form.desc.length} karakter</div>
          </label>

          <label className="block">
            <span className="text-sm text-gray-700 dark:text-gray-300">Lampiran (foto/video/audio)</span>
            <input
              type="file"
              multiple
              onChange={e => setForm({ ...form, files: e.target.files })}
              className="mt-1 block w-full text-sm file:mr-3 file:rounded-md file:border file:border-gray-300 dark:file:border-gray-600 file:bg-white dark:file:bg-gray-800 file:px-3 file:py-2"
            />
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={e => setForm({ ...form, agree: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Saya setuju konten ditinjau moderator.</span>
          </label>

          {submitted && (
            <div className="text-sm text-blue-600 dark:text-blue-300">{submitted}</div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md border border-blue-300 dark:border-blue-700 bg-blue-600/90 text-white px-4 py-2 text-sm hover:bg-blue-600"
            >
              Kirim Kontribusi
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
