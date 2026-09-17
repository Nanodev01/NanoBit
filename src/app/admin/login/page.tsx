"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Credenciales inválidas");
      }
    } catch {
      setError("Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 selection:bg-cyan-500/30">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Adorno superior */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        <h1 className="text-2xl font-bold text-white mb-2 text-center">Acceso Restringido</h1>
        <p className="text-slate-400 text-sm text-center mb-8 font-mono">
          Por favor, ingrese sus credenciales de administrador.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded text-sm text-center font-mono">
              [ERROR] {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase">Identificación (Email)</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-md py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="admin@nanobit.me"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase">Clave de Seguridad (Password)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-md py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-md transition-all disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? "Verificando Credenciales..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-xs text-slate-600 font-mono">
        Solo personal autorizado. Conexión encriptada.
      </p>
    </div>
  );
}
