"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";
import {
  Plus, Pencil, Trash2, Save, X, Search, Download, Layers, Tags
} from "lucide-react";
import {
  kategoriBudaya as initKategori,
  tabelDetail as initItems,
  Category,
  DetailedItem,
} from "@/lib/budaya--data";

type Tab = "items" | "kategori";

export default function BudayaEditorPage() {
  const [tab, setTab] = useState<Tab>("items");

  // state utama
  const [items, setItems] = useState<DetailedItem[]>(initItems);
  const [kategori, setKategori] = useState<Category[]>(initKategori);

  // filter & search
  const [selectedKategori, setSelectedKategori] = useState<string>("__ALL__");
  const [q, setQ] = useState("");

  // modal state
  const [editing, setEditing] = useState<DetailedItem | null>(null);
  const [editingKat, setEditingKat] = useState<Category | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmKat, setConfirmKat] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return items.filter((r) => {
      const byKat = selectedKategori === "__ALL__" ? true : r.category === selectedKategori;
      const byKw =
        kw.length === 0 ||
        r.item.toLowerCase().includes(kw) ||
        r.category.toLowerCase().includes(kw) ||
        r.region.toLowerCase().includes(kw);
      return byKat && byKw;
    });
  }, [items, q, selectedKategori]);

  // ===== Utils
  const nextItemId = () => (items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1);

  const exportCSV = (rows: DetailedItem[]) => {
    const header = ["id", "category", "item", "value", "region", "growth", "revenue"];
    const lines = [
      header.join(","),
      ...rows.map((r) =>
        [
          r.id,
          `"${r.category.replace(/"/g, '""')}"`,
          `"${r.item.replace(/"/g, '""')}"`,
          r.value,
          `"${r.region.replace(/"/g, '""')}"`,
          r.growth,
          r.revenue ?? "",
        ].join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "budaya-items.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Edit Data Budaya
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Kelola data primer (items) & kategori. Perubahan saat ini hanya di memori—hubungkan ke API untuk persist.
          </p>
        </div>

        <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
          <button
            onClick={() => setTab("items")}
            className={`px-3 py-2 rounded-md text-sm font-medium ${tab === "items"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
              : "text-gray-600 dark:text-gray-400"
              }`}
          >
            <Layers className="inline-block h-4 w-4 mr-2" /> Item Primer
          </button>
          <button
            onClick={() => setTab("kategori")}
            className={`px-3 py-2 rounded-md text-sm font-medium ${tab === "kategori"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
              : "text-gray-600 dark:text-gray-400"
              }`}
          >
            <Tags className="inline-block h-4 w-4 mr-2" /> Kategori
          </button>
        </div>
      </div>

      {tab === "items" ? (
        <Card>
          <CardHeader className="flex flex-col gap-3 border-b border-gray-200 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Item Primer</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari item/kategori/wilayah…"
                  className="pl-8 pr-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="__ALL__">Semua Kategori</option>
                {kategori.map((k) => (
                  <option key={k.category} value={k.category}>
                    {k.category}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  setEditing({
                    id: nextItemId(),
                    category: kategori[0]?.category ?? "",
                    item: "",
                    value: 0,
                    region: "",
                    growth: 0,
                    revenue: undefined,
                  })
                }
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Plus className="h-4 w-4" /> Tambah
              </button>
              <button
                onClick={() => exportCSV(filteredItems)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nilai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wilayah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Growth</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredItems.map((row, i) => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-3 text-gray-900 dark:text-gray-100 font-medium">{row.id}</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center gap-2 text-gray-900 dark:text-gray-100 font-medium">
                          <span
                            className="w-3 h-3 rounded-sm"
                            style={{ background: kategori.find((k) => k.category === row.category)?.color || "#6b7280" }}
                          />
                          {row.category}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{row.item}</td>
                      <td className="px-6 py-3 text-gray-900 dark:text-gray-100 font-semibold">{row.value.toLocaleString("id-ID")}</td>
                      <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{row.region}</td>
                      <td className={`px-6 py-3 font-medium ${row.growth >= 10 ? "text-green-600" : "text-orange-500"}`}>+{row.growth}%</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditing({ ...row })}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => setConfirmId(row.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-col gap-3 border-b border-gray-200 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Kategori</CardTitle>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setEditingKat({
                    category: "",
                    sales: 0,
                    growth: 0,
                    items: 0,
                    target: 0,
                    color: "#60a5fa",
                  })
                }
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Plus className="h-4 w-4" /> Tambah
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Warna
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Growth
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {kategori.map((k) => (
                    <tr key={k.category} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-3 text-gray-900 dark:text-gray-100 font-medium">{k.category}</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-4 h-4 rounded-sm" style={{ background: k.color }} />
                          <span className="text-gray-700 dark:text-gray-300">{k.color}</span>
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-900 dark:text-gray-100 font-semibold">{k.sales.toLocaleString("id-ID")}</td>
                      <td className={`px-6 py-3 font-medium ${k.growth >= 10 ? "text-green-600" : "text-orange-500"}`}>+{k.growth}%</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingKat({ ...k })}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => setConfirmKat(k.category)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {kategori.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">
                        Tidak ada kategori.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== Modals ===== */}

      {/* Edit/Tambah Item */}
      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Item" : "Tambah Item"}>
          <ItemForm
            value={editing}
            kategoriOptions={kategori.map((k) => k.category)}
            onCancel={() => setEditing(null)}
            onSave={(val) => {
              setItems((prev) => {
                const exists = prev.some((p) => p.id === val.id);
                return exists ? prev.map((p) => (p.id === val.id ? val : p)) : [...prev, val];
              });
              setEditing(null);
            }}
          />
        </Modal>
      )}

      {/* Hapus Item */}
      {confirmId !== null && (
        <Confirm
          text="Hapus item ini? Tindakan tidak bisa dibatalkan."
          onCancel={() => setConfirmId(null)}
          onConfirm={() => {
            setItems((prev) => prev.filter((p) => p.id !== confirmId));
            setConfirmId(null);
          }}
        />
      )}

      {/* Edit/Tambah Kategori */}
      {editingKat && (
        <Modal onClose={() => setEditingKat(null)} title={editingKat.category ? "Edit Kategori" : "Tambah Kategori"}>
          <KategoriForm
            value={editingKat}
            onCancel={() => setEditingKat(null)}
            onSave={(val) => {
              setKategori((prev) => {
                const exists = prev.some((p) => p.category === editingKat.category);
                // rename kategori juga harus memantulkan ke items
                if (exists && val.category !== editingKat.category) {
                  setItems((old) =>
                    old.map((it) => (it.category === editingKat.category ? { ...it, category: val.category } : it))
                  );
                }
                const next = exists
                  ? prev.map((p) => (p.category === editingKat.category ? val : p))
                  : [...prev, val];
                return next;
              });
              setEditingKat(null);
            }}
          />
        </Modal>
      )}

      {/* Hapus Kategori */}
      {confirmKat && (
        <Confirm
          text={`Hapus kategori "${confirmKat}"? Item yang memakai kategori ini tidak ikut dihapus.`}
          onCancel={() => setConfirmKat(null)}
          onConfirm={() => {
            setKategori((prev) => prev.filter((k) => k.category !== confirmKat));
            setConfirmKat(null);
          }}
        />
      )}
    </div>
  );
}

/* ===================== Sub Components ===================== */

function Modal({
  title,
  onClose,
  children,
}: Readonly<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button className="absolute inset-0 bg-black/40 hover:cursor-pointer" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm bg-white dark:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Confirm({
  text,
  onCancel,
  onConfirm,
}: Readonly<{
  text: string;
  onCancel: () => void;
  onConfirm: () => void;
}>) {
  return (
    <Modal title="Konfirmasi" onClose={onCancel}>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{text}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" /> Hapus
        </button>
      </div>
    </Modal>
  );
}

function ItemForm({
  value,
  kategoriOptions,
  onCancel,
  onSave,
}: Readonly<{
  value: DetailedItem;
  kategoriOptions: string[];
  onCancel: () => void;
  onSave: (val: DetailedItem) => void;
}>) {
  const [form, setForm] = useState<DetailedItem>(value);
  const set = <K extends keyof DetailedItem,>(k: K, v: DetailedItem[K]) => setForm((f) => ({ ...f, [k]: v }));

  const valid = form.category && form.item && form.region && form.value >= 0 && form.growth >= 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onSave(form);
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="block text-gray-700 dark:text-gray-300 mb-1">Kategori</span>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            {kategoriOptions.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="block text-gray-700 dark:text-gray-300 mb-1">Item</span>
          <input
            value={form.item}
            onChange={(e) => set("item", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            placeholder="Nama item"
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-700 dark:text-gray-300 mb-1">Nilai</span>
          <input
            type="number"
            value={form.value}
            onChange={(e) => set("value", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            min={0}
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-700 dark:text-gray-300 mb-1">Wilayah</span>
          <input
            value={form.region}
            onChange={(e) => set("region", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            placeholder="cth: Jatim"
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-700 dark:text-gray-300 mb-1">Growth (%)</span>
          <input
            type="number"
            step="0.1"
            value={form.growth}
            onChange={(e) => set("growth", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            min={0}
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-700 dark:text-gray-300 mb-1">Revenue (opsional)</span>
          <input
            type="number"
            value={form.revenue ?? 0}
            onChange={(e) => set("revenue", Number(e.target.value) || undefined)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            min={0}
          />
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={!valid}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-emerald-300 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-900/20 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> Simpan
        </button>
      </div>
    </form>
  );
}

function KategoriForm({
  value,
  onCancel,
  onSave,
}: Readonly<{
  value: Category;
  onCancel: () => void;
  onSave: (val: Category) => void;
}>) {
  const [form, setForm] = useState<Category>(value);
  const set = <K extends keyof Category,>(k: K, v: Category[K]) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.category.trim().length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onSave(form);
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="block text-gray-700 dark:text-gray-300 mb-1">Nama Kategori</span>
          <input
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            placeholder="cth: Tari Tradisional"
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-700 dark:text-gray-300 mb-1">Warna (hex)</span>
          <input
            value={form.color}
            onChange={(e) => set("color", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            placeholder="#60a5fa"
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-700 dark:text-gray-300 mb-1">Sales</span>
          <input
            type="number"
            value={form.sales}
            onChange={(e) => set("sales", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            min={0}
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-700 dark:text-gray-300 mb-1">Growth (%)</span>
          <input
            type="number"
            step="0.1"
            value={form.growth}
            onChange={(e) => set("growth", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            min={0}
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-700 dark:text-gray-300 mb-1">Target</span>
          <input
            type="number"
            value={form.target}
            onChange={(e) => set("target", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            min={0}
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-700 dark:text-gray-300 mb-1">Items</span>
          <input
            type="number"
            value={form.items}
            onChange={(e) => set("items", Number(e.target.value))}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            min={0}
          />
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={!valid}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-emerald-300 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-900/20 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> Simpan
        </button>
      </div>
    </form>
  );
}
