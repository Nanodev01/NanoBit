"use client";

import { createPost } from "../../../actions";
import { ArrowLeft, Save, Code } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await createPost(formData);
    setLoading(false);
    router.push("/admin/dashboard/blog");
  }

  return (
    <main className="p-8 max-w-4xl">
      <header className="mb-10">
        <Link href="/admin/dashboard/blog" className="text-cyan-400 hover:underline flex items-center gap-2 mb-4 text-sm font-mono">
          <ArrowLeft className="w-4 h-4" /> Volver a Novedades
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Nueva Publicación</h1>
        <p className="text-slate-500 font-mono text-sm">Redacta el contenido. Soporta formato Markdown (**, #, [], ```).</p>
      </header>

      <form action={handleSubmit} className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-mono text-slate-400">Título de la Publicación</label>
            <input 
              type="text" 
              name="title"
              required
              placeholder="Ej: Análisis de Malware en Python"
              className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-mono text-slate-400">Tipo de Contenido</label>
            <select 
              name="type"
              className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyan-500 appearance-none"
            >
              <option value="POST">Artículo / Post</option>
              <option value="CERTIFICADO">Certificado</option>
              <option value="LINKEDIN">Post de LinkedIn</option>
              <option value="NOTICIA">Noticia / Update</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-400">URL de Imagen / Certificado (Opcional)</label>
          <input 
            type="url" 
            name="imageUrl"
            placeholder="https://... o /certificados/diploma.png (activa el visor lightbox)"
            className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyan-500"
          />
          <p className="text-xs text-slate-500 font-mono">
            Si el tipo es CERTIFICADO, esta imagen se mostrará con visor interactivo a pantalla completa.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-mono text-slate-400">Cuerpo del Mensaje (Markdown)</label>
            <div className="flex items-center gap-1 text-xs text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/10">
              <Code className="w-3 h-3" /> MD Compatible
            </div>
          </div>
          <textarea 
            name="content"
            required
            rows={15}
            placeholder="# Introducción&#10;&#10;Escribe tu post utilizando markdown...&#10;&#10;```javascript&#10;console.log('Hola Mundo');&#10;```"
            className="w-full bg-black/80 font-mono text-sm border border-white/10 rounded p-4 text-slate-300 focus:outline-none focus:border-cyan-500 resize-y"
          />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <input 
            type="checkbox" 
            id="published" 
            name="published" 
            defaultChecked
            className="w-4 h-4 bg-black border-white/10 text-cyan-500 rounded focus:ring-cyan-500"
          />
          <label htmlFor="published" className="text-sm text-white cursor-pointer">
            Publicar inmediatamente
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-3 rounded font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? "Procesando..." : <><Save className="w-5 h-5" /> Guardar Publicación</>}
          </button>
        </div>
      </form>
    </main>
  );
}
