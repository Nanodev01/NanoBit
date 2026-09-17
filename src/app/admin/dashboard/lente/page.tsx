import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Camera, Plus, MapPin, Tag, Calendar, ExternalLink } from "lucide-react";
import { DeletePhotoButton } from "./DeletePhotoButton";

export default async function AdminLentePage() {
  let photos: Array<{
    id: string;
    title: string;
    location: string | null;
    category: string;
    imageUrl: string;
    cameraInfo: string | null;
    date: string | null;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  try {
    if (prisma && "photo" in prisma && typeof (prisma as any).photo?.findMany === "function") {
      photos = await prisma.photo.findMany({
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (err) {
    console.warn("No se pudieron cargar las fotos en admin:", err);
  }

  return (
    <main className="p-8 max-w-6xl">
      <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Camera className="w-8 h-8 text-cyan-400" /> Galería /lente
          </h1>
          <p className="text-slate-500 font-mono text-sm">
            Administra las capturas fotográficas de tu portfolio off-duty.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/lente"
            target="_blank"
            className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-lg font-mono text-sm border border-white/10 flex items-center gap-2 transition-colors"
          >
            <span>Ver Galería Pública</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
          <Link
            href="/admin/dashboard/lente/new"
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg font-bold font-mono text-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> Nueva Foto
          </Link>
        </div>
      </header>

      {photos.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/20 rounded-xl bg-white/[0.01]">
          <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-mono mb-2">
            No hay fotografías registradas en la base de datos.
          </p>
          <p className="text-xs text-slate-600 font-mono mb-6">
            (La vista pública de /lente está mostrando muestras temporales)
          </p>
          <Link
            href="/admin/dashboard/lente/new"
            className="text-cyan-400 hover:underline font-mono text-sm"
          >
            + Subir tu primera fotografía
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group relative hover:border-cyan-500/40 transition-colors flex flex-col"
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/10] bg-black/60 overflow-hidden">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  <DeletePhotoButton id={photo.id} />
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="text-[10px] font-mono uppercase bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-cyan-400 border border-white/10 flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />
                    {photo.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {photo.title}
                  </h3>
                  {photo.location && (
                    <p className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {photo.location}
                    </p>
                  )}
                  {photo.cameraInfo && (
                    <p className="text-[11px] font-mono text-slate-500 mt-1 truncate">
                      ⚙ {photo.cameraInfo}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {photo.date || new Date(photo.createdAt).getFullYear()}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      photo.published
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}
                  >
                    {photo.published ? "Publicada" : "Borrador"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
