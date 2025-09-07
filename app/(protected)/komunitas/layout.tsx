// app/komunitas/layout.tsx
"use client";

import { Suspense } from "react";
import Sidebar from "@/components/sidebar";
import ThemeToggle from "@/components/theme-toggle";

export default function KomunitasLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const items = [
    {
      href: "/komunitas",
      label: "Ringkasan",
      icon: "LayoutDashboard" as const,
    },
    {
      href: "/komunitas/kontribusi",
      label: "Kontribusi Saya",
      icon: "FolderOpen" as const,
    },
    {
      href: "/komunitas/quick-submit",
      label: "Ajukan Budaya",
      icon: "Upload" as const,
    },
    {
      href: "/komunitas/event",
      label: "Event",
      icon: "CalendarRange" as const,
    },
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
            <Sidebar brand="Komunitas · Budaya" items={items} />
          </Suspense>
          <main className="flex-1 h-full mx-auto">
            {/* toggle tema konsisten (kanan atas) */}
            <div className="fixed right-0 lg:flex justify-end px-4 pt-8 z-10">
              <ThemeToggle />
            </div>

            {/* konten halaman */}
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
