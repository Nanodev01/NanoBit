"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      content: formData.get("content"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-cyan-500/30 bg-cyan-500/5 rounded-lg text-center space-y-4">
        <CheckCircle className="w-12 h-12 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">Handshake Exitoso</h3>
        <p className="text-slate-400">He recibido tu mensaje en mi base de datos de forma segura. Te contactaré pronto.</p>
        <button onClick={() => setStatus("idle")} className="text-cyan-400 text-sm hover:underline mt-4">
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-black/50 p-8 rounded-lg border border-white/10 text-left">
      {status === "error" && (
        <div className="flex items-center gap-2 p-4 border border-red-500/50 bg-red-500/10 text-red-400 rounded">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Ocurrió un error de conexión al enviar el mensaje. Intenta nuevamente.</span>
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-mono text-slate-400 block">01. Nombre</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required 
          className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          placeholder="Tu nombre o alias"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-mono text-slate-400 block">02. Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
          className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          placeholder="tu@email.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-mono text-slate-400 block">03. Payload (Mensaje)</label>
        <textarea 
          id="content" 
          name="content" 
          required 
          rows={5}
          className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
          placeholder="Describe tu proyecto o consulta..."
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="animate-pulse">Transmitiendo...</span>
        ) : (
          <>
            Transmitir Datos <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
