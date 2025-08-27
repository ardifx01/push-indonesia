// app/dashboard/distribusi/page.tsx
"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";
import CategoryDistribution, { CategoryBar } from "@/components/charts/CategoryDistribution";
import { kategoriBudaya as kategoriSeed } from "@/lib/budaya--data";

type Row = { category: string };
const rows: Row[] = [
  { category: "Adat Istiadat" },
  { category: "Seni Pertunjukan" },
  { category: "Permainan Rakyat" },
  { category: "Kuliner Khas" },
  { category: "Adat Istiadat" },
];

export default function DistribusiPage() {
  const byCategory: CategoryBar[] = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r) => map.set(r.category, (map.get(r.category) ?? 0) + 1));
    return Array.from(map, ([category, count]) => ({
      category,
      count,
      color: kategoriSeed.find((k) => k.category === category)?.color || "#60a5fa",
    })).sort((a, b) => b.count - a.count);
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Distribusi Kontribusi per Kategori</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <CategoryDistribution data={byCategory} />
        </CardContent>
      </Card>
    </div>
  );
}
