"use client";

import { updateProject } from "@/app/admin/actions";
import { ArrowLeft, Save, Upload, Link as LinkIcon, Sparkles, FolderGit2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { safeParseTags } from "@/lib/utils";

interface ProjectData {
  id: string;
  title: string;
  description: string;
  url: string | null;
  repoUrl: string | null;
  imageUrl: string | null;
  gifUrl?: string | null;
  tags: string;
  published: boolean;
}

export function EditProjectForm({ project }: { project: ProjectData }) {
  const [loading, setLoading] = useState(false);
  const [coverMode, setCoverMode] = useState<"keep" | "file" | "url">(project.imageUrl ? "keep" : "file");
  const [coverUrl, setCoverUrl] = useState(project.imageUrl || "");
  const [gifMode, setGifMode] = useState<"keep" | "file" | "url">(project.gifUrl ? "keep" : "file");
  const [gifUrl, setGifUrl] = useState(project.gifUrl || "");
  const [demoUrl, setDemoUrl] = useState(project.url || "");
  const router = useRouter();

  const formattedTags = safeParseTags(project.tags).join(", ");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    if (coverMode === "keep" && project.imageUrl) {
      formData.set("imageUrl", project.imageUrl);
    }
    if (gifMode === "keep" && project.gifUrl) {
      formData.set("gifUrl", project.gifUrl);
    }

    const res = await updateProject(formData);
    setLoading(false);
    if (res?.error) {
      alert(res.error);
      return;
    }
    router.push("/admin/dashboard/projects");
  }

  return (
    <main className="p-8 max-w-3xl">
      <header className="mb-10">
        <Link
          href="/admin/dashboard/projects"
          className="text-cyan-400 hover:underline flex items-center gap-2 mb-4 text-sm font-mono"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FolderGit2 className="w-7 h-7 text-cyan-400" /> Editar Proyecto
        </h1>
        <p className="text-slate-500 font-mono text-sm">
          Actualiza los detalles, enlaces, imagen de portada o el GIF interactivo.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-xl space-y-6">
        <input type="hidden" name="id" value={project.id} />

        {/* TÍTULO */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400">Título del Proyecto *</label>
          <input 
            type="text" 
            name="title"
            required
            defaultValue={project.title}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
          />
        </div>

        {/* DESCRIPCIÓN */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400">Descripción (Payload) *</label>
          <textarea 
            name="description"
            required
            rows={4}
            defaultValue={project.description}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 resize-none text-sm"
          />
        </div>

        {/* URLS DEMO Y REPO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400">URL Demo (Opcional)</label>
            <input 
              type="url" 
              name="url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://app.nanobit.me"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
            />
            {demoUrl && (
              <p className="text-[11px] text-cyan-400/80 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-preview: si no hay imagen de portada, se generará una captura en vivo de este link.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400">URL Repositorio (Opcional)</label>
            <input 
              type="url" 
              name="repoUrl"
              defaultValue={project.repoUrl || ""}
              placeholder="https://github.com/nanodev/..."
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
            />
          </div>
        </div>

        {/* IMAGEN DE PORTADA */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-cyan-400" /> Imagen de Portada (Opcional)
            </label>
            <div className="flex items-center gap-1 p-1 bg-black/50 border border-white/10 rounded-lg">
              {project.imageUrl && (
                <button
                  type="button"
                  onClick={() => setCoverMode("keep")}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                    coverMode === "keep" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" /> Actual
                </button>
              )}
              <button
                type="button"
                onClick={() => setCoverMode("file")}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                  coverMode === "file" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <Upload className="w-3 h-3" /> Subir Nueva
              </button>
              <button
                type="button"
                onClick={() => setCoverMode("url")}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                  coverMode === "url" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <LinkIcon className="w-3 h-3" /> Cambiar URL
              </button>
            </div>
          </div>

          {coverMode === "keep" && project.imageUrl && (
            <div className="flex items-center gap-4 p-3 bg-black/40 border border-white/10 rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-20 h-16 object-cover rounded-lg border border-white/10"
              />
              <div>
                <p className="text-xs text-slate-300 font-mono truncate max-w-sm">
                  {project.imageUrl}
                </p>
                <span className="text-[10px] text-emerald-400 font-mono">
                  ✓ Portada actual conservada
                </span>
              </div>
            </div>
          )}

          {coverMode === "file" && (
            <div className="p-4 border-2 border-dashed border-white/10 hover:border-cyan-500/40 rounded-xl bg-black/30 transition-colors">
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                className="w-full text-xs font-mono text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-cyan-500/10 file:text-cyan-400 file:cursor-pointer hover:file:bg-cyan-500/20"
              />
              <p className="text-[11px] text-slate-500 font-mono mt-2">
                Formatos: JPG, PNG, WEBP, GIF. Reemplazará la portada actual.
              </p>
            </div>
          )}

          {coverMode === "url" && (
            <input 
              type="url" 
              name="imageUrl"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://... o enlace a tu CDN"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
            />
          )}
        </div>

        {/* GIF ANIMADO EN HOVER */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" /> GIF Demo en Hover (Opcional)
              </label>
              <p className="text-[11px] text-slate-500 font-mono">
                Se reproducirá al pasar el cursor sobre la tarjeta en el portfolio.
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-black/50 border border-white/10 rounded-lg">
              {project.gifUrl && (
                <button
                  type="button"
                  onClick={() => setGifMode("keep")}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                    gifMode === "keep" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" /> Actual
                </button>
              )}
              <button
                type="button"
                onClick={() => setGifMode("file")}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                  gifMode === "file" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <Upload className="w-3 h-3" /> Subir Nuevo
              </button>
              <button
                type="button"
                onClick={() => setGifMode("url")}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                  gifMode === "url" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <LinkIcon className="w-3 h-3" /> Cambiar URL
              </button>
            </div>
          </div>

          {gifMode === "keep" && project.gifUrl && (
            <div className="flex items-center gap-4 p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.gifUrl}
                alt="GIF actual"
                className="w-20 h-16 object-cover rounded-lg border border-cyan-500/30"
              />
              <div>
                <p className="text-xs text-slate-300 font-mono truncate max-w-sm">
                  {project.gifUrl}
                </p>
                <span className="text-[10px] text-cyan-400 font-mono">
                  ✓ GIF actual conservado
                </span>
              </div>
            </div>
          )}

          {gifMode === "file" && (
            <div className="p-4 border-2 border-dashed border-cyan-500/20 hover:border-cyan-500/50 rounded-xl bg-cyan-950/10 transition-colors">
              <input
                type="file"
                name="gifFile"
                accept="image/gif"
                className="w-full text-xs font-mono text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-cyan-500/20 file:text-cyan-300 file:cursor-pointer hover:file:bg-cyan-500/30"
              />
              <p className="text-[11px] text-slate-500 font-mono mt-2">
                Sube una captura en formato .GIF de tu aplicación en funcionamiento.
              </p>
            </div>
          )}

          {gifMode === "url" && (
            <input 
              type="url" 
              name="gifUrl"
              value={gifUrl}
              onChange={(e) => setGifUrl(e.target.value)}
              placeholder="https://media.giphy.com/... o enlace a tu .gif"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
            />
          )}
        </div>

        {/* TAGS */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="text-xs font-mono text-slate-400">Tags (Separados por comas) *</label>
          <input 
            type="text" 
            name="tags"
            required
            defaultValue={formattedTags}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
          />
        </div>

        {/* PUBLICAR */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <input 
            type="checkbox" 
            id="published" 
            name="published" 
            defaultChecked={project.published}
            className="w-4 h-4 bg-black border-white/10 text-cyan-500 rounded focus:ring-cyan-500 cursor-pointer"
          />
          <label htmlFor="published" className="text-sm text-white cursor-pointer font-mono">
            Publicado (Visible en el portfolio principal)
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-3 rounded-lg font-bold font-mono text-sm flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Guardando cambios..." : <><Save className="w-4 h-4" /> Guardar Cambios</>}
          </button>
        </div>
      </form>
    </main>
  );
}
