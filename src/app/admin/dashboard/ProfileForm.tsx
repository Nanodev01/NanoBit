"use client";

import { useState } from "react";
import { updateProfile } from "../actions";
import { Save, CheckCircle2, User, Globe, Mail, MessageSquare, Code2, Share2 } from "lucide-react";

interface ProfileData {
  title?: string | null;
  description?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  discordUrl?: string | null;
  email?: string | null;
}

export function ProfileForm({ initialProfile }: { initialProfile?: ProfileData | null }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSuccess(false);
    await updateProfile(formData);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
  }

  return (
    <form action={handleSubmit} className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-3 text-emerald-400 text-sm font-mono bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <CheckCircle2 className="w-4 h-4" />
          <span>[OK] Perfil y enlaces de redes sociales actualizados en tiempo real.</span>
        </div>
      )}

      {/* Título & Rol */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" /> TÍTULO_PROFESIONAL
        </label>
        <input 
          type="text"
          name="title"
          defaultValue={initialProfile?.title || "Software Programmer & Cybersecurity"}
          placeholder="Ej: Software Programmer & Cybersecurity"
          className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none font-mono text-sm"
        />
      </div>

      {/* Descripción / Bio */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" /> BIOGRAFÍA_SOBRE_MÍ
        </label>
        <textarea 
          name="description"
          required
          defaultValue={initialProfile?.description || ""}
          placeholder="Describe tu perfil, objetivos y experiencia..."
          className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-slate-300 focus:border-cyan-500 focus:outline-none h-32 resize-y font-sans text-sm leading-relaxed"
        />
      </div>

      {/* ENLACES DE REDES SOCIALES */}
      <div className="pt-4 border-t border-white/10 space-y-4">
        <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
          <span>// ENLACES_DE_REDES_SOCIALES</span>
        </h3>
        <p className="text-xs text-slate-500 font-mono">
          Configura tus enlaces directos. Estos actualizarán automáticamente los botones en el Hero, Navbar y Footer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Perfil de GitHub
            </label>
            <input 
              type="url"
              name="githubUrl"
              defaultValue={initialProfile?.githubUrl || "https://github.com/Nanodev01"}
              placeholder="https://github.com/tu-usuario"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-cyan-400" /> Perfil de LinkedIn
            </label>
            <input 
              type="url"
              name="linkedinUrl"
              defaultValue={initialProfile?.linkedinUrl || "https://www.linkedin.com"}
              placeholder="https://linkedin.com/in/tu-usuario"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Servidor o Enlace de Discord
            </label>
            <input 
              type="text"
              name="discordUrl"
              defaultValue={initialProfile?.discordUrl || "https://discord.com"}
              placeholder="https://discord.gg/... o tu handle"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" /> Correo de Contacto
            </label>
            <input 
              type="email"
              name="email"
              defaultValue={initialProfile?.email || "contacto@nanobit.me"}
              placeholder="contacto@tudominio.me"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50 text-sm font-mono"
        >
          {loading ? "Guardando cambios..." : <><Save className="w-4 h-4" /> Guardar Configuración</>}
        </button>
      </div>
    </form>
  );
}
