"use client";

import * as React from "react";

type Props = {
  src: string;
  title: string;
  className?: string;
  fallback?: React.ReactNode;
  timeoutMs?: number;
  allow?: string;
  sandbox?: string;
  referrerPolicy?: React.IframeHTMLAttributes<HTMLIFrameElement>["referrerPolicy"];
  allowFullScreen?: boolean;
};

export default function SmartIframe({
  src,
  title,
  className,
  fallback,
  timeoutMs = 3500,
  allow,
  sandbox,
  referrerPolicy = "no-referrer",
  allowFullScreen,
}: Props) {
  const [loaded, setLoaded] = React.useState(false);
  const [slow, setSlow] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);

  React.useEffect(() => {
    if (loaded) return;
    const id = window.setTimeout(() => setSlow(true), timeoutMs);
    return () => window.clearTimeout(id);
  }, [loaded, timeoutMs]);

  const DefaultFallback = (
    <div className="absolute inset-0 grid place-items-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 text-neutral-200">
        <div className="h-10 w-10 rounded-full border-2 border-neutral-500 border-t-white animate-spin" />
        <p className="text-sm opacity-80">Memuat konten…</p>
        {slow && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setReloadKey((k) => k + 1);
                setLoaded(false);
                setSlow(false);
              }}
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-xs"
            >
              Muat ulang
            </button>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-xs"
            >
              Buka di tab baru
            </a>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`relative ${className ?? ""}`} aria-busy={!loaded}>
      {!loaded && (fallback ?? DefaultFallback)}

      <iframe
        key={reloadKey}
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        allow={allow}
        sandbox={sandbox}
        referrerPolicy={referrerPolicy}
        allowFullScreen={allowFullScreen}
      />
    </div>
  );
}
