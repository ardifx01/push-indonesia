// app/dashboard/primer/page.tsx
"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/insights-ui";
import PrimerItemsGrowth, { PrimerDatum } from "@/components/charts/PrimerItemsGrowth";
import { kategoriBudaya as kategoriSeed } from "@/lib/budaya--data";

export default function PrimerPage() {
  const primerOverview: PrimerDatum[] = useMemo(
    () =>
      kategoriSeed.slice(0, 8).map((k) => ({
        category: k.category,
        items: k.items,
        growth: k.growth,
        color: k.color,
      })),
    []
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle>Primer · Items vs Growth</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <PrimerItemsGrowth data={primerOverview} />
        </CardContent>
      </Card>
    </div>
  );
}
