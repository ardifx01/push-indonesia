import "./globals.css";
import { Inter, Cinzel } from "next/font/google";
import { Metadata } from "next";
import ThemeProvider from "@/components/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  weight: ["600", "800"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "PUSH - Peta Budaya Interaktif Indonesia",
    template: "%s | Peta Budaya",
  },
  description:
    "Platform interaktif untuk eksplorasi peta budaya, mini game, dan informasi provinsi di Indonesia.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "PUSH - Peta Budaya Interaktif Indonesia",
    description:
      "Eksplorasi peta budaya, mini game, dan informasi provinsi secara interaktif.",
    url: "/",
    siteName: "Peta Budaya",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PUSH - Peta Budaya Interaktif Indonesia",
    description:
      "Eksplorasi peta budaya, mini game, dan informasi provinsi secara interaktif.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${cinzel.variable} theme-transition bg-[#0a0f14] text-foreground min-h-dvh [font-family:var(--font-inter)]`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
