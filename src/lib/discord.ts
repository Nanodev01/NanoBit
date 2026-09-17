/**
 * Servicio de notificaciones a Discord mediante Webhooks.
 * Envía alertas con embeds enriquecidos cuando se recibe un mensaje
 * desde el formulario web o desde la consola CLI.
 */

interface ContactNotificationParams {
  name: string;
  email: string;
  content: string;
  source?: "web_form" | "terminal_cli";
}

export async function sendDiscordNotification({
  name,
  email,
  content,
  source = "web_form",
}: ContactNotificationParams): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    // Si no está configurada la URL del webhook en las variables de entorno, no bloqueamos la app
    console.warn("DISCORD_WEBHOOK_URL no está configurada. Alerta de Discord omitida.");
    return false;
  }

  const isCli = source === "terminal_cli";
  const sourceLabel = isCli ? "Terminal Hero (CLI)" : "Formulario Web";
  const color = isCli ? 0x10b981 : 0x06b6d4; // Emerald para CLI, Cyan para Form

  const payload = {
    username: "nanobit.me Alert Gateway",
    avatar_url: "https://nanobit.me/icon.svg",
    embeds: [
      {
        title: isCli ? "⚡ Transmisión vía CLI Terminal" : "📩 Nuevo Mensaje de Contacto",
        description: `Se ha recibido un nuevo payload de contacto desde **${sourceLabel}**.`,
        color: color,
        fields: [
          {
            name: "👤 Remitente",
            value: name || "Anónimo",
            inline: true,
          },
          {
            name: "📧 Correo",
            value: email ? `\`${email}\`` : "No provisto",
            inline: true,
          },
          {
            name: "📝 Mensaje",
            value: content ? content.slice(0, 1024) : "Sin contenido",
          },
        ],
        footer: {
          text: `nanobit.me • Origen: ${sourceLabel}`,
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(`Error enviando notificación a Discord: HTTP ${res.status}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Excepción al disparar webhook de Discord:", err);
    return false;
  }
}
