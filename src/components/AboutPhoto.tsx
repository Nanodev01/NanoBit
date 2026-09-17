"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Terminal } from "lucide-react";

interface AboutPhotoProps {
  imageSrc?: string;
  alt?: string;
}

export function AboutPhoto({
  imageSrc,
  alt = "Nanodev - Software Programmer & Cybersecurity",
}: AboutPhotoProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center group">
      {/* Background Cyber Glow (Radial Gradient) */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/20 via-emerald-500/20 to-transparent rounded-2xl blur-xl opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none" />

      {/* Cyber Frame Container */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-black/60 border border-white/10 group-hover:border-cyan-500/40 transition-colors flex items-center justify-center">
        {/* Decorative corner markers */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/70" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/70" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/70" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/70" />

        {imageSrc && !imgError ? (
          <Image
            src={imageSrc}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-contain object-bottom p-4 drop-shadow-[0_10px_20px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            priority
          />
        ) : (
          /* Stylized Cyber Placeholder if /me.png hasn't been added yet */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="relative p-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Terminal className="w-12 h-12 animate-pulse" />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-black border border-emerald-400 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-white font-mono text-sm font-semibold tracking-wider uppercase">
                Nanodev
              </p>
              <p className="text-xs font-mono text-cyan-400/80 tracking-widest">
                // SYSTEM_OPERATOR
              </p>
            </div>
          </div>
        )}

        {/* Live Status Scanline Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent pointer-events-none opacity-50" />
      </div>

      {/* Cyber Badge underneath */}
      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>SEC_CLEARANCE: LEVEL_4</span>
      </div>
    </div>
  );
}
