// app/komunitas/page.tsx
"use client";


import React, { useMemo, useState } from "react";
import {
  Users, CheckCircle2, XCircle, Clock, Eye, Edit3, RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, Stat } from "@/components/insights-ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import ContribStatusChart from "@/components/charts/comunity/ContribStatusChart";
import CategorySplitChart from "@/components/charts/comunity/CategorySplitChart";
import MySubmissionsTable, { CommunityContribution } from "@/components/comunity/MySubmissionsTable";
import QuickSubmit from "@/components/comunity/QuickSubmit";
import { kategoriBudaya } from "@/lib/budaya--data";

type Status = "draft" | "pending" | "approved" | "rejected";

const seed: CommunityContribution[] = [
  { id: 201, title: "Festival Tandak", category: "Tari Tradisional", region: "Riau", submittedAt: "2025-08-18", status: "approved", attachments: 4, views: 812, likes: 96 },
  { id: 202, title: "Cerita Rakyat Malin Kundang", category: "Upacara Adat", region: "Sumbar", submittedAt: "2025-08-20", status: "pending", attachments: 2, views: 150, likes: 21 },
  { id: 203, title: "Gamelan Banyumasan", category: "Musik Daerah", region: "Jateng", submittedAt: "2025-08-22", status: "rejected", attachments: 1, views: 73, likes: 8 },
  { id: 204, title: "Batik Gedhog", category: "Batik & Tenun", region: "Jatim", submittedAt: "2025-08-24", status: "pending", attachments: 3, views: 204, likes: 27 },
];

export default function CommunityDashboardPage() {
  const [rows, setRows] = useState<CommunityContribution[]>(seed);

  // Modal states
  const [viewModal, setViewModal] = useState<{ open: boolean; item: CommunityContribution | null }>({
    open: false,
    item: null,
  });
  const [editModal, setEditModal] = useState<{ open: boolean; item: CommunityContribution | null }>({
    open: false,
    item: null,
  });
  const [resubmitModal, setResubmitModal] = useState<{ open: boolean; item: CommunityContribution | null }>({
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

  // Resubmit form state
  const [resubmitForm, setResubmitForm] = useState({
    title: "",
    category: "",
    region: "",
    description: "",
    changes: "",
  });

  const kpis = useMemo(() => {
    const total = rows.length;
    const approved = rows.filter(r => r.status === "approved").length;
    const pending = rows.filter(r => r.status === "pending").length;
    const rejected = rows.filter(r => r.status === "rejected").length;
    return { total, approved, pending, rejected };
  }, [rows]);

  // Handler functions for modals
  const handleView = (item: CommunityContribution) => {
    setViewModal({ open: true, item });
  };

  const handleEdit = (item: CommunityContribution) => {
    setEditForm({
      title: item.title,
      category: item.category,
      region: item.region,
      description: "",
    });
    setEditModal({ open: true, item });
  };

  const handleResubmit = (item: CommunityContribution) => {
    setResubmitForm({
      title: item.title,
      category: item.category,
      region: item.region,
      description: "",
      changes: "",
    });
    setResubmitModal({ open: true, item });
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

  const handleResubmitSave = () => {
    if (resubmitModal.item) {
      setRows(prev => prev.map(r =>
        r.id === resubmitModal.item!.id
          ? {
            ...r,
            title: resubmitForm.title,
            category: resubmitForm.category,
            region: resubmitForm.region,
            status: "pending" as Status,
            submittedAt: new Date().toISOString().slice(0, 10)
          }
          : r
      ));
      setResubmitModal({ open: false, item: null });
    }
  };

  // Helper function for status badge styling
  const getStatusBadgeClass = (status: Status) => {
    const statusMap: Record<Status, string> = {
      approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    };
    return statusMap[status];
  };

  // buat ringkasan per-kategori untuk grafik barchart
  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach(r => map.set(r.category, (map.get(r.category) ?? 0) + 1));
    return Array.from(map, ([category, count]) => ({
      category,
      count,
      color: kategoriBudaya.find(k => k.category === category)?.color ?? "#60a5fa",
    })).sort((a, b) => b.count - a.count);
  }, [rows]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat icon={Users} label="Kontribusi Saya" value={kpis.total} color="text-blue-500" />
        <Stat icon={CheckCircle2} label="Disetujui" value={kpis.approved} color="text-emerald-500" />
        <Stat icon={Clock} label="Menunggu" value={kpis.pending} color="text-amber-500" />
        <Stat icon={XCircle} label="Ditolak" value={kpis.rejected} color="text-red-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Progres Moderasi (8 minggu)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ContribStatusChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle>Kontribusi per Kategori</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <CategorySplitChart data={byCategory} />
          </CardContent>
        </Card>
      </div>

      {/* Quick submit */}
      <Card className="mb-6">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Tambah Kontribusi </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <QuickSubmit
            onSubmit={(payload) => {
              const newRow: CommunityContribution = {
                id: Math.max(...rows.map(r => r.id)) + 1,
                title: payload.title,
                category: payload.category,
                region: payload.region,
                submittedAt: new Date().toISOString().slice(0, 10),
                status: "pending",
                attachments: payload.files?.length ?? 0,
                views: 0,
                likes: 0,
              };
              setRows(prev => [newRow, ...prev]);
            }}
          />
        </CardContent>
      </Card>

      {/* Tabel kontribusi saya */}
      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Kontribusi Saya</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <MySubmissionsTable
            rows={rows}
            onAction={(type, row) => {
              if (type === "view") handleView(row);
              if (type === "edit") handleEdit(row);
              if (type === "resubmit") handleResubmit(row);
            }}
          />
        </CardContent>
      </Card>

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
                    {new Date(viewModal.item.submittedAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Attachment</Label>
                  <p className="text-gray-700 dark:text-gray-300">{viewModal.item.attachments} file</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Views</Label>
                  <p className="text-gray-700 dark:text-gray-300">{viewModal.item.views.toLocaleString("id-ID")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Likes</Label>
                  <p className="text-gray-700 dark:text-gray-300">{viewModal.item.likes.toLocaleString("id-ID")}</p>
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
              <Edit3 className="h-5 w-5" />
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

      {/* Resubmit Modal */}
      <Dialog open={resubmitModal.open} onOpenChange={(open) => setResubmitModal({ open, item: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Ajukan Ulang Kontribusi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resubmit-title">Judul *</Label>
              <Input
                id="resubmit-title"
                value={resubmitForm.title}
                onChange={(e) => setResubmitForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Masukkan judul kontribusi..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resubmit-category">Kategori *</Label>
                <Select value={resubmitForm.category} onValueChange={(value) => setResubmitForm(prev => ({ ...prev, category: value }))}>
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
                <Label htmlFor="resubmit-region">Wilayah *</Label>
                <Input
                  id="resubmit-region"
                  value={resubmitForm.region}
                  onChange={(e) => setResubmitForm(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="Masukkan wilayah..."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="resubmit-changes">Perbaikan yang Dilakukan *</Label>
              <Textarea
                id="resubmit-changes"
                value={resubmitForm.changes}
                onChange={(e) => setResubmitForm(prev => ({ ...prev, changes: e.target.value }))}
                placeholder="Jelaskan perbaikan yang telah dilakukan berdasarkan feedback sebelumnya..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="resubmit-description">Deskripsi Tambahan</Label>
              <Textarea
                id="resubmit-description"
                value={resubmitForm.description}
                onChange={(e) => setResubmitForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Informasi tambahan tentang kontribusi..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResubmitModal({ open: false, item: null })}
            >
              Batal
            </Button>
            <Button
              onClick={handleResubmitSave}
              disabled={!resubmitForm.title || !resubmitForm.category || !resubmitForm.region || !resubmitForm.changes}
            >
              Ajukan Ulang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
