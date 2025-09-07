// app/dashboard/tren/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";
import ModerationTrend, { ModerationPoint } from "@/components/charts/ModerationTrend";
import StatusPie, { StatusSlice } from "@/components/charts/StatusPie";

type Status = "pending" | "approved" | "rejected";
type Contribution = { id: number; status: Status };

const seed: Contribution[] = [
  { id: 1, status: "pending" }, { id: 2, status: "approved" },
  { id: 3, status: "pending" }, { id: 4, status: "rejected" },
];

const colors = { success: "#09f6e9", warning: "#f59e0b", danger: "#ef4444" };

export default function TrenPage() {
  const moderationData: ModerationPoint[] = useMemo(
    () => [
      { w: "W-1", approved: 1, pending: 2, rejected: 0 },
      { w: "W-2", approved: 2, pending: 2, rejected: 1 },
      { w: "W-3", approved: 3, pending: 1, rejected: 0 },
      { w: "W-4", approved: 2, pending: 3, rejected: 1 },
      { w: "W-5", approved: 4, pending: 2, rejected: 0 },
      { w: "W-6", approved: 5, pending: 2, rejected: 1 },
      { w: "W-7", approved: 6, pending: 2, rejected: 1 },
      { w: "W-8", approved: 7, pending: 1, rejected: 1 },
    ],
    []
  );

  const statusBreakdown: StatusSlice[] = useMemo(() => {
    const p = seed.filter((r) => r.status === "pending").length;
    const a = seed.filter((r) => r.status === "approved").length;
    const rj = seed.filter((r) => r.status === "rejected").length;
    return [
      { name: "Approved", value: a, color: colors.success },
      { name: "Pending", value: p, color: colors.warning },
      { name: "Rejected", value: rj, color: colors.danger },
    ];
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Tren Moderasi (8 minggu)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ModerationTrend data={moderationData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Ringkasan Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <StatusPie data={statusBreakdown} />
        </CardContent>
      </Card>
    </div>
  );
}
