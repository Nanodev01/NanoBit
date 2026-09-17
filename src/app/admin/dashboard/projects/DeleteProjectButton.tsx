"use client";

import { Trash2 } from "lucide-react";
import { deleteProject } from "../../actions";
import { useTransition } from "react";

export function DeleteProjectButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("¿Estás seguro de eliminar este proyecto de la base de datos?")) {
      startTransition(() => {
        deleteProject(id);
      });
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-md transition-colors border border-red-500/20 disabled:opacity-50"
      title="Eliminar Proyecto"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
