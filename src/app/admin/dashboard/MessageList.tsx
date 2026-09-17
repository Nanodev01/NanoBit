"use client";

import { markMessageAsRead, deleteMessage } from "../actions";
import { Check, Trash2, Eye } from "lucide-react";
import { useState } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  content: string;
  read: boolean;
  createdAt: Date;
};

export function MessageList({ initialMessages }: { initialMessages: Message[] }) {
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  if (initialMessages.length === 0) {
    return <p className="text-slate-500">No hay mensajes en la bandeja de entrada.</p>;
  }

  return (
    <>
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/50 text-slate-400 font-mono">
            <tr>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Remitente</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {initialMessages.map(msg => (
              <tr key={msg.id} className={`transition-colors ${msg.read ? 'bg-transparent text-slate-500' : 'bg-white/[0.02] text-white font-medium'}`}>
                <td className="px-6 py-4">
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse"></span>}
                </td>
                <td className="px-6 py-4">{msg.name} <br/><span className="text-xs text-cyan-500">{msg.email}</span></td>
                <td className="px-6 py-4 text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => setSelectedMsg(msg)}
                    className="text-xs px-2 py-2 border border-white/20 rounded hover:bg-white/10 transition-colors inline-flex items-center"
                    title="Leer Mensaje"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {!msg.read && (
                    <button 
                      onClick={() => markMessageAsRead(msg.id)}
                      className="text-xs px-2 py-2 border border-emerald-500/50 text-emerald-400 rounded hover:bg-emerald-500/10 transition-colors inline-flex items-center"
                      title="Marcar como Leído"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if(confirm("¿Eliminar este mensaje permanentemente?")) {
                        deleteMessage(msg.id);
                      }
                    }}
                    className="text-xs px-2 py-2 border border-red-500/50 text-red-400 rounded hover:bg-red-500/10 transition-colors inline-flex items-center"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Lectura de Mensaje */}
      {selectedMsg && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-white mb-1">De: {selectedMsg.name}</h3>
            <p className="text-cyan-400 text-sm mb-4">{selectedMsg.email}</p>
            <div className="bg-white/5 p-4 rounded text-slate-300 whitespace-pre-wrap mb-6">
              {selectedMsg.content}
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  if(!selectedMsg.read) markMessageAsRead(selectedMsg.id);
                  setSelectedMsg(null);
                }}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
