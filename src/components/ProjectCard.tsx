"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { safeParseTags } from "@/lib/utils";
import { ExternalLink, GitBranch, Play, Sparkles, Terminal } from "lucide-react";

interface ProjectProps {
  id: string;
  title: string;
  description: string;
  url: string | null;
  repoUrl: string | null;
  imageUrl: string | null;
  gifUrl?: string | null;
  tags: string;
}

export function ProjectCard({ project }: { project: ProjectProps }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Preload GIF si existe para que al hacer hover aparezca al instante
  useEffect(() => {
    if (project.gifUrl) {
      const img = new window.Image();
      img.src = project.gifUrl;
    }
  }, [project.gifUrl]);

  // Si no subió imagen pero tiene URL de la web, usamos captura automática
  const autoPreviewUrl = project.url
    ? `https://image.thum.io/get/width/800/crop/600/${project.url}`
    : null;

  const hasStaticImage = Boolean(project.imageUrl);
  const hasGif = Boolean(project.gifUrl);
  const hasAutoPreview = !hasStaticImage && Boolean(autoPreviewUrl);

  // Determinar la imagen a mostrar:
  // Si está en hover y hay GIF -> mostrar GIF
  // Si no -> mostrar imagen estática, o auto preview, o placeholder
  let currentSrc: string | null = null;
  if (isHovered && hasGif && project.gifUrl) {
    currentSrc = project.gifUrl;
  } else if (hasStaticImage && project.imageUrl) {
    currentSrc = project.imageUrl;
  } else if (hasAutoPreview && autoPreviewUrl) {
    currentSrc = autoPreviewUrl;
  }

  const isCurrentGif = Boolean(currentSrc && (currentSrc.includes(".gif") || currentSrc === project.gifUrl));

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group h-full relative bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]"
    >
      {/* CONTENEDOR DE IMAGEN / PREVIEW / GIF */}
      <div className="h-52 bg-neutral-950 relative overflow-hidden border-b border-white/10">
        {currentSrc && !imgError ? (
          <div className="w-full h-full relative">
            {/* Si es GIF usamos img unoptimized o Image unoptimized para garantizar animación fluida */}
            {isCurrentGif ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentSrc}
                alt={project.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
            ) : (
              <Image
                src={currentSrc}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
                unoptimized={Boolean(currentSrc.includes("thum.io"))}
              />
            )}

            {/* BADGES SUPERPUESTOS */}
            <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-none z-10">
              {hasGif && isHovered && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-cyan-500 text-black px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse">
                  <Play className="w-2.5 h-2.5 fill-black" /> DEMO ANIMADA
                </span>
              )}
              {hasGif && !isHovered && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-black/80 backdrop-blur-md text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" /> GIF HOVER
                </span>
              )}
              {hasAutoPreview && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-black/80 backdrop-blur-md text-slate-300 border border-white/20 px-2 py-0.5 rounded-full">
                  WEB PREVIEW
                </span>
              )}
            </div>
          </div>
        ) : (
          /* PLACEHOLDER CYBER SI NO HAY IMAGEN */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-white/[0.03] to-transparent">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
              <Terminal className="w-8 h-8" />
            </div>
            <p className="text-white/40 font-mono text-xs tracking-wider uppercase">
              // PROJECT_SOURCE
            </p>
          </div>
        )}

        {/* Scanline cyber overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* CONTENIDO DEL PROYECTO */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors flex items-center justify-between">
            <span>{project.title}</span>
          </h3>
          <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div>
          {/* TAGS */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {safeParseTags(project.tags).map((tag: string) => (
              <span
                key={tag}
                className="text-xs font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* ACCIONES */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/10 text-sm">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-white hover:text-cyan-400 font-mono font-medium transition-colors"
              >
                <span>Ver Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white font-mono transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Código</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
