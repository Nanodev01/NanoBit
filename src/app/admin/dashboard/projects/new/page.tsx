"use client";

import { createProject } from "../../../actions";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await createProject(formData);
    setLoading(false);
    router.push("/admin/dashboard/projects");
  }

  return (
    <main className="p-8 max-w-3xl">
      <header className="mb-10">
        <Link href="/admin/dashboard/projects" className="text-cyan-400 hover:underline flex items-center gap-2 mb-4 text-sm font-mono">
          <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Nuevo Proyecto</h1>
        <p className="text-slate-500 font-mono text-sm">Registra una nueva aplicación en el portfolio.</p>
      </header>

      <form action={handleSubmit} className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-400">Título del Proyecto</label>
          <input 
            type="text" 
            name="title"
            required
            placeholder="Ej: SecureChat API"
            className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-400">Descripción (Payload)</label>
          <textarea 
            name="description"
            required
            rows={4}
            placeholder="Describe la arquitectura y funcionalidades..."
            className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-mono text-slate-400">URL Demo (Opcional)</label>
            <input 
              type="url" 
              name="url"
              placeholder="https://app.nanobit.me"
              className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-mono text-slate-400">URL Repositorio (Opcional)</label>
            <input 
              type="url" 
              name="repoUrl"
              placeholder="https://github.com/nanodev/..."
              className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-400">Tags (Separados por comas)</label>
          <input 
            type="text" 
            name="tags"
            required
            placeholder="React, Next.js, PostgreSQL, TailwindCSS"
            className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyan-500"
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
            Publicar inmediatamente (Visible en la página principal)
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-3 rounded font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? "Procesando..." : <><Save className="w-5 h-5" /> Guardar Proyecto</>}
          </button>
        </div>
      </form>
    </main>
  );
}
