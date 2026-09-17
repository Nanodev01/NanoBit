"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Maximize2, X, ZoomIn, ZoomOut, Award, ExternalLink } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  title?: string;
  badge?: string;
  date?: string;
}

export function ImageLightbox({
  src,
  alt,
  title,
  badge = "CERTIFICADO",
  date,
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        setScale(1);
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.3, 2.5));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.3, 0.7));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
  };

  return (
    <>
      {/* Thumbnail Card trigger */}
      <div
        onClick={() => setIsOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-black/60 hover:border-cyan-500/50 transition-all duration-300 shadow-xl"
      >
        {/* Top bar with badge */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Award className="w-3.5 h-3.5" />
            {badge}
          </span>
          {date && <span className="text-slate-500">{date}</span>}
          <span className="text-slate-400 group-hover:text-cyan-300 flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" /> Ampliar
          </span>
        </div>

        {/* Image Preview */}
        <div className="relative w-full aspect-video md:aspect-[16/10] bg-black/80 flex items-center justify-center overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          />
          {/* Cyber Scan Hover Overlay */}
          <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="p-3 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Maximize2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {title && (
          <div className="p-3 bg-white/[0.02] border-t border-white/5">
            <p className="text-sm font-medium text-white truncate">{title}</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
            setScale(1);
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Top Controls Toolbar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-10 font-mono"
          >
            <div className="text-left">
              <span className="text-xs text-cyan-400 uppercase tracking-widest block">
                // VISOR_DE_ALTA_RESOLUCIÓN
              </span>
              <h3 className="text-sm sm:text-base font-semibold text-white truncate max-w-xs sm:max-w-md">
                {title || alt}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomIn}
                title="Acercar (+)"
                className="p-2 rounded-lg bg-white/10 hover:bg-cyan-500/20 text-white hover:text-cyan-300 border border-white/10 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                title="Alejar (-)"
                className="p-2 rounded-lg bg-white/10 hover:bg-cyan-500/20 text-white hover:text-cyan-300 border border-white/10 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                title="Reset zoom"
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-slate-300 border border-white/10 transition-colors"
              >
                100%
              </button>
              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                title="Abrir imagen en pestaña nueva"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setScale(1);
                }}
                title="Cerrar (Esc)"
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scalable Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
            style={{ transform: `scale(${scale})` }}
          >
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Bottom Escape hint */}
          <div className="absolute bottom-4 text-xs font-mono text-slate-500 pointer-events-none">
            Presiona <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">Esc</kbd> o haz clic afuera para cerrar
          </div>
        </div>
      )}
    </>
  );
}
