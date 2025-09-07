// app/komunitas/event/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Calendar, MapPin, Plus, Trash2, Eye, Edit3 } from "lucide-react";
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

  // Modal states
  const [viewModal, setViewModal] = useState<{ open: boolean; item: KomEvent | null }>({
    open: false,
    item: null,
  });
  const [editModal, setEditModal] = useState<{ open: boolean; item: KomEvent | null }>({
    open: false,
    item: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: KomEvent | null }>({
    open: false,
    item: null,
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    when: "",
    where: "",
    note: "",
  });
  const monthKey = (d: string) => new Date(d).toLocaleString("id-ID", { month: "long", year: "numeric" });

  // Handler functions
  const handleView = (item: KomEvent) => {
    setViewModal({ open: true, item });
  };

  const handleEdit = (item: KomEvent) => {
    setEditForm({
      title: item.title,
      when: item.when,
      where: item.where,
      note: item.note || "",
    });
    setEditModal({ open: true, item });
  };

  const handleDelete = (item: KomEvent) => {
    setDeleteModal({ open: true, item });
  };

  const handleEditSave = () => {
    if (editModal.item) {
      setEvents(prev => prev.map(e =>
        e.id === editModal.item!.id
          ? { ...e, title: editForm.title, when: editForm.when, where: editForm.where, note: editForm.note }
          : e
      ));
      setEditModal({ open: false, item: null });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      setEvents(prev => prev.filter(e => e.id !== deleteModal.item!.id));
      setDeleteModal({ open: false, item: null });
    }
  };

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
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{ev.title}</div>
                        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(ev.when).toLocaleString("id-ID")}</span>
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {ev.where}</span>
                        </div>
                        {ev.note && <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{ev.note}</div>}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleView(ev)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" /> Lihat
                        </button>
                        <button
                          onClick={() => handleEdit(ev)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-blue-300 text-blue-700 dark:text-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ev)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-red-300 text-red-600 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Hapus
                        </button>
                      </div>
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
              className="inline-flex items-center gap-2 rounded-md border border-emerald-300 dark:border-emerald-700 bg-emerald-600/90 text-white px-4 py-2 text-sm hover:bg-emerald-600 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Tambah
            </button>
          </form>
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={viewModal.open} onOpenChange={(open) => setViewModal({ open, item: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detail Event
            </DialogTitle>
          </DialogHeader>
          {viewModal.item && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Judul Event</Label>
                <p className="text-gray-900 dark:text-gray-100">{viewModal.item.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Waktu</Label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(viewModal.item.when).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Lokasi</Label>
                  <p className="text-gray-700 dark:text-gray-300">{viewModal.item.where}</p>
                </div>
              </div>
              {viewModal.item.note && (
                <div>
                  <Label className="text-sm font-medium">Catatan</Label>
                  <p className="text-gray-700 dark:text-gray-300">{viewModal.item.note}</p>
                </div>
              )}
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
              <Edit3 className="h-5 w-5" />
              Edit Event
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Judul Event *</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nama kegiatan..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-when">Waktu *</Label>
                <Input
                  id="edit-when"
                  type="datetime-local"
                  value={editForm.when}
                  onChange={(e) => setEditForm(prev => ({ ...prev, when: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-where">Lokasi *</Label>
                <Input
                  id="edit-where"
                  value={editForm.where}
                  onChange={(e) => setEditForm(prev => ({ ...prev, where: e.target.value }))}
                  placeholder="Kota/Tempat..."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-note">Catatan</Label>
              <Textarea
                id="edit-note"
                value={editForm.note}
                onChange={(e) => setEditForm(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Catatan tambahan..."
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
              disabled={!editForm.title || !editForm.when || !editForm.where}
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
              Hapus Event
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteModal.item && (
                <>
                  Apakah Anda yakin ingin menghapus event <strong>"{deleteModal.item.title}"</strong>?
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
    </div>
  );
}
