"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors rounded-md font-mono text-sm"
    >
      <LogOut className="w-4 h-4" /> Cerrar Sesión
    </button>
  );
}
