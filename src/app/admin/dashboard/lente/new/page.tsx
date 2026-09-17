"use client";

import { createPhoto } from "../../../actions";
import { ArrowLeft, Save, Upload, Link as LinkIcon, Camera } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPhotoPage() {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Paisaje");
  const [mode, setMode] = useState<"file" | "url">("file");
  const router = useRouter();

  const presets = ["Paisaje", "Urbano", "Naturaleza", "Noche", "Arquitectura", "Viajes"];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createPhoto(formData);
    setLoading(false);
    if (res?.error) {
      alert(res.error);
      return;
    }
    router.push("/admin/dashboard/lente");
  }

  return (
    <main className="p-8 max-w-3xl">
      <header className="mb-10">
        <Link
          href="/admin/dashboard/lente"
          className="text-cyan-400 hover:underline flex items-center gap-2 mb-4 text-sm font-mono"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Galería
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Camera className="w-7 h-7 text-cyan-400" /> Nueva Fotografía
        </h1>
        <p className="text-slate-500 font-mono text-sm">
          Sube una captura desde tu computadora o vincula una URL externa.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-xl space-y-6"
      >
        {/* TÍTULO */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400">
            Título de la Fotografía *
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="Ej: Cumbre Andina al Atardecer"
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
          />
        </div>

        {/* MÉTODO DE CARGA DE IMAGEN */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-400 block">
            Origen de la Imagen *
          </label>
          
          <div className="flex items-center gap-2 p-1 bg-black/50 border border-white/10 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setMode("file")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                mode === "file"
                  ? "bg-cyan-500 text-black font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Subir Archivo (PC)
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                mode === "url"
                  ? "bg-cyan-500 text-black font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> Pegar URL Externa
            </button>
          </div>

          {mode === "file" ? (
            <div className="p-4 border-2 border-dashed border-white/10 hover:border-cyan-500/40 rounded-xl bg-black/30 transition-colors">
              <input
                type="file"
                name="file"
                accept="image/*"
                className="w-full text-xs font-mono text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-cyan-500/10 file:text-cyan-400 file:cursor-pointer hover:file:bg-cyan-500/20"
              />
              <p className="text-[11px] text-slate-500 font-mono mt-2">
                Formatos: JPG, PNG, WEBP. Se guardará automáticamente en el almacenamiento local.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <input
                type="url"
                name="imageUrl"
                placeholder="https://images.unsplash.com/... o enlace de tu CDN"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                Pega el enlace directo a la imagen.
              </p>
            </div>
          )}
        </div>

        {/* CATEGORÍA / TAG */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400">
            Categoría / Tag *
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCategory(p)}
                className={`text-xs font-mono px-2.5 py-1 rounded-md border transition-colors ${
                  category === p
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <input
            type="text"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            placeholder="Escribe un tag o elige uno arriba"
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
          />
        </div>

        {/* METADATOS: UBICACIÓN, CÁMARA, FECHA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Ubicación</label>
            <input
              type="text"
              name="location"
              placeholder="Ej: Ushuaia, Argentina"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Parámetros de Cámara</label>
            <input
              type="text"
              name="cameraInfo"
              placeholder="Ej: 24mm • f/4 • 1/125s"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Fecha / Año</label>
            <input
              type="text"
              name="date"
              placeholder="Ej: 2025"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* PUBLICAR */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <input
            type="checkbox"
            id="published"
            name="published"
            defaultChecked
            className="w-4 h-4 bg-black border-white/10 text-cyan-500 rounded focus:ring-cyan-500 cursor-pointer"
          />
          <label htmlFor="published" className="text-sm text-white cursor-pointer font-mono">
            Publicar inmediatamente en /lente
          </label>
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-3 rounded-lg font-bold font-mono text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? "Subiendo fotografía..." : <><Save className="w-4 h-4" /> Guardar Fotografía</>}
          </button>
        </div>
      </form>
    </main>
  );
}
