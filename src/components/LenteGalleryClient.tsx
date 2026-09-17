"use client";

import { useState } from "react";
import { Compass, MapPin } from "lucide-react";
import { ImageLightbox } from "@/components/ImageLightbox";

export interface PhotoDisplayItem {
  id: string;
  title: string;
  location?: string | null;
  category: string;
  imageUrl: string;
  cameraInfo?: string | null;
  date?: string | null;
}

export function LenteGalleryClient({ photos }: { photos: PhotoDisplayItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  // Extraer categorías únicas dinámicas a partir de las fotos
  const uniqueCategories = Array.from(new Set(photos.map((p) => p.category)));
  const categories = ["Todos", ...uniqueCategories];

  const filteredPhotos =
    selectedCategory === "Todos"
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  return (
    <div>
      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-white/10 font-mono text-xs">
        <span className="text-slate-500 mr-2 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5" /> Filtro:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedCategory === cat
                ? "bg-cyan-500 text-black font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MASONRY / CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="flex flex-col bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300 group"
          >
            {/* Lightbox Visual Component */}
            <ImageLightbox
              src={photo.imageUrl}
              alt={photo.title}
              title={photo.title}
              badge={photo.category}
              date={photo.date || undefined}
            />

            {/* Photo metadata */}
            <div className="p-4 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 text-slate-300 truncate mr-2">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  {photo.location || "Ubicación desconocida"}
                </span>
                {photo.date && (
                  <span className="text-slate-600 shrink-0">[{photo.date}]</span>
                )}
              </div>
              {photo.cameraInfo && (
                <p className="text-slate-500 text-[11px] truncate">
                  ⚙ {photo.cameraInfo}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
