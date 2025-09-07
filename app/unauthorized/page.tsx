"use client";

import * as React from "react";
import Link from "next/link";

export default function Page() {
  return <BatikUnauthorized401 />;
}

export function BatikUnauthorized401({
  title = "401 — Akses Terbatas",
  subtitle = "Anda tidak memiliki hak akses halaman ini.",
  hint = "Jika menurut Anda ini adalah kesalahan, hubungi admin untuk mendapatkan akses.",
}: {
  title?: string;
  subtitle?: string;
  hint?: string;
}) {
  return (
    <main
      role="main"
      aria-labelledby="unauth-title"
      className="relative min-h-dvh overflow-hidden select-none"
    >
      {/* BACKDROP (simple, clean, tetap batik) */}
      <div className="absolute inset-0 bg-[#0b0f17]">
        <div className="absolute inset-0 batik-kawung-lite opacity-[0.12]" />
        <div className="absolute inset-0 gold-sheen-lite opacity-[0.08]" />
      </div>

      {/* CONTENT */}
      <section className="relative z-10 grid place-items-center px-6 py-16">
        <div className="w-full max-w-[560px] rounded-2xl border border-[#d4af37]/20 bg-black/30 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.45)] ring-1 ring-[#8a6f2a]/15">
          <div className="px-7 py-8">
            {/* Icon + Title */}
            <div className="mb-5 flex items-center gap-3">
              <LockBadge />
              <h1
                id="unauth-title"
                className="text-xl md:text-2xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#ffda79] via-[#d4af37] to-[#a67c00]"
              >
                {title}
              </h1>
            </div>

            <p className="text-sm md:text-base text-[#f4e7c7]/80">{subtitle}</p>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {/* Tombol Clerk (mode modal). Jika Clerk belum aktif, link fallback tetap berfungsi. */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
                text-[#f4e7c7] ring-1 ring-white/10 hover:bg-white/5 transition"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M10 19l-7-7 7-7M3 12h18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Kembali ke beranda
              </Link>
            </div>

            <p className="mt-4 text-xs text-[#f4e7c7]/60">{hint}</p>
          </div>

          {/* Footer tipis */}
          <div className="h-9 flex items-center justify-between border-t border-[#d4af37]/15 px-4 text-[10px] text-[#f4e7c7]/60">
            <span>PUSH • Unauthorized</span>
            <span className="hidden sm:block">Kode: 401</span>
          </div>
        </div>
      </section>

      {/* Styles: batik yang lebih subtle */}
      <style jsx>{`
        .batik-kawung-lite {
          background: radial-gradient(
                circle at 25% 25%,
                rgba(212, 175, 55, 0.14) 1.6px,
                transparent 3px
              )
              0 0 / 48px 48px,
            radial-gradient(
                circle at 75% 25%,
                rgba(212, 175, 55, 0.14) 1.6px,
                transparent 3px
              )
              0 0 / 48px 48px,
            radial-gradient(
                circle at 25% 75%,
                rgba(212, 175, 55, 0.14) 1.6px,
                transparent 3px
              )
              0 0 / 48px 48px,
            radial-gradient(
                circle at 75% 75%,
                rgba(212, 175, 55, 0.14) 1.6px,
                transparent 3px
              )
              0 0 / 48px 48px;
        }
        .gold-sheen-lite {
          background: radial-gradient(
              60% 40% at 50% 0%,
              rgba(255, 218, 121, 0.15),
              transparent 60%
            ),
            radial-gradient(
              40% 30% at 80% 10%,
              rgba(212, 175, 55, 0.12),
              transparent 60%
            ),
            radial-gradient(
              40% 30% at 20% 10%,
              rgba(212, 175, 55, 0.1),
              transparent 60%
            );
        }
      `}</style>
    </main>
  );
}

function LockBadge() {
  return (
    <span
      className="inline-grid place-items-center h-10 w-10 rounded-xl
      bg-[#0f0b10]/70 ring-1 ring-[#d4af37]/25 text-[#d4af37]
      shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
      aria-hidden
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="14.5" r="1.3" fill="currentColor" />
      </svg>
    </span>
  );
}
