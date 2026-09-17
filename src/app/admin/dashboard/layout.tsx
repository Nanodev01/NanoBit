import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";
import { LayoutDashboard, Mail, FolderGit2, FileText, Settings } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    await verifyAuth();
  } catch {
    redirect("/admin/login");
  }

  const unreadMessages = await prisma.message.count({ where: { read: false } });

  return (
    <div className="min-h-screen bg-black text-slate-300 font-sans flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 border-r border-white/5 bg-black/50 md:min-h-screen flex flex-col sticky top-0 h-screen">
        <div className="p-4 border-b border-white/5 flex justify-center md:justify-start">
          <Link href="/">
             <Logo className="scale-75 origin-left" />
          </Link>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/dashboard#messages" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <Mail className="w-5 h-5" />
            Mensajes
            {unreadMessages > 0 && (
              <span className="ml-auto bg-cyan-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadMessages}
              </span>
            )}
          </Link>
          <Link href="/admin/dashboard/projects" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <FolderGit2 className="w-5 h-5" />
            Proyectos
          </Link>
          <Link href="/admin/dashboard/blog" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
            Blog
          </Link>
          <Link href="/admin/dashboard#profile" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            Configuración
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5">
          <LogoutButton />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </div>
    </div>
  );
}
