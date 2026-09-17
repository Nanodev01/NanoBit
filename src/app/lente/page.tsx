import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Camera, ExternalLink } from "lucide-react";
import { galleryConfig } from "@/config/photos";
import { prisma } from "@/lib/prisma";
import { LenteGalleryClient } from "@/components/LenteGalleryClient";

export const revalidate = 60;

export default async function LentePage() {
  let dbPhotos: Array<{
    id: string;
    title: string;
    location: string | null;
    category: string;
    imageUrl: string;
    cameraInfo: string | null;
    date: string | null;
  }> = [];

  try {
    if (prisma && "photo" in prisma && typeof (prisma as any).photo?.findMany === "function") {
      dbPhotos = await prisma.photo.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (err) {
    console.warn("No se pudieron cargar fotos de la base de datos:", err);
  }

  return (
    <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-cyan-500/30">
      {/* HEADER */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center gap-4 text-sm font-mono">
            <Link
              href="/"
              className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> /volver
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* HERO INTRO */}
        <div className="mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Camera className="w-3.5 h-3.5" />
            <span>OFF_DUTY_OPTICS // PERSPECTIVA</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white font-mono tracking-tight">
            {galleryConfig.title}
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl">
            {galleryConfig.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={galleryConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors"
            >
              <span>Ver más en Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* DYNAMIC GALLERY CLIENT OR EMPTY STATE */}
        {dbPhotos.length > 0 ? (
          <LenteGalleryClient photos={dbPhotos} />
        ) : (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] space-y-3">
            <Camera className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 font-mono text-sm">
              Aún no hay capturas publicadas en la galería.
            </p>
            <p className="text-xs text-slate-600 font-mono">
              Las nuevas fotos se sincronizan desde el panel de control o vía Instagram.
            </p>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 text-center text-slate-600 text-sm font-mono mt-20">
        <p>
          nanobit.me • Capturas fotográficas de autor •{" "}
          <Link href="/" className="text-cyan-400 hover:underline">
            Volver al inicio
          </Link>
        </p>
      </footer>
    </div>
  );
}
