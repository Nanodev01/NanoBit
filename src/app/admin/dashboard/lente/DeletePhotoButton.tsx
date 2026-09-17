"use client";

import { Trash2 } from "lucide-react";
import { deletePhoto } from "../../actions";
import { useTransition } from "react";

export function DeletePhotoButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("¿Estás seguro de eliminar esta foto de la galería?")) {
      startTransition(() => {
        deletePhoto(id);
      });
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-md transition-colors border border-red-500/20 disabled:opacity-50"
      title="Eliminar Foto"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
