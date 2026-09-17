import { prisma } from "@/lib/prisma";
import { MessageList } from "./MessageList";
import { ProfileForm } from "./ProfileForm";

export default async function DashboardOverview() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 10 });
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  const profile = await prisma.profile.findFirst();

  const uptimeSeconds = process.uptime();
  const d = Math.floor(uptimeSeconds / 86400);
  const h = Math.floor((uptimeSeconds % 86400) / 3600);
  const m = Math.floor((uptimeSeconds % 3600) / 60);
  const uptimeText = `${d}d ${h}h ${m}m`;

  return (
    <main className="p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Centro de Comando</h1>
        <p className="text-slate-500 font-mono text-sm">Bienvenido de vuelta, administrador. Sistema en línea.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* STATS */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
          <h3 className="text-slate-400 text-sm font-mono mb-2">Proyectos Activos</h3>
          <p className="text-4xl font-bold text-cyan-400">{projects.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
          <h3 className="text-slate-400 text-sm font-mono mb-2">Mensajes Nuevos</h3>
          <p className="text-4xl font-bold text-cyan-400">{messages.filter(m => !m.read).length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-lg relative overflow-hidden">
          <h3 className="text-slate-400 text-sm font-mono mb-2">Estado del Sistema</h3>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            <div>
              <p className="text-2xl font-bold text-emerald-400 leading-none mb-1">En línea</p>
              <p className="text-xs text-slate-500 font-mono">
                UPTIME: {uptimeText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT MESSAGES */}
      <section id="messages" className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Mensajes Recientes</h2>
        <MessageList initialMessages={messages} />
      </section>

      {/* PROFILE EDITOR & SOCIAL SETTINGS */}
      <section id="profile" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Perfil & Configuración de Redes</h2>
          <ProfileForm initialProfile={profile} />
      </section>
    </main>
  );
}
