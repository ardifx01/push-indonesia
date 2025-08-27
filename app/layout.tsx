import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata = {
  title: "Budaya Insights",
  description: "Dashboards Admin & Premium + API Docs",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="theme-transition bg-background text-foreground min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
