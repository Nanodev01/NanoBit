import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderGit2, Plus, ExternalLink, GitBranch, Pencil } from "lucide-react";
import { safeParseTags } from "@/lib/utils";
import { deleteProject } from "../../actions";
import { DeleteProjectButton } from "./DeleteProjectButton";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="p-8">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FolderGit2 className="w-8 h-8 text-cyan-400" /> Proyectos
          </h1>
          <p className="text-slate-500 font-mono text-sm">Gestiona tus aplicaciones y repositorios públicos.</p>
        </div>
        <Link 
          href="/admin/dashboard/projects/new" 
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Nuevo Proyecto
        </Link>
      </header>

      {projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/20 rounded-lg">
          <p className="text-slate-500 font-mono mb-4">No hay proyectos registrados en la base de datos.</p>
          <Link href="/admin/dashboard/projects/new" className="text-cyan-400 hover:underline">Crear el primer proyecto</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white/5 border border-white/10 p-6 rounded-lg relative group">
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/admin/dashboard/projects/${project.id}/edit`}
                  className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-white/10 transition-colors"
                  title="Editar proyecto"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <DeleteProjectButton id={project.id} />
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${project.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                  {project.published ? 'Publicado' : 'Borrador'}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {safeParseTags(project.tags).map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-white/10 text-slate-300 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-white/10">
                {project.url && (
                  <a href={project.url} target="_blank" className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300">
                    <ExternalLink className="w-4 h-4" /> Demo
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" className="flex items-center gap-1 text-sm text-slate-400 hover:text-white">
                    <GitBranch className="w-4 h-4" /> Repo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
