"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import * as Icons from "lucide-react";

type IconName = keyof typeof Icons;

// ⚠️ items sekarang hanya berisi data plain
export type SidebarItem = {
  href: string;
  label: string;
  icon?: IconName; // kirim string, mis. "BarChart3"
};

export default function Sidebar({
  brand = "Budaya Insights",
  items,
}: {
  brand?: string;
  items: SidebarItem[];
}) {
  const pathname = usePathname();
  const search = useSearchParams();
  const [open, setOpen] = useState(false);

  // cek aktif: path + query (kalau ada)
  const isActive = (href: string) => {
    try {
      const url = new URL(href, "http://x");
      if (url.pathname !== pathname) return false;
      const entries = Array.from(url.searchParams.entries());
      return entries.length === 0 || entries.every(([k, v]) => search.get(k) === v);
    } catch {
      return false;
    }
  };

  useEffect(() => setOpen(false), [pathname, search?.toString()]);

  const List = (
    <aside className="w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-full">
      <div className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {brand}
        </span>
      </div>
      <nav className="p-2 space-y-1">
        {items.map((item) => {
          const active = isActive(item.href);
          const IconComp = item.icon ? (Icons[item.icon] as any) : null;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                active
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-gray-100",
              ].join(" ")}
            >
              {IconComp ? <IconComp className="h-4 w-4" /> : null}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="h-14 flex items-center justify-between px-4">
          <button
            aria-label="Open sidebar"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold">{brand}</span>
          <div className="w-9" />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block h-full">{List}</div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg flex flex-col">
            <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
              <span className="text-sm font-semibold">{brand}</span>
              <button
                aria-label="Close sidebar"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{List}</div>
          </div>
        </div>
      )}
    </>
  );
}
