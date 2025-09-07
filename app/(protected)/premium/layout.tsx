// app/premium/layout.tsx (punyamu yang sekarang, tambahkan 1 item)
import { Suspense } from "react";
import Sidebar from "@/components/sidebar";
import ThemeToggle from "@/components/theme-toggle";

export default function PremiumLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const items = [
    { href: "/premium", label: "Overview", icon: "Home" as const },
    {
      href: "/premium/analisis",
      label: "Analisis",
      icon: "LineChart" as const,
    },
    {
      href: "/premium/data-budaya",
      label: "Data Budaya",
      icon: "Database" as const,
    }, // <— NEW
    { href: "/reference", label: "API Docs", icon: "Code2" as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto">
        <div className="flex">
          <Suspense
            fallback={
              <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700" />
            }
          >
            <Sidebar brand="Premium · Budaya" items={items} />
          </Suspense>
          <main className="flex-1 h-full overflow-auto">
            <div className="hidden lg:flex justify-end px-4">
              <ThemeToggle />
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
