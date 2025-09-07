// app/dashboard/moderasi/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Eye, CheckCircle2, XCircle, Filter, Search, X, Loader2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";
import { contributionsApi, ApiError, type Contribution } from "@/lib/contributions-api";

type Status = "pending" | "approved" | "rejected";

export default function ModerasiPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Status | "all">("pending");
  const [rows, setRows] = useState<Contribution[]>([]);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string>("");

  // Modal states
  const [viewingContrib, setViewingContrib] = useState<Contribution | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null);

  // Load initial data
  useEffect(() => {
    loadContributions();
  }, []);

  const loadContributions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contributionsApi.list();
      setRows(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load contributions");
      console.error("Failed to load contributions:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = rows.filter((r) => {
    const passFilter = filter === "all" ? true : r.status === filter;
    const kw = q.trim().toLowerCase();
    const passQ =
      !kw ||
      r.title.toLowerCase().includes(kw) ||
      r.category.toLowerCase().includes(kw) ||
      r.region.toLowerCase().includes(kw) ||
      r.contributor.toLowerCase().includes(kw);
    return passFilter && passQ;
  });

  const updateStatus = async (id: number, status: Status) => {
    try {
      setActionLoading(`Updating status to ${status}...`);
      await contributionsApi.updateStatus(id, status);
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setActionLoading("");
    }
  };

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

      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Antrian Moderasi</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading contributions...</span>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Cari judul/kategori/wilayah/kontributor…"
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
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="all">Semua</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Judul</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Kategori</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Wilayah</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Kontributor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filtered.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/60">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{r.id}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{r.title}</td>
                        <td className="px-4 py-3">{r.category}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.region}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.contributor}</td>
                        <td className="px-4 py-3">
                          {editingStatusId === r.id ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={r.status}
                                onChange={async (e) => {
                                  await updateStatus(r.id, e.target.value as Status);
                                  setEditingStatusId(null);
                                }}
                                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                                autoFocus
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </select>
                              <button
                                onClick={() => setEditingStatusId(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              {r.status !== "pending" ? (
                                <button
                                  onClick={() => setEditingStatusId(r.id)}
                                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-1 transition-colors"
                                  title="Klik untuk edit status"
                                >
                                  <StatusBadge status={r.status} />
                                </button>
                              ) : (
                                <StatusBadge status={r.status} />
                              )}
                            </>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewingContrib(r)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" /> Lihat
                            </button>
                            {r.status === "pending" && (
                              <>
                                <button
                                  onClick={() => updateStatus(r.id, "approved")}
                                  disabled={!!actionLoading}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-emerald-300 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-900/20 hover:cursor-pointer disabled:opacity-50"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Setujui
                                </button>
                                <button
                                  onClick={() => setRejectingId(r.id)}
                                  disabled={!!actionLoading}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20 hover:cursor-pointer disabled:opacity-50"
                                >
                                  <XCircle className="h-3.5 w-3.5" /> Tolak
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                          Tidak ada data.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Contribution Modal */}
      {viewingContrib && (
        <Modal onClose={() => setViewingContrib(null)} title="Detail Kontribusi">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ID Kontribusi
                </div>
                <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">#{viewingContrib.id}</p>
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </div>
                <StatusBadge status={viewingContrib.status} />
              </div>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Judul
              </div>
              <p className="text-sm text-gray-900 dark:text-gray-100">{viewingContrib.title}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kategori
                </div>
                <p className="text-sm text-gray-900 dark:text-gray-100">{viewingContrib.category}</p>
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Wilayah
                </div>
                <p className="text-sm text-gray-900 dark:text-gray-100">{viewingContrib.region}</p>
              </div>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kontributor
              </div>
              <p className="text-sm text-gray-900 dark:text-gray-100">{viewingContrib.contributor}</p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lampiran
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{viewingContrib.attachments} file terlampir</p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewingContrib(null)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:cursor-pointer"
              >
                Tutup
              </button>
              {viewingContrib.status == "pending" && <button
                onClick={async () => {
                  await updateStatus(viewingContrib.id, "approved");
                  setViewingContrib(null);
                }}
                disabled={!!actionLoading}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 hover:cursor-pointer disabled:opacity-50"
              >
                Setujui
              </button>}
              {viewingContrib.status == "pending" && <button
                onClick={() => {
                  setRejectingId(viewingContrib.id);
                  setViewingContrib(null);
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 hover:cursor-pointer"
              >
                Tolak
              </button>}
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Confirmation Modal */}
      {rejectingId && (
        <Modal onClose={() => { setRejectingId(null); setRejectReason(""); }} title="Tolak Kontribusi">
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Anda yakin ingin menolak kontribusi #{rejectingId}?
            </p>

            <div>
              <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alasan penolakan (opsional)
              </label>
              <textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Berikan alasan mengapa kontribusi ini ditolak..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => { setRejectingId(null); setRejectReason(""); }}
                disabled={!!actionLoading}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  await updateStatus(rejectingId, "rejected");
                  setRejectingId(null);
                  setRejectReason("");
                }}
                disabled={!!actionLoading}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="h-4 w-4 inline mr-1 animate-spin" /> : <XCircle className="h-4 w-4 inline mr-1" />}
                Tolak Kontribusi
              </button>
            </div>
          </div>
        </Modal>
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
            className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm bg-white dark:bg-gray-800 hover:cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: Readonly<{ status: Status }>) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
  };

  const labels = {
    pending: "Menunggu",
    approved: "Disetujui",
    rejected: "Ditolak"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
