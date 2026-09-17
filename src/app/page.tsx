import { Logo } from "@/components/Logo";
import { prisma } from "@/lib/prisma";
import { safeParseTags } from "@/lib/utils";
import { FadeIn } from "@/components/FadeIn";
import { ContactForm } from "@/components/ContactForm";
import { SocialLinks } from "@/components/SocialLinks";
import { AboutPhoto } from "@/components/AboutPhoto";
import { TerminalHero } from "@/components/TerminalHero";
import { DiscordPresence } from "@/components/DiscordPresence";
import { ProjectCard } from "@/components/ProjectCard";
import Link from "next/link";

export const revalidate = 60; // Revalida cada minuto (SSG + ISR)

export default async function Home() {
  let profile: any = await prisma.profile.findFirst();
  if (profile && !('githubUrl' in profile)) {
    try {
      const raw: any = await prisma.$queryRawUnsafe('SELECT * FROM "Profile" LIMIT 1');
      if (raw && raw.length > 0) {
        profile = { ...profile, ...raw[0] };
      }
    } catch {}
  }
  const projects = await prisma.project.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
  const posts = await prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3 });

  const socialLinks = {
    github: profile?.githubUrl,
    linkedin: profile?.linkedinUrl,
    discord: profile?.discordUrl,
    email: profile?.email,
  };

  return (
    <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden">
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-mono">
              <a href="#about" className="hover:text-cyan-400 transition-colors">/sobre-mi</a>
              <a href="#projects" className="hover:text-cyan-400 transition-colors">/proyectos</a>
              <a href="#blog" className="hover:text-cyan-400 transition-colors">/blog</a>
              <Link href="/lente" className="hover:text-cyan-400 transition-colors text-slate-400">/lente</Link>
              <a href="#contact" className="hover:text-cyan-400 transition-colors">/contacto</a>
            </nav>
            <div className="border-l border-white/10 pl-4 hidden sm:block">
              <SocialLinks variant="navbar" links={socialLinks} />
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12 min-h-[calc(100vh-4rem)]">
        <div className="flex-1 space-y-6 z-10">
          <FadeIn delay={0.1}>
            <DiscordPresence />
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
              Software Programmer <br/>
              <span className="text-cyan-400">&</span> Cybersecurity
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-lg text-slate-400 max-w-xl">
              {profile?.description || "Construyendo soluciones escalables, eficientes y seguras. Me enfoco en la calidad del código y la resiliencia de la infraestructura."}
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a href="#projects" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-md transition-colors flex items-center gap-2 font-mono text-sm">
                <span>Ver Proyectos</span>
              </a>
              <a href="#contact" className="bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-md border border-white/10 transition-colors font-mono text-sm">
                Contactar
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.45}>
            <div className="pt-2 space-y-2">
              <span className="text-xs font-mono text-slate-500 block tracking-wider">// ENLACES_DE_RED</span>
              <SocialLinks variant="hero" links={socialLinks} />
            </div>
          </FadeIn>
        </div>

        {/* Componente de Terminal Hero Interactiva */}
        <div className="flex-1 w-full max-w-lg lg:max-w-xl">
          <FadeIn delay={0.5}>
            <TerminalHero
              projects={projects}
              profileDescription={profile?.description}
            />
          </FadeIn>
        </div>
      </main>

      {/* SECCIÓN SOBRE MÍ */}
      <section id="about" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3 font-mono">
              <span className="text-cyan-400 text-xl">01.</span> /sobre-mi
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <FadeIn delay={0.2}>
                <AboutPhoto />
              </FadeIn>
            </div>
            
            <div className="lg:col-span-7 space-y-6">
              <FadeIn delay={0.3}>
                <div className="bg-black/60 p-8 rounded-xl border border-white/10 relative overflow-hidden backdrop-blur-sm shadow-xl space-y-6">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-slate-300 leading-relaxed font-sans">
                      {profile?.description || "Soy un desarrollador apasionado por crear arquitectura resiliente y sistemas seguros. Me especializo en diseño de software robusto, análisis de seguridad y optimización de rendimiento en aplicaciones web modernas."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 font-mono text-xs text-slate-400">
                    <div className="space-y-1">
                      <span className="text-cyan-400 block font-semibold">// ROL_PRINCIPAL</span>
                      <span className="text-white">{profile?.title || "Software Programmer"}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-cyan-400 block font-semibold">// ESPECIALIDAD</span>
                      <span className="text-white">Cybersecurity & Cloud</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-cyan-400 block font-semibold">// CORE_STACK</span>
                      <span className="text-slate-300">Next.js • Node.js • Prisma</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-cyan-400 block font-semibold">// DISPONIBILIDAD</span>
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Open to Opportunities
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono text-slate-500">// OFFLINE_HOBBY</span>
                    <Link
                      href="/lente"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                    >
                      <span>Cuando no estoy programando (Fotografía)</span>
                      <span>/lente ↗</span>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
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
                  <ProjectCard project={project} />
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
                  <article className="p-6 bg-black/50 border border-white/10 rounded-xl hover:border-cyan-500/30 transition-all group">
                    <div className="flex flex-col sm:flex-row gap-5 items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-mono text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            {post.type}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {new Date(post.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                          <a href={`/blog/${post.slug}`}>{post.title}</a>
                        </h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {post.content.replace(/[#*`_\[\]]/g, '')}
                        </p>
                        <a href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors">
                          <span>Leer payload completo</span>
                          <span>↗</span>
                        </a>
                      </div>

                      {post.imageUrl && (
                        <a
                          href={`/blog/${post.slug}`}
                          className="w-full sm:w-36 h-28 relative rounded-lg overflow-hidden border border-white/10 shrink-0 bg-neutral-900 group/thumb"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                        </a>
                      )}
                    </div>
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
      <footer className="border-t border-white/5 py-12 text-center text-slate-500 text-sm font-mono space-y-6">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <SocialLinks variant="footer" links={socialLinks} />
          <div className="text-xs text-slate-600 space-y-1">
            <p>Construido con <span className="text-cyan-400">React & Next.js</span>. Protegido por arquitectura defensiva.</p>
            <p>© {new Date().getFullYear()} nanobit.me — Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
