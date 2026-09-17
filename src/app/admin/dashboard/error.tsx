"use client";
 
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
 
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error Boundary:", error);
  }, [error]);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h2 className="text-lg font-bold font-mono">Error al cargar el panel de administración</h2>
        </div>
        <p className="text-sm text-slate-300 font-mono">
          {error?.message || "Ocurrió un error inesperado al renderizar el dashboard."}
        </p>
        {error?.digest && (
          <p className="text-xs text-slate-500 font-mono">Digest: {error.digest}</p>
        )}
        <div className="pt-2 flex gap-3">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-lg text-xs font-mono transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Reintentar
          </button>
          <Link
            href="/admin/login"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-xs font-mono transition-colors"
          >
            Ir al Login
          </Link>
        </div>
      </div>
    </div>
  );
}
