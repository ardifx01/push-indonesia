import "../globals.css";
import Sidebar from "@/components/sidebar";
import ThemeToggle from "@/components/theme-toggle";

export default function PremiumLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const items = [
    { href: "/premium", label: "Overview", icon: "Home" as const },
    { href: "/premium?mode=charts", label: "Charts (Primer)", icon: "BarChart3" as const },
    { href: "/premium?mode=table", label: "Cards (Sekunder)", icon: "Table" as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto">
        <div className="flex">
          <Sidebar brand="Admin · Budaya" items={items} />
          <main className="flex-1 h-full overflow-auto">
            <div className="hidden lg:flex justify-end px-4">
              <ThemeToggle />
            </div>
            {children}
          </main>
        </div>
      </div>
    </div >
  );
}
