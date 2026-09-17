import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const revalidate = 60;

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug, published: true }
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-cyan-500/30">
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
             <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/#blog" className="hover:text-cyan-400 transition-colors">/volver-al-portfolio</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-3xl min-h-[calc(100vh-10rem)]">
        <Link href="/#blog" className="inline-flex items-center gap-2 text-cyan-400 hover:underline mb-8 font-mono text-sm">
          <ArrowLeft className="w-4 h-4" /> CD ..
        </Link>
        
        <article className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-xl">
          <header className="mb-10 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-cyan-400 uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                {post.type}
              </span>
              <time className="text-sm text-slate-500 font-mono">
                {new Date(post.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </header>

          <div className="prose prose-invert prose-cyan max-w-none prose-pre:bg-black/80 prose-pre:border prose-pre:border-white/10 prose-headings:text-white prose-a:text-cyan-400">
            <ReactMarkdown>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 text-center text-slate-600 text-sm font-mono mt-auto">
        <p>Construido con <span className="text-cyan-500">React & Next.js</span>. Protegido por estándares de seguridad.</p>
        <p className="mt-2">© {new Date().getFullYear()} nanobit.me</p>
      </footer>
    </div>
  );
}
