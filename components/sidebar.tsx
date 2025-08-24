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
}: Readonly<{
  brand?: string;
  items: SidebarItem[];
}>) {
  const pathname = usePathname();
  const search = useSearchParams();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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

  // restore/save collapsed state (desktop)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebar:collapsed");
      if (saved != null) setCollapsed(saved === "1");
    } catch { }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sidebar:collapsed", collapsed ? "1" : "0");
    } catch { }
  }, [collapsed]);

  const List = (
    <aside
      className={[
        "fixed left-0 top-0 z-30 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-screen transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      ].join(" ")}
    >
      <div className="h-14 flex items-center justify-between px-2 lg:px-3 border-b border-gray-200 dark:border-gray-800">
        <span
          className={[
            "text-sm font-semibold text-gray-900 dark:text-gray-100 truncate",
            collapsed ? "sr-only" : "",
          ].join(" ")}
        >
          {brand}
        </span>
        {/* collapse toggle (desktop only) */}
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((v) => !v)}
          className="hidden lg:inline-flex items-center justify-center rounded-md border hover:cursor-poin border-gray-300 dark:border-gray-700 px-2 py-1.5 text-xs text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:cursor-pointer"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <Icons.ChevronRight className="h-4 w-4" /> : <Icons.ChevronLeft className="h-4 w-4" />}
        </button>
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
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                collapsed ? "justify-center" : "",
                active
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-gray-100",
              ].join(" ")}
              title={collapsed ? item.label : undefined}
            >
              {IconComp ? (
                <IconComp className="h-4 w-4 shrink-0" />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-sm bg-gray-200 dark:bg-gray-700 text-[10px] font-medium grid place-items-center text-gray-700 dark:text-gray-200">
                  {item.label.charAt(0)}
                </span>
              )}
              <span className={[collapsed ? "sr-only" : "", "whitespace-nowrap"].join(" ")}>{item.label}</span>
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
      <div className="hidden lg:block">{List}</div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
            aria-label="Close sidebar"
          />
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
