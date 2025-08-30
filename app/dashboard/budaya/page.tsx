"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";
import {
  Plus, Pencil, Trash2, Save, X, Search, Download, Layers, Tags, Loader2, AlertCircle
} from "lucide-react";
import {
  Category,
  DetailedItem,
} from "@/lib/budaya--data";
import { categoriesApi, itemsApi, ApiError } from "@/lib/budaya-api";

type Tab = "items" | "kategori";

type CategoryWithId = Category & { id: string };

export default function BudayaEditorPage() {
  const [tab, setTab] = useState<Tab>("items");

  // state utama
  const [items, setItems] = useState<DetailedItem[]>([]);
  const [kategori, setKategori] = useState<CategoryWithId[]>([]);

  // loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string>("");

  // filter & search
  const [selectedKategori, setSelectedKategori] = useState<string>("__ALL__");
  const [q, setQ] = useState("");

  // modal state
  const [editing, setEditing] = useState<DetailedItem | null>(null);
  const [editingKat, setEditingKat] = useState<CategoryWithId | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmKat, setConfirmKat] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [categoriesData, itemsData] = await Promise.all([
        categoriesApi.list(),
        itemsApi.list()
      ]);

      setKategori(categoriesData);
      setItems(itemsData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load data");
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

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

  // ===== API Functions =====
  const handleSaveItem = async (item: DetailedItem) => {
    try {
      setActionLoading("Saving item...");

      if (items.some(i => i.id === item.id)) {
        // Update existing item
        const { id, ...updates } = item;
        await itemsApi.update(id, updates);
        setItems(prev => prev.map(i => i.id === id ? item : i));
      } else {
        // Create new item
        const { id, ...newItem } = item;
        const created = await itemsApi.create(newItem);
        setItems(prev => [...prev, created]);
      }

      setEditing(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save item");
    } finally {
      setActionLoading("");
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      setActionLoading("Deleting item...");
      await itemsApi.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
      setConfirmId(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete item");
    } finally {
      setActionLoading("");
    }
  };

  const handleSaveCategory = async (category: CategoryWithId) => {
    try {
      setActionLoading("Saving category...");

      const isExisting = editingKat && kategori.some(k => k.id === editingKat.id);

      if (isExisting) {
        // Update existing category
        const { id, ...updates } = category;
        await categoriesApi.update(id, updates);
        setKategori(prev => prev.map(k => k.id === id ? category : k));

        // Update category name in items if changed
        if (editingKat && category.category !== editingKat.category) {
          setItems(prev => prev.map(item =>
            item.category === editingKat.category
              ? { ...item, category: category.category }
              : item
          ));
        }
      } else {
        // Create new category
        const { id, ...newCategory } = category;
        const created = await categoriesApi.create(newCategory);
        setKategori(prev => [...prev, created]);
      }

      setEditingKat(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save category");
    } finally {
      setActionLoading("");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setActionLoading("Deleting category...");
      await categoriesApi.delete(id);
      setKategori(prev => prev.filter(k => k.id !== id));
      setConfirmKat(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete category");
    } finally {
      setActionLoading("");
    }
  };

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

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Error Alert */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={() => setError("")}
                className="mt-2 text-xs text-red-600 dark:text-red-400 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Loading */}
      {actionLoading && (
        <div className="mb-4 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="ml-2 text-sm text-blue-800 dark:text-blue-200">{actionLoading}</span>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Edit Data Budaya
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Kelola data primer (items) & kategori. Data tersinkron dengan backend API.
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
                disabled={!!actionLoading}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
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
                            disabled={!!actionLoading}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => setConfirmId(row.id)}
                            disabled={!!actionLoading}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20 disabled:opacity-50"
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
                    id: "",
                    category: "",
                    sales: 0,
                    growth: 0,
                    items: 0,
                    target: 0,
                    color: "#60a5fa",
                  })
                }
                disabled={!!actionLoading}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
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
                            disabled={!!actionLoading}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => setConfirmKat(k.category)}
                            disabled={!!actionLoading}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20 disabled:opacity-50"
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
            onSave={handleSaveItem}
            loading={!!actionLoading}
          />
        </Modal>
      )}

      {/* Hapus Item */}
      {confirmId !== null && (
        <Confirm
          text="Hapus item ini? Tindakan tidak bisa dibatalkan."
          onCancel={() => setConfirmId(null)}
          onConfirm={() => handleDeleteItem(confirmId)}
          loading={!!actionLoading}
        />
      )}

      {/* Edit/Tambah Kategori */}
      {editingKat && (
        <Modal onClose={() => setEditingKat(null)} title={editingKat.category ? "Edit Kategori" : "Tambah Kategori"}>
          <KategoriForm
            value={editingKat}
            onCancel={() => setEditingKat(null)}
            onSave={handleSaveCategory}
            loading={!!actionLoading}
          />
        </Modal>
      )}

      {/* Hapus Kategori */}
      {confirmKat && (
        <Confirm
          text={`Hapus kategori "${confirmKat}"? Item yang memakai kategori ini tidak ikut dihapus.`}
          onCancel={() => setConfirmKat(null)}
          onConfirm={() => {
            const cat = kategori.find(k => k.category === confirmKat);
            if (cat) handleDeleteCategory(cat.id);
          }}
          loading={!!actionLoading}
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
  loading = false,
}: Readonly<{
  text: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}>) {
  return (
    <Modal title="Konfirmasi" onClose={onCancel}>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{text}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Hapus
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
  loading = false,
}: Readonly<{
  value: DetailedItem;
  kategoriOptions: string[];
  onCancel: () => void;
  onSave: (val: DetailedItem) => void;
  loading?: boolean;
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
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={!valid || loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-emerald-300 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-900/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan
        </button>
      </div>
    </form>
  );
}

function KategoriForm({
  value,
  onCancel,
  onSave,
  loading = false,
}: Readonly<{
  value: CategoryWithId;
  onCancel: () => void;
  onSave: (val: CategoryWithId) => void;
  loading?: boolean;
}>) {
  const [form, setForm] = useState<CategoryWithId>(value);
  const set = <K extends keyof CategoryWithId,>(k: K, v: CategoryWithId[K]) => setForm((f) => ({ ...f, [k]: v }));
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
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={!valid || loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-emerald-300 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-900/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan
        </button>
      </div>
    </form>
  );
}
