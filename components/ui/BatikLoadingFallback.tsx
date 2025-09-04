"use client";

import * as React from "react";

type Props = {
  title?: string;
  subtitle?: string;
  tips?: string[];
  /** Jika dikendalikan dari luar (0..100). Saat !done, tetap dicap di capWhenPending. */
  progress?: number;
  /** Tandai selesai untuk animasi ke 100%. Default false. */
  done?: boolean;
  /** Batas maksimum saat belum selesai. Default 90. */
  capWhenPending?: number;
  /** (Opsional) batas simulasi internal. Jika diisi > capWhenPending, akan diabaikan. */
  stopAt?: number;
  mode?: "overlay" | "standalone";
  className?: string;
};

const DEFAULT_TIPS = [
  "Klik ikon provinsi untuk melihat budaya setempat.",
  "Gunakan scroll untuk memperbesar peta dan jelajahi detail.",
  "Aktifkan musik latar untuk nuansa eksplorasi budaya.",
  "Geser peta untuk menelusuri wilayah lainnya.",
  "Buka sidebar untuk ringkasan budaya tiap provinsi.",
];

export default function BatikLoadingFallback({
  title = "Memuat Peta Budaya…",
  subtitle = "Menyiapkan motif, ikon provinsi, dan panel ringkasan",
  tips = DEFAULT_TIPS,
  progress,
  done = false,
  capWhenPending = 90,
  stopAt,
  mode = "overlay",
  className,
}: Props) {
  const [internalProgress, setInternalProgress] = React.useState(0);
  const [display, setDisplay] = React.useState(0);
  const [tipIndex, setTipIndex] = React.useState(0);

  // Target simulasi: tidak melebihi capWhenPending.
  const simTarget = Math.min(
    typeof stopAt === "number" ? stopAt : capWhenPending,
    capWhenPending
  );

  const isControlled = typeof progress === "number";

  // Simulasi bertahap (ketika tidak dikendalikan dari luar)
  React.useEffect(() => {
    if (isControlled || done) return;
    let frameId = 0;
    const tick = () => {
      setInternalProgress((p) => {
        // Hentikan simulasi jika sudah mencapai target
        if (p >= simTarget) {
          return p;
        }

        // Simulasikan kurva loading non-linear (slow start, fast middle, slow end)
        // Ini menciptakan kesan loading yang lebih alami
        const remaining = simTarget - p;
        const baseSpeed = 0.05; // Kecepatan dasar
        const progressFactor = Math.pow(p / simTarget, 2) * 0.5 + 0.5; // Kurva non-linear
        const step = baseSpeed * (1 + (1 - progressFactor) * 2);

        return Math.min(p + step, simTarget);
      });
      frameId = window.requestAnimationFrame(tick);
    };
    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isControlled, simTarget, done]);

  // Hitung nilai yang ditampilkan
  React.useEffect(() => {
    const raw = isControlled ? progress! : internalProgress;
    const capped = done ? raw : Math.min(raw, capWhenPending);
    setDisplay(capped);
  }, [isControlled, progress, internalProgress, capWhenPending, done]);

  // Saat done berubah true, animasikan smooth ke 100
  React.useEffect(() => {
    if (!done) return;
    let frameId = 0;
    const tick = () => {
      setDisplay((v) => {
        if (v >= 100) return 100;
        const remaining = 100 - v;
        const step = Math.max(0.8, remaining * 0.12);
        return Math.min(v + step, 100);
      });
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [done]);

  // Rotasi tips
  React.useEffect(() => {
    if (!tips.length) return;
    const id = window.setInterval(
      () => setTipIndex((i) => (i + 1) % tips.length),
      3600
    );
    return () => window.clearInterval(id);
  }, [tips]);

  const rounded = Math.round(display);

  return (
    <div
      role="status"
      aria-busy={true}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
      className={[
        mode === "overlay" ? "absolute inset-0" : "",
        "select-none",
        className ?? "",
      ].join(" ")}
    >
      {/* BACKDROP */}
      <div className="h-full w-full bg-gradient-to-b from-[#120f1a] via-[#1c1420] to-[#271a13] relative overflow-hidden">
        <div className="absolute inset-0 batik-kawung opacity-[0.22] mix-blend-soft-light" />
        <div className="absolute inset-0 songket-lines opacity-[0.12] mix-blend-overlay" />
        <div className="absolute inset-0 gold-sheen pointer-events-none" />
      </div>

      {/* ORNAMEN SUDUT */}
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      {/* KARTU */}
      <div className="absolute inset-0 grid place-items-center p-6">
        <div className="w-full max-w-[720px] rounded-2xl border border-[#d4af37]/30 bg-[#0f0b10]/70 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden ring-1 ring-[#8a6f2a]/20">
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-center gap-4">
              <MandalaSpinner />
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-semibold text-[#f4e7c7] tracking-wide">
                  {title}
                </h2>
                <p className="text-xs md:text-sm text-[#f4e7c7]/75 mt-0.5">
                  {subtitle}
                </p>
              </div>
              <div className="ml-auto hidden sm:flex items-center gap-2 text-[10px] text-[#f4e7c7]/70">
                <span className="h-2 w-2 rounded-full bg-[#d4af37] animate-ping" />
                <span>Sedang memuat</span>
              </div>
            </div>
          </div>

          <div className="px-6 pt-3 pb-6">
            <div className="flex items-center justify-between text-[11px] text-[#f4e7c7]/80 mb-1.5">
              <span>Kemajuan</span>
              <span>{rounded}%</span>
            </div>

            <div className="h-3.5 rounded-md bg-[#3a2b1b]/50 ring-1 ring-[#d4af37]/25 overflow-hidden relative">
              {/* kilau */}
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#d4af37]/35 via-[#ffda79]/25 to-transparent blur-md"
                style={{ width: `${display}%` }}
              />
              {/* isi */}
              <div
                className="h-full bg-gradient-to-r from-[#a67c00] via-[#d4af37] to-[#ffda79] transition-[width] duration-280 ease-out"
                style={{ width: `${display}%` }}
              />
              {/* stripes */}
              <div className="absolute inset-0 songket-stripes pointer-events-none opacity-50" />
            </div>

            {tips.length > 0 && (
              <div className="mt-4 p-3 rounded-md bg-[#0f0b10]/70 ring-1 ring-[#d4af37]/20">
                <p className="text-[11px] tracking-wider text-[#f4e7c7]/60 mb-1">
                  Tip
                </p>
                <p
                  key={tipIndex}
                  className="text-[#f4e7c7] text-sm animate-fade-in"
                >
                  {tips[tipIndex]}
                </p>
              </div>
            )}
          </div>

          <div className="h-8 bg-[#0b080b]/60 border-t border-[#d4af37]/20 flex items-center justify-between px-3 text-[10px] text-[#f4e7c7]/70">
            <span>v1.0 • Batik Loader</span>
            <span className="hidden sm:block">
              Tekan <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Esc</kbd>{" "}
              untuk batal (jika tersedia)
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .batik-kawung {
          background: radial-gradient(
                circle at 25% 25%,
                rgba(212, 175, 55, 0.18) 2px,
                transparent 3px
              )
              0 0/48px 48px,
            radial-gradient(
                circle at 75% 25%,
                rgba(212, 175, 55, 0.18) 2px,
                transparent 3px
              )
              0 0/48px 48px,
            radial-gradient(
                circle at 25% 75%,
                rgba(212, 175, 55, 0.18) 2px,
                transparent 3px
              )
              0 0/48px 48px,
            radial-gradient(
                circle at 75% 75%,
                rgba(212, 175, 55, 0.18) 2px,
                transparent 3px
              )
              0 0/48px 48px;
        }
        .songket-lines {
          background: repeating-linear-gradient(
              45deg,
              rgba(212, 175, 55, 0.12) 0,
              rgba(212, 175, 55, 0.12) 2px,
              transparent 2px,
              transparent 14px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(212, 175, 55, 0.07) 0,
              rgba(212, 175, 55, 0.07) 2px,
              transparent 2px,
              transparent 16px
            );
        }
        .songket-stripes {
          background: repeating-linear-gradient(
            45deg,
            rgba(255, 218, 121, 0.28) 0,
            rgba(255, 218, 121, 0.28) 8px,
            transparent 8px,
            transparent 16px
          );
          mix-blend-mode: overlay;
          animation: move 1.25s linear infinite;
        }
        .gold-sheen {
          background: radial-gradient(
              60% 45% at 50% 0%,
              rgba(255, 218, 121, 0.18),
              transparent 60%
            ),
            radial-gradient(
              40% 30% at 80% 10%,
              rgba(212, 175, 55, 0.15),
              transparent 60%
            ),
            radial-gradient(
              40% 30% at 20% 10%,
              rgba(212, 175, 55, 0.12),
              transparent 60%
            );
        }
        .animate-fade-in {
          animation: fade-in 400ms ease both;
        }
        @keyframes move {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 40px 0;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/* Spinner & Ornamen sama seperti sebelumnya */
function MandalaSpinner() {
  return (
    <div className="relative h-14 w-14">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 animate-spin-slower"
        aria-hidden
      >
        <defs>
          <radialGradient id="goldFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffebb5" />
            <stop offset="60%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#a67c00" />
          </radialGradient>
          <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffda79" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>
        </defs>
        {[...Array(8)].map((_, i) => {
          const rot = i * 45;
          return (
            <g key={i} transform={`rotate(${rot} 50 50)`}>
              <path
                d="M50 15 C56 22, 56 32, 50 39 C44 32, 44 22, 50 15 Z"
                fill="url(#goldFill)"
                opacity="0.9"
              />
              <path
                d="M50 15 C56 22, 56 32, 50 39 C44 32, 44 22, 50 15 Z"
                fill="none"
                stroke="url(#goldStroke)"
                strokeWidth="1.2"
                opacity="0.9"
              />
            </g>
          );
        })}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="url(#goldFill)"
          stroke="url(#goldStroke)"
          strokeWidth="1"
        />
        <circle
          cx="50"
          cy="50"
          r="18"
          fill="none"
          stroke="url(#goldStroke)"
          strokeWidth="1.2"
          strokeDasharray="6 6"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-5 w-5 rounded-full bg-[#ffda79] blur-[1px] shadow-[0_0_24px_rgba(212,175,55,0.55)]" />
      </div>
      <style jsx>{`
        .animate-spin-slower {
          animation: spin 6.5s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function CornerOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const base = "pointer-events-none opacity-40 md:opacity-35";
  const common = "absolute w-[140px] h-[140px] text-[#d4af37]";
  const pos =
    position === "tl"
      ? "top-0 left-0 translate-x-[-10%] translate-y-[-10%] rotate-0"
      : position === "tr"
      ? "top-0 right-0 translate-x-[10%] translate-y-[-10%] rotate-90"
      : position === "bl"
      ? "bottom-0 left-0 translate-x-[-10%] translate-y-[10%] -rotate-90"
      : "bottom-0 right-0 translate-x-[10%] translate-y-[10%] rotate-180";
  return (
    <svg
      className={`${base} ${common} ${pos}`}
      viewBox="0 0 200 200"
      aria-hidden
    >
      <path
        d="M20,160 C60,120 40,80 80,60 C110,45 130,55 150,40 C165,28 175,20 180,20
           M30,170 C70,130 50,90 90,70 C120,55 140,65 160,50
           M40,180 C80,140 60,100 100,80"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}
