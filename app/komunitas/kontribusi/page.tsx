// app/komunitas/kontribusi/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Search, Filter, Eye, Pencil, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from "@/lib/budaya--data";
import { kategoriBudaya } from "@/lib/budaya--data";

type Status = "pending" | "approved" | "rejected";

type MyContribution = {
  id: number;
  title: string;
  category: string;
  region: string;
  date: string; // ISO
  status: Status;
};

const seed: MyContribution[] = [
  { id: 101, title: "Upacara Wiwitan", category: "Upacara Adat", region: "DIY", date: "2025-08-01", status: "pending" },
  { id: 102, title: "Tari Gantar", category: "Tari Tradisional", region: "Kaltim", date: "2025-07-20", status: "approved" },
  { id: 103, title: "Batik Madura", category: "Batik & Tenun", region: "Jatim", date: "2025-06-18", status: "rejected" },
];

export default function MyContributionsPage() {
  const [rows, setRows] = useState<MyContribution[]>(seed);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");

  // Modal states
  const [viewModal, setViewModal] = useState<{ open: boolean; item: MyContribution | null }>({
    open: false,
    item: null,
  });
  const [editModal, setEditModal] = useState<{ open: boolean; item: MyContribution | null }>({
    open: false,
    item: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: MyContribution | null }>({
    open: false,
    item: null,
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    region: "",
    description: "",
  });

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return rows.filter(r => {
      const passFilter = filter === "all" ? true : r.status === filter;
      const passQ =
        !kw ||
        r.title.toLowerCase().includes(kw) ||
        r.category.toLowerCase().includes(kw) ||
        r.region.toLowerCase().includes(kw);
      return passFilter && passQ;
    });
  }, [rows, q, filter]);

  // Handler functions
  const handleView = (item: MyContribution) => {
    setViewModal({ open: true, item });
  };

  const handleEdit = (item: MyContribution) => {
    setEditForm({
      title: item.title,
      category: item.category,
      region: item.region,
      description: "",
    });
    setEditModal({ open: true, item });
  };

  const handleDelete = (item: MyContribution) => {
    setDeleteModal({ open: true, item });
  };

  const handleEditSave = () => {
    if (editModal.item) {
      setRows(prev => prev.map(r =>
        r.id === editModal.item!.id
          ? { ...r, title: editForm.title, category: editForm.category, region: editForm.region }
          : r
      ));
      setEditModal({ open: false, item: null });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      setRows(prev => prev.filter(r => r.id !== deleteModal.item!.id));
      setDeleteModal({ open: false, item: null });
    }
  };

  // Helper function for status badge styling
  const getStatusBadgeClass = (status: Status) => {
    const statusMap: Record<Status, string> = {
      approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    };
    return statusMap[status];
  };

  const badge = (s: Status) => {
    const base = "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium";
    const statusClass = getStatusBadgeClass(s);

    if (s === "approved") return <span className={`${base} ${statusClass}`}><CheckCircle2 className="h-3.5 w-3.5" />Approved</span>;
    if (s === "rejected") return <span className={`${base} ${statusClass}`}><XCircle className="h-3.5 w-3.5" />Rejected</span>;
    return <span className={`${base} ${statusClass}`}><Clock className="h-3.5 w-3.5" />Pending</span>;
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle>Kontribusi Saya</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {/* tools */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari judul/kategori/wilayah…"
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
              <option value="all">Semua</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Judul</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Wilayah</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/60">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{r.id}</td>
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3">{r.category}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.region}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{new Date(r.date).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-3">{badge(r.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(r)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> Lihat
                      </button>
                      <button
                        onClick={() => handleEdit(r)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-blue-300 text-blue-700 dark:text-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-red-300 text-red-600 dark:border-red-700 dark:hover:bg-red-900/20 hover:bg-red-50 hover:cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Tidak ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* View Modal */}
      <Dialog open={viewModal.open} onOpenChange={(open) => setViewModal({ open, item: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detail Kontribusi
            </DialogTitle>
          </DialogHeader>
          {viewModal.item && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">ID</Label>
                <p className="text-gray-900 dark:text-gray-100">{viewModal.item.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Judul</Label>
                <p className="text-gray-900 dark:text-gray-100">{viewModal.item.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Kategori</Label>
                  <p className="text-gray-700 dark:text-gray-300">{viewModal.item.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Wilayah</Label>
                  <p className="text-gray-700 dark:text-gray-300">{viewModal.item.region}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(viewModal.item.status)}`}>
                      {viewModal.item.status}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tanggal Submit</Label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(viewModal.item.date).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewModal({ open: false, item: null })}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModal.open} onOpenChange={(open) => setEditModal({ open, item: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Kontribusi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Judul *</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Masukkan judul kontribusi..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Kategori *</Label>
                <Select value={editForm.category} onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriBudaya.map((k) => (
                      <SelectItem key={k.category} value={k.category}>
                        {k.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-region">Wilayah *</Label>
                <Input
                  id="edit-region"
                  value={editForm.region}
                  onChange={(e) => setEditForm(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="Masukkan wilayah..."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Deskripsi Perubahan</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Jelaskan perubahan yang dilakukan..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditModal({ open: false, item: null })}
            >
              Batal
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={!editForm.title || !editForm.category || !editForm.region}
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, item: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Hapus Kontribusi
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteModal.item && (
                <>
                  Apakah Anda yakin ingin menghapus kontribusi <strong>"{deleteModal.item.title}"</strong>?
                  <br />
                  Tindakan ini tidak dapat dibatalkan.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteModal({ open: false, item: null })}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
