import { Mail } from "lucide-react";
import { siteConfig } from "@/config/site";

// Pixel-perfect brand SVGs matching the stroke/fill style
function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function DiscordIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

interface SocialLinksProps {
  variant?: "hero" | "navbar" | "footer";
  className?: string;
  links?: {
    github?: string | null;
    linkedin?: string | null;
    discord?: string | null;
    email?: string | null;
  };
}

export function SocialLinks({ variant = "hero", className = "", links }: SocialLinksProps) {
  const githubHref = links?.github || siteConfig.links.github;
  const linkedinHref = links?.linkedin || siteConfig.links.linkedin;
  const discordHref = links?.discord || siteConfig.links.discord;
  const emailHref = links?.email
    ? (links.email.startsWith("mailto:") ? links.email : `mailto:${links.email}`)
    : siteConfig.links.email;

  const items = [
    {
      name: "GitHub",
      href: githubHref,
      handle: siteConfig.handles.github,
      icon: GithubIcon,
    },
    {
      name: "LinkedIn",
      href: linkedinHref,
      handle: siteConfig.handles.linkedin,
      icon: LinkedinIcon,
    },
    {
      name: "Discord",
      href: discordHref,
      handle: siteConfig.handles.discord,
      icon: DiscordIcon,
    },
    {
      name: "Email",
      href: emailHref,
      handle: links?.email || siteConfig.handles.email,
      icon: Mail,
    },
  ];

  if (variant === "navbar") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`${item.name} (${item.handle})`}
              className="p-2 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200"
              aria-label={item.name}
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-300 text-xs font-mono transition-all duration-200"
            >
              <Icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>{item.name}</span>
              <span className="text-slate-600 group-hover:text-cyan-500/70">/ {item.handle}</span>
            </a>
          );
        })}
      </div>
    );
  }

  // Default: Hero variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`${item.name}: ${item.handle}`}
            className="group relative p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300"
            aria-label={item.name}
          >
            <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="sr-only">{item.name}</span>
          </a>
        );
      })}
    </div>
  );
}
