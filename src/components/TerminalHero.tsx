"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  url?: string | null;
  repoUrl?: string | null;
}

interface TerminalHeroProps {
  projects?: ProjectItem[];
  profileDescription?: string;
}

interface HistoryEntry {
  id: string;
  command?: string;
  output: React.ReactNode;
}

type ThemeColor = "cyan" | "emerald" | "violet" | "amber";

export function TerminalHero({ projects = [], profileDescription }: TerminalHeroProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: "init-1",
      output: (
        <div className="space-y-1 text-slate-400">
          <p className="text-slate-500">// nanobit.me Kernel v2.4.0-release (x86_64)</p>
          <p className="text-slate-500">// Inicialización de sesión interactiva segura [OK]</p>
          <p className="text-white mt-2">
            Escribe <span className="text-cyan-400 font-bold">help</span> o <span className="text-cyan-400 font-bold">?</span> para desplegar los comandos disponibles.
          </p>
        </div>
      ),
    },
  ]);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [theme, setTheme] = useState<ThemeColor>("cyan");
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);

  // Cargar tema guardado desde localStorage y enfocar input
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nanobit_theme") as ThemeColor;
      if (saved && ["cyan", "emerald", "violet", "amber"].includes(saved)) {
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch {}
    inputRef.current?.focus();
  }, []);

  // Efecto de lluvia digital Matrix Canvas
  useEffect(() => {
    if (!isMatrixMode) return;

    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    updateSize();

    const characters = "0123456789ABCDEF01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 14;
    let columns = Math.floor((canvas.width || 600) / fontSize);
    let drops: number[] = Array(columns).fill(1);

    const handleResize = () => {
      updateSize();
      columns = Math.floor((canvas.width || 600) / fontSize);
      drops = Array(columns).fill(1);
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#10b981";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const intervalId = setInterval(render, 35);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMatrixMode]);

  // Salir de Matrix con tecla ESC
  useEffect(() => {
    if (!isMatrixMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMatrixMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMatrixMode]);

  // Auto-scroll al final en cada comando
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Enfocar el input al hacer clic en la terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Color de acento según theme
  const getThemeClasses = () => {
    switch (theme) {
      case "emerald":
        return {
          text: "text-emerald-400",
          border: "border-emerald-500/40",
          glow: "shadow-emerald-950/30",
          accent: "text-emerald-300",
        };
      case "violet":
        return {
          text: "text-violet-400",
          border: "border-violet-500/40",
          glow: "shadow-violet-950/30",
          accent: "text-violet-300",
        };
      case "amber":
        return {
          text: "text-amber-400",
          border: "border-amber-500/40",
          glow: "shadow-amber-950/30",
          accent: "text-amber-300",
        };
      case "cyan":
      default:
        return {
          text: "text-cyan-400",
          border: "border-cyan-500/40",
          glow: "shadow-cyan-950/30",
          accent: "text-cyan-300",
        };
    }
  };

  const themeClasses = getThemeClasses();

  const availableCommands = [
    "help",
    "about",
    "projects",
    "skills",
    "contact",
    "lente",
    "clear",
    "whoami",
    "sudo",
    "matrix",
    "theme",
    "date",
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tecla Tab: Autocompletado
    if (e.key === "Tab") {
      e.preventDefault();
      const trimmed = input.trim().toLowerCase();
      if (!trimmed) return;
      const match = availableCommands.find((cmd) => cmd.startsWith(trimmed));
      if (match) {
        setInput(match);
      }
      return;
    }

    // Flecha Arriba: Historial anterior
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex] || "");
      return;
    }

    // Flecha Abajo: Historial posterior
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex] || "");
      }
      return;
    }
  };

  const executeCommand = async (cmdString: string) => {
    const raw = cmdString.trim();
    if (!raw) return;

    // Guardar en historial de comandos ejecutados
    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    const parts = raw.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let outputContent: React.ReactNode = null;

    switch (command) {
      case "help":
      case "?":
        outputContent = (
          <div className="space-y-2 text-slate-300">
            <p className="text-xs text-slate-500">// COMANDOS_DISPONIBLES</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div>
                <span className={`${themeClasses.text} font-bold`}>about</span>
                <span className="text-slate-400"> — Perfil y biografía</span>
              </div>
              <div>
                <span className={`${themeClasses.text} font-bold`}>projects</span>
                <span className="text-slate-400"> — Apps y repositorios</span>
              </div>
              <div>
                <span className={`${themeClasses.text} font-bold`}>skills</span>
                <span className="text-slate-400"> — Matriz de tecnologías</span>
              </div>
              <div>
                <span className={`${themeClasses.text} font-bold`}>contact &lt;msg&gt;</span>
                <span className="text-slate-400"> — Enviar mensaje directo</span>
              </div>
              <div>
                <span className={`${themeClasses.text} font-bold`}>lente</span>
                <span className="text-slate-400"> — Galería fotográfica</span>
              </div>
              <div>
                <span className={`${themeClasses.text} font-bold`}>theme &lt;color&gt;</span>
                <span className="text-slate-400"> — cyan | emerald | violet | amber</span>
              </div>
              <div>
                <span className={`${themeClasses.text} font-bold`}>matrix</span>
                <span className="text-slate-400"> — Alternar lluvia digital</span>
              </div>
              <div>
                <span className={`${themeClasses.text} font-bold`}>whoami</span>
                <span className="text-slate-400"> — Información de usuario</span>
              </div>
              <div>
                <span className={`${themeClasses.text} font-bold`}>clear</span>
                <span className="text-slate-400"> — Limpiar la consola</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">Tip: Usa la tecla [Tab] para autocompletar.</p>
          </div>
        );
        break;

      case "about":
        outputContent = (
          <div className="space-y-2 text-slate-300 text-xs">
            <p className="text-white font-semibold">Nanodev — Software Programmer & Cybersecurity</p>
            <p className="text-slate-400 leading-relaxed">
              {profileDescription ||
                "Especializado en ingeniería de software resiliente, seguridad en la nube y desarrollo Fullstack con Next.js y Node."}
            </p>
            <p className="text-slate-500">
              Desplázate a la sección <a href="#about" className="text-cyan-400 underline">/sobre-mi</a> para ver el perfil completo.
            </p>
          </div>
        );
        break;

      case "projects":
        if (projects.length === 0) {
          outputContent = (
            <p className="text-xs text-slate-400">
              No hay proyectos registrados en la base de datos actualmente.
            </p>
          );
        } else {
          outputContent = (
            <div className="space-y-2.5 text-xs">
              <p className="text-slate-500">// PROYECTOS_DESTACADOS</p>
              {projects.slice(0, 4).map((p) => (
                <div key={p.id} className="border-l border-white/20 pl-2 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{p.title}</span>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                        [demo ↗]
                      </a>
                    )}
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:underline">
                        [código ↗]
                      </a>
                    )}
                  </div>
                  <p className="text-slate-400 line-clamp-1">{p.description}</p>
                </div>
              ))}
            </div>
          );
        }
        break;

      case "skills":
        outputContent = (
          <div className="space-y-2 text-xs">
            <p className="text-slate-500">// MATRIZ_TECNOLOGICA</p>
            <div className="space-y-1.5">
              <div>
                <span className="text-cyan-400 font-semibold">[BACKEND/DB]</span>
                <span className="text-slate-300 ml-2">Node.js, TypeScript, Next.js, Prisma ORM, PostgreSQL, SQLite</span>
              </div>
              <div>
                <span className="text-cyan-400 font-semibold">[SECURITY]</span>
                <span className="text-slate-300 ml-2">JWT Cryptography, OWASP Top 10, Auth Systems, Threat Modeling</span>
              </div>
              <div>
                <span className="text-cyan-400 font-semibold">[FRONTEND]</span>
                <span className="text-slate-300 ml-2">React, Tailwind CSS, Turbopack, Framer Motion</span>
              </div>
              <div>
                <span className="text-cyan-400 font-semibold">[DEVOPS]</span>
                <span className="text-slate-300 ml-2">Docker, Docker Compose, Coolify, Git CI/CD</span>
              </div>
            </div>
          </div>
        );
        break;

      case "contact":
        const messagePayload = args.join(" ").trim();
        if (!messagePayload) {
          outputContent = (
            <div className="text-xs space-y-1 text-slate-300">
              <p className="text-yellow-400">Uso: contact &lt;tu mensaje o email&gt;</p>
              <p className="text-slate-500">
                Ejemplo: <code className="text-cyan-300">contact juan@mail.com me interesa tu perfil</code>
              </p>
              <p className="text-slate-500">
                O utiliza el formulario web al final de la página en <a href="#contact" className="text-cyan-400 underline">#contacto</a>.
              </p>
            </div>
          );
        } else {
          setIsSubmitting(true);
          try {
            const res = await fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: "CLI Visitor",
                email: "cli-terminal@nanobit.me",
                content: messagePayload,
              }),
            });

            if (res.ok) {
              outputContent = (
                <div className="text-xs text-emerald-400 space-y-1">
                  <p>[OK] Mensaje transmitido a la base de datos y despachado por webhook a Discord.</p>
                  <p className="text-slate-400">Gracias por contactar. Te responderé a la brevedad.</p>
                </div>
              );
            } else {
              outputContent = (
                <p className="text-xs text-red-400">
                  [ERR] Fallo al enviar payload de contacto. Inténtalo nuevamente o usa el formulario web.
                </p>
              );
            }
          } catch {
            outputContent = (
              <p className="text-xs text-red-400">
                [ERR] Error de conexión de red al transmitir el paquete.
              </p>
            );
          } finally {
            setIsSubmitting(false);
          }
        }
        break;

      case "lente":
      case "photos":
        outputContent = (
          <div className="text-xs space-y-1 text-slate-300">
            <p>Redirigiendo al lente óptico...</p>
            <p>
              Accede a la galería en:{" "}
              <Link href="/lente" className="text-cyan-400 underline">
                /lente ↗
              </Link>
            </p>
          </div>
        );
        break;

      case "clear":
      case "cls":
        setHistory([]);
        setInput("");
        return;

      case "whoami":
        outputContent = (
          <p className="text-xs text-slate-300">
            guest@nanobit.me <span className="text-slate-500">[PRIVILEGE: VISITOR // CLEARANCE: LEVEL_1]</span>
          </p>
        );
        break;

      case "date":
        outputContent = (
          <p className="text-xs text-slate-400 font-mono">
            {new Date().toUTCString()}
          </p>
        );
        break;

      case "sudo":
        outputContent = (
          <p className="text-xs text-red-400 font-mono">
            [ACCESS_DENIED] You are not in the sudoers file. This incident has been logged and reported to Nanodev.
          </p>
        );
        break;

      case "matrix":
        const nextMatrix = !isMatrixMode;
        setIsMatrixMode(nextMatrix);
        outputContent = (
          <p className="text-xs text-emerald-400 font-mono">
            {nextMatrix
              ? "⚡ Modo Matrix Digital Rain ACTIVADO. (Presiona ESC o escribe 'matrix' para desactivar)"
              : "Modo Matrix DESACTIVADO."}
          </p>
        );
        break;

      case "theme":
        const requestedTheme = args[0]?.toLowerCase() as ThemeColor;
        if (["cyan", "emerald", "violet", "amber"].includes(requestedTheme)) {
          setTheme(requestedTheme);
          try {
            localStorage.setItem("nanobit_theme", requestedTheme);
            document.documentElement.setAttribute("data-theme", requestedTheme);
          } catch {}
          outputContent = (
            <p className="text-xs text-slate-300">
              Tema global actualizado a: <span className="font-bold uppercase text-cyan-400">{requestedTheme}</span>
            </p>
          );
        } else {
          outputContent = (
            <div className="text-xs space-y-1">
              <p className="text-yellow-400">Uso: theme &lt;cyan | emerald | violet | amber&gt;</p>
              <p className="text-slate-500">
                Ejemplo: <code className="text-cyan-300">theme emerald</code> o <code className="text-cyan-300">theme violet</code>
              </p>
            </div>
          );
        }
        break;

      default:
        outputContent = (
          <p className="text-xs text-red-400">
            Comando no reconocido: <span className="text-white">'{command}'</span>. Escribe <span className="text-cyan-300 underline">help</span> para ver la lista.
          </p>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        command: raw,
        output: outputContent,
      },
    ]);

    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitting) {
      executeCommand(input);
    }
  };

  return (
    <div
      onClick={handleTerminalClick}
      className={`rounded-xl border ${themeClasses.border} bg-black/90 overflow-hidden shadow-2xl ${themeClasses.glow} relative flex flex-col h-[380px] font-mono cursor-text transition-all duration-300`}
    >
      {/* TERMINAL HEADER */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03] select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-400/30"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-400/30"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-400/30"></div>
        </div>
        <div className="text-xs text-slate-500">guest@nanobit:~ (tty1)</div>
        <div className="text-[10px] text-slate-600 hidden sm:block">UTF-8</div>
      </div>

      {/* TERMINAL OUTPUT STREAM */}
      <div
        ref={scrollRef}
        className={`flex-1 p-4 overflow-y-auto space-y-3 text-sm scrollbar-thin scrollbar-thumb-white/10 relative z-10 ${
          isMatrixMode ? "text-emerald-400 font-bold" : "text-slate-300"
        }`}
      >
        {history.map((entry) => (
          <div key={entry.id} className="space-y-1.5 leading-relaxed">
            {entry.command && (
              <div className="flex items-center gap-2 text-xs">
                <span className={themeClasses.text}>➜</span>
                <span className="text-emerald-400">~</span>
                <span className="text-white font-semibold">{entry.command}</span>
              </div>
            )}
            <div className="pl-4">{entry.output}</div>
          </div>
        ))}

        {/* INPUT PROMPT LINE */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 text-xs pt-1">
          <span className={themeClasses.text}>➜</span>
          <span className="text-emerald-400">~</span>
          <div className="flex-1 relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              spellCheck={false}
              autoComplete="off"
              className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-0 p-0 font-mono text-xs caret-cyan-400"
              placeholder={history.length <= 1 ? "escribe 'help' y presiona Enter..." : ""}
            />
          </div>
        </form>
      </div>

      {/* MATRIX DIGITAL RAIN OVERLAY */}
      {isMatrixMode && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl bg-black/60 backdrop-blur-[1px]">
          <canvas ref={matrixCanvasRef} className="w-full h-full block opacity-90" />
          <div className="absolute top-2.5 right-3 pointer-events-auto flex items-center gap-2">
            <span className="text-[10px] text-emerald-500/80 font-mono hidden sm:inline">MATRIX_STREAM://ON</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMatrixMode(false);
              }}
              className="text-[10px] bg-black/90 hover:bg-emerald-950 text-emerald-400 border border-emerald-500/50 px-2 py-0.5 rounded font-mono transition-colors shadow"
            >
              [ESC / Salir]
            </button>
          </div>
        </div>
      )}

      {/* Cyber Scanline Subtle Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/[0.04] via-transparent to-transparent opacity-60"></div>
    </div>
  );
}
