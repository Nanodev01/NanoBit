"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { Headphones, Code2 } from "lucide-react";

interface LanyardActivity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
}

interface LanyardData {
  discord_status: "online" | "idle" | "dnd" | "offline";
  listening_to_spotify: boolean;
  spotify?: {
    song: string;
    artist: string;
    album_art_url: string;
  } | null;
  activities: LanyardActivity[];
}

interface DiscordPresenceProps {
  discordUserId?: string;
}

export function DiscordPresence({ discordUserId }: DiscordPresenceProps) {
  // Se puede pasar por prop o configurar en siteConfig / variable de entorno
  const userId =
    discordUserId ||
    process.env.NEXT_PUBLIC_DISCORD_USER_ID ||
    siteConfig.handles.discordId;

  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchPresence() {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && isMounted) {
          setData(json.data);
        }
      } catch {
        // Silencioso si Lanyard no responde o no hay red
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPresence();
    const interval = setInterval(fetchPresence, 30000); // Polling cada 30s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  // Si no hay Discord ID o está offline/cargando, muestra el badge seguro por defecto
  if (!data || !userId || data.discord_status === "offline") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>System Online</span>
      </div>
    );
  }

  // Detectar actividad de VS Code
  const vsCodeActivity = data.activities?.find(
    (act) => act.name.toLowerCase().includes("code") || act.name.toLowerCase().includes("studio")
  );

  // Status visual color
  const statusColors = {
    online: "bg-emerald-400 text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    idle: "bg-amber-400 text-amber-400 border-amber-500/30 bg-amber-500/10",
    dnd: "bg-red-400 text-red-400 border-red-500/30 bg-red-500/10",
    offline: "bg-slate-400 text-slate-400 border-slate-500/30 bg-slate-500/10",
  };

  const currentTheme = statusColors[data.discord_status] || statusColors.online;

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      {/* Status Principal */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono transition-colors ${currentTheme}`}
      >
        <span className={`w-2 h-2 rounded-full animate-pulse ${currentTheme.split(" ")[0]}`} />
        <span className="capitalize">
          {data.discord_status === "dnd" ? "Enfocado (Do Not Disturb)" : data.discord_status}
        </span>
      </div>

      {/* Spotify Live Pill */}
      {data.listening_to_spotify && data.spotify && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono animate-in fade-in">
          <Headphones className="w-3.5 h-3.5 animate-bounce" />
          <span className="truncate max-w-[180px]">
            {data.spotify.song} — {data.spotify.artist}
          </span>
        </div>
      )}

      {/* VS Code Live Pill */}
      {vsCodeActivity && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-mono">
          <Code2 className="w-3.5 h-3.5" />
          <span className="truncate max-w-[180px]">
            {vsCodeActivity.details || vsCodeActivity.state || "Programando en VS Code"}
          </span>
        </div>
      )}
    </div>
  );
}
