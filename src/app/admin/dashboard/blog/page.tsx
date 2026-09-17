import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { DeletePostButton } from "./DeletePostButton";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="p-8">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-cyan-400" /> Blog & Novedades
          </h1>
          <p className="text-slate-500 font-mono text-sm">Gestiona tus artículos, certificados y publicaciones.</p>
        </div>
        <Link 
          href="/admin/dashboard/blog/new" 
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Nueva Publicación
        </Link>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/20 rounded-lg">
          <p className="text-slate-500 font-mono mb-4">No hay publicaciones registradas.</p>
          <Link href="/admin/dashboard/blog/new" className="text-cyan-400 hover:underline">Escribir la primera</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white/5 border border-white/10 p-6 rounded-lg flex items-center justify-between group">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {post.type}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${post.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                    {post.published ? 'Publicado' : 'Borrador'}
                  </span>
                  <span className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{post.title}</h3>
                <p className="text-slate-400 text-sm mt-2 line-clamp-1">{post.content}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DeletePostButton id={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
