// app/komunitas/event/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Calendar, MapPin, Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";

type KomEvent = {
  id: number;
  title: string;
  when: string;   // ISO datetime
  where: string;
  note?: string;
};

const seed: KomEvent[] = [
  { id: 1, title: "Festival Kuliner Nusantara", when: "2025-09-12T19:00", where: "Jakarta" },
  { id: 2, title: "Parade Batik & Tenun", when: "2025-10-03T08:00", where: "Solo" },
];

export default function CommunityEventsPage() {
  const [events, setEvents] = useState<KomEvent[]>(seed);
  const [form, setForm] = useState<Omit<KomEvent, "id">>({ title: "", when: "", where: "", note: "" });
  const monthKey = (d: string) => new Date(d).toLocaleString("id-ID", { month: "long", year: "numeric" });

  const grouped = useMemo(() => {
    const map = new Map<string, KomEvent[]>();
    events
      .slice()
      .sort((a, b) => +new Date(a.when) - +new Date(b.when))
      .forEach(ev => {
        const k = monthKey(ev.when);
        map.set(k, [...(map.get(k) ?? []), ev]);
      });
    return Array.from(map);
  }, [events]);

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.when || !form.where) return;
    setEvents(prev => [...prev, { id: prev.length ? prev[prev.length - 1].id + 1 : 1, ...form }]);
    setForm({ title: "", when: "", where: "", note: "" });
  };

  const removeEvent = (id: number) => setEvents(prev => prev.filter(e => e.id !== id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* daftar event */}
      <Card className="lg:col-span-2">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Event Komunitas</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {grouped.length === 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">Belum ada event.</div>
          )}
          {grouped.map(([month, list]) => (
            <div key={month} className="mb-5">
              <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">{month}</div>
              <ul className="space-y-2">
                {list.map(ev => (
                  <li key={ev.id} className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{ev.title}</div>
                        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(ev.when).toLocaleString("id-ID")}</span>
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {ev.where}</span>
                        </div>
                        {ev.note && <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{ev.note}</div>}
                      </div>
                      <button
                        onClick={() => removeEvent(ev.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-red-300 text-red-600 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* tambah event cepat */}
      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Tambah Event</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={addEvent} className="space-y-3">
            <label className="block">
              <span className="text-sm text-gray-700 dark:text-gray-300">Judul</span>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                placeholder="Nama kegiatan"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700 dark:text-gray-300">Waktu</span>
              <input
                type="datetime-local"
                value={form.when}
                onChange={e => setForm({ ...form, when: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700 dark:text-gray-300">Lokasi</span>
              <input
                value={form.where}
                onChange={e => setForm({ ...form, where: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                placeholder="Kota/Tempat"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700 dark:text-gray-300">Catatan</span>
              <textarea
                rows={3}
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                placeholder="Opsional"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md border border-emerald-300 dark:border-emerald-700 bg-emerald-600/90 text-white px-4 py-2 text-sm hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4" /> Tambah
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
