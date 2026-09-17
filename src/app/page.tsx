import { Logo } from "@/components/Logo";
import { prisma } from "@/lib/prisma";
import { safeParseTags } from "@/lib/utils";
import { FadeIn } from "@/components/FadeIn";
import { ContactForm } from "@/components/ContactForm";

export const revalidate = 60; // Revalida cada minuto (SSG + ISR)

export default async function Home() {
  const profile = await prisma.profile.findFirst();
  const projects = await prisma.project.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
  const posts = await prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3 });

  return (
    <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden">
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#about" className="hover:text-cyan-400 transition-colors">/sobre-mi</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">/proyectos</a>
            <a href="#blog" className="hover:text-cyan-400 transition-colors">/blog</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">/contacto</a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12 min-h-[calc(100vh-4rem)]">
        <div className="flex-1 space-y-6 z-10">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              System Online
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
              Software Engineer <br/>
              <span className="text-cyan-400">&</span> Cybersecurity
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-lg text-slate-400 max-w-xl">
              {profile?.description || "Construyendo soluciones escalables, eficientes y seguras. Me enfoco en la calidad del código y la resiliencia de la infraestructura."}
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="flex items-center gap-4 pt-4">
              <a href="#projects" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-md transition-colors flex items-center gap-2">
                <span>Ver Proyectos</span>
              </a>
              <a href="#contact" className="bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-md border border-white/10 transition-colors">
                Contactar
              </a>
            </div>
          </FadeIn>
        </div>

        {/* Componente de Terminal Hero Decorativo */}
        <div className="flex-1 w-full max-w-lg hidden lg:block">
          <FadeIn delay={0.5}>
            <div className="rounded-lg border border-white/10 bg-black overflow-hidden shadow-2xl shadow-cyan-900/20 relative">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="mx-auto text-xs text-slate-500 font-mono">root@nanobit:~</div>
              </div>
              <div className="p-4 font-mono text-sm space-y-2 h-[300px] text-slate-300">
                <div className="flex gap-2">
                  <span className="text-cyan-400">➜</span>
                  <span className="text-emerald-400">~</span>
                  <span>./init_system.sh</span>
                </div>
                <div className="text-slate-500">[OK] Cargando módulos de seguridad...</div>
                <div className="text-slate-500">[OK] Inicializando entorno de desarrollo...</div>
                <div className="flex gap-2 mt-4">
                  <span className="text-cyan-400">➜</span>
                  <span className="text-emerald-400">~</span>
                  <span className="text-yellow-300">whoami</span>
                </div>
                <div className="text-white mt-1">nanodev</div>
                <div className="flex gap-2 mt-4">
                  <span className="text-cyan-400 animate-pulse">▋</span>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent opacity-50"></div>
            </div>
          </FadeIn>
        </div>
      </main>

      {/* SECCIÓN SOBRE MÍ */}
      <section id="about" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-xl">01.</span> /sobre-mi
            </h2>
            <div className="bg-black/50 p-8 rounded-lg border border-white/10 prose prose-invert max-w-none">
              <p className="text-lg text-slate-300 leading-relaxed">
                {profile?.description || "Soy un desarrollador apasionado por crear arquitectura resiliente y sistemas seguros..."}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SECCIÓN PROYECTOS */}
      <section id="projects" className="py-24">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-xl">02.</span> /proyectos
            </h2>
          </FadeIn>
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <FadeIn key={project.id} delay={index * 0.1}>
                  <div className="group h-full relative bg-black/40 border border-white/10 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-colors">
                    <div className="h-48 bg-white/5 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono text-sm">
                        [IMG_NOT_FOUND]
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-slate-400 text-sm mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {safeParseTags(project.tags).map((tag: string) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        {project.url && <a href={project.url} target="_blank" rel="noreferrer" className="text-sm text-white hover:text-cyan-400">Ver Demo ↗</a>}
                        {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-sm text-slate-400 hover:text-white">Código ↗</a>}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn>
               <div className="text-center py-12 border border-dashed border-white/20 rounded-lg">
                  <p className="text-slate-500 font-mono">No hay proyectos publicados aún. Inicializando base de datos...</p>
               </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* SECCIÓN BLOG / CERTIFICADOS */}
      <section id="blog" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-xl">03.</span> /novedades_y_certificaciones
            </h2>
          </FadeIn>

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <FadeIn key={post.id} delay={index * 0.1}>
                  <article className="p-6 bg-black/50 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-cyan-400 uppercase">{post.type}</span>
                      <span className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 hover:text-cyan-400 transition-colors">
                      <a href={`/blog/${post.slug}`}>{post.title}</a>
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">{post.content.replace(/[#*`_\[\]]/g, '')}</p>
                    <a href={`/blog/${post.slug}`} className="text-cyan-400 hover:text-cyan-300 text-sm font-mono flex items-center gap-1">
                      Leer payload completo ↗
                    </a>
                  </article>
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn>
              <div className="text-center py-12 border border-dashed border-white/20 rounded-lg">
                  <p className="text-slate-500 font-mono">Aún no hay publicaciones. Escaneando red en busca de certificados...</p>
               </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* SECCIÓN CONTACTO */}
      <section id="contact" className="py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeIn>
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold text-white">¿Iniciamos una conexión?</h2>
              <p className="text-slate-400 text-lg">
                Si tienes algún proyecto en mente, buscas consultoría en ciberseguridad o simplemente quieres conectar, envíame un payload por aquí.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <ContactForm />
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 text-center text-slate-600 text-sm font-mono">
        <p>Construido con <span className="text-cyan-500">React & Next.js</span>. Protegido por estándares de seguridad.</p>
        <p className="mt-2">© {new Date().getFullYear()} nanobit.me</p>
      </footer>
    </div>
  );
}
