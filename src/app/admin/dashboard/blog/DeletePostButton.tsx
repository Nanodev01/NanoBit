"use client";

import { Trash2 } from "lucide-react";
import { deletePost } from "../../actions";
import { useTransition } from "react";

export function DeletePostButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("¿Estás seguro de eliminar esta publicación de la base de datos?")) {
      startTransition(() => {
        deletePost(id);
      });
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-md transition-colors border border-red-500/20 disabled:opacity-50"
      title="Eliminar Publicación"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
