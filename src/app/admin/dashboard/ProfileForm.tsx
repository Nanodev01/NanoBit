"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "../actions";

export function ProfileForm({ initialDescription }: { initialDescription: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSuccess(false);
    await updateProfile(formData);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <form action={handleSubmit} className="bg-white/5 border border-white/10 p-6 rounded-lg">
      {success && (
        <div className="mb-4 text-emerald-400 text-sm font-mono bg-emerald-500/10 border border-emerald-500/20 p-2 rounded">
          [OK] Perfil actualizado y revalidado en caché.
        </div>
      )}
      <textarea 
        name="description"
        required
        className="w-full bg-black/50 border border-white/10 rounded p-4 text-slate-300 focus:border-cyan-500 focus:outline-none h-32 resize-none"
        defaultValue={initialDescription}
      />
      <div className="mt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded font-bold transition-colors disabled:opacity-50"
        >
          {loading ? "Actualizando..." : "Actualizar Perfil"}
        </button>
      </div>
    </form>
  );
}
