"use client";

import { updatePost } from "@/app/admin/actions";
import { ArrowLeft, Save, Code, Upload, Link as LinkIcon, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  type: string;
  imageUrl: string | null;
  published: boolean;
}

export function EditPostForm({ post }: { post: PostData }) {
  const [loading, setLoading] = useState(false);
  const [mediaMode, setMediaMode] = useState<"keep" | "file" | "url">(post.imageUrl ? "keep" : "file");
  const [currentUrl, setCurrentUrl] = useState(post.imageUrl || "");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Si eligió conservar imagen actual, asegurar que el formData tenga el valor actual
    if (mediaMode === "keep" && post.imageUrl) {
      formData.set("imageUrl", post.imageUrl);
    }

    const res = await updatePost(formData);
    setLoading(false);
    if (res?.error) {
      alert(res.error);
      return;
    }
    router.push("/admin/dashboard/blog");
  }

  return (
    <main className="p-8 max-w-4xl">
      <header className="mb-10">
        <Link href="/admin/dashboard/blog" className="text-cyan-400 hover:underline flex items-center gap-2 mb-4 text-sm font-mono">
          <ArrowLeft className="w-4 h-4" /> Volver a Novedades
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Editar Publicación</h1>
        <p className="text-slate-500 font-mono text-sm">Modifica el título, contenido markdown o actualiza la imagen adjunta.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-xl space-y-6">
        <input type="hidden" name="id" value={post.id} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-xs font-mono text-slate-400">Título de la Publicación *</label>
            <input 
              type="text" 
              name="title"
              required
              defaultValue={post.title}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400">Tipo de Contenido *</label>
            <select 
              name="type"
              defaultValue={post.type}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 appearance-none text-sm font-mono cursor-pointer"
            >
              <option value="POST">Artículo / Post</option>
              <option value="CERTIFICADO">Certificado</option>
              <option value="LINKEDIN">Post de LinkedIn</option>
              <option value="NOTICIA">Noticia / Update</option>
            </select>
          </div>
        </div>

        {/* MÉTODO DE ADJUNTAR IMAGEN / CERTIFICADO */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5 font-bold">
                <ImageIcon className="w-4 h-4 text-cyan-400" /> Imagen / Certificado / Media (Opcional)
              </label>
              <p className="text-[11px] text-slate-500 font-mono">
                Puedes mantener la imagen actual, subir una nueva o cambiar la URL.
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-black/50 border border-white/10 rounded-lg">
              {post.imageUrl && (
                <button
                  type="button"
                  onClick={() => setMediaMode("keep")}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                    mediaMode === "keep" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" /> Actual
                </button>
              )}
              <button
                type="button"
                onClick={() => setMediaMode("file")}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                  mediaMode === "file" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <Upload className="w-3 h-3" /> Subir Nueva
              </button>
              <button
                type="button"
                onClick={() => setMediaMode("url")}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1 ${
                  mediaMode === "url" ? "bg-cyan-500 text-black font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <LinkIcon className="w-3 h-3" /> Cambiar URL
              </button>
            </div>
          </div>

          {mediaMode === "keep" && post.imageUrl && (
            <div className="flex items-center gap-4 p-3 bg-black/40 border border-white/10 rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-20 h-16 object-cover rounded-lg border border-white/10"
              />
              <div>
                <p className="text-xs text-slate-300 font-mono truncate max-w-sm">
                  {post.imageUrl}
                </p>
                <span className="text-[10px] text-emerald-400 font-mono">
                  ✓ Imagen actual conservada
                </span>
              </div>
            </div>
          )}

          {mediaMode === "file" && (
            <div className="p-4 border-2 border-dashed border-white/10 hover:border-cyan-500/40 rounded-xl bg-black/30 transition-colors">
              <input
                type="file"
                name="file"
                accept="image/*"
                className="w-full text-xs font-mono text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-cyan-500/10 file:text-cyan-400 file:cursor-pointer hover:file:bg-cyan-500/20"
              />
              <p className="text-[11px] text-slate-500 font-mono mt-2">
                Formatos: JPG, PNG, WEBP, GIF. Reemplazará la imagen anterior.
              </p>
            </div>
          )}

          {mediaMode === "url" && (
            <input 
              type="url" 
              name="imageUrl"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              placeholder="https://... o enlace externo"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
            />
          )}
        </div>

        {/* CONTENIDO MARKDOWN */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-slate-400">Cuerpo del Mensaje (Markdown) *</label>
            <div className="flex items-center gap-1 text-xs text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/10 font-mono">
              <Code className="w-3 h-3 text-cyan-400" /> MD Compatible
            </div>
          </div>
          <textarea 
            name="content"
            required
            defaultValue={post.content}
            rows={14}
            className="w-full bg-black/80 font-mono text-sm border border-white/10 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-cyan-500 resize-y"
          />
        </div>

        {/* PUBLICAR */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <input 
            type="checkbox" 
            id="published" 
            name="published" 
            defaultChecked={post.published}
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
