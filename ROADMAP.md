# 🗺️ Roadmap & Planificación — nanobit.me v2.0

Esta hoja de ruta organiza y aterriza las 7 ideas propuestas, analizadas desde una perspectiva de **diseño UX/UI**, **impacto visual** y **viabilidad técnica**.

---

## 1. 💻 Terminal Interactiva en el Hero (CLI Widget)

### Concepto
Convertir la terminal actual (que solo reproduce texto estático) en una **consola funcional interactiva** donde el visitante pueda tipear comandos reales.

### Comandos Propuestos
- `help` / `?`: Despliega la lista de comandos disponibles con formato de ayuda técnica.
- `about`: Imprime un resumen rápido del perfil o hace scroll suave a `/sobre-mi`.
- `projects`: Muestra los proyectos destacados directamente en texto ASCII/lista con enlaces.
- `skills`: Despliega una matriz de habilidades técnicas por categorías.
- `contact <mensaje>`: Permite enviar un mensaje de contacto directo a la base de datos sin usar el formulario tradicional.
- `clear`: Limpia la pantalla de la terminal.
- **Easter Eggs:**
  - `sudo`: Responde con `permission denied: you are not nanodev` o similar.
  - `matrix`: Efecto visual de lluvia digital de caracteres.
  - `theme`: Cambia acento de color temporalmente (cyan, emerald, violeta).

---

## 2. 📝 Blog & Certificaciones: Imágenes y Social Embeds

### Mejoras Clave
1. **Soporte de Imagen Destacada (Cover/Badge):**
   - Agregar campo `imageUrl` opcional en el modelo `Post` de Prisma.
   - Si el tipo es `CERTIFICADO`, renderizar una tarjeta visual con zoom/lightbox para ver el diploma en alta resolución.
2. **Embeds de Redes Sociales (LinkedIn / X):**
   - Soporte para incrustar posts de LinkedIn o tweets mediante URLs en el Markdown.
   - Creación de componentes enriquecidos (`TweetCard` o `LinkedInPost`) con estilo oscuro adaptado a la estética de la web.

---

## 3. 👤 Foto Personal sin Fondo en "Sobre Mí"

### Opinión de Diseño
**10/10 recomendada.** Un portfolio sin rostro suele sentirse frío o plantilla genérica. Ver a la persona detrás del código transmite confianza y autenticidad.

### Tratamiento Visual Cyber/Minimal
- Fotografía sin fondo (PNG transparente).
- Posicionamiento junto al texto de biografía (layout en 2 columnas en desktop).
- **Backdrop glow:** Un halo sutil degradado en tonos cyan/esmeralda detrás de la silueta.
- Efecto hover con micro-animación de escala o filtro sutil.

---

## 4. 🌐 Enlaces a Redes Sociales

### Puntos de Contacto
- **Hero:** Iconos interactivos debajo de la presentación principal (GitHub, LinkedIn, Discord, Mail).
- **Navbar:** Iconos reducidos a la derecha junto al logo.
- **Footer:** Redes completas con badges estilizados.
- **Micro-interacción:** Tooltip con el handle (ej: `@nanodev`) y efecto glow al hacer hover.

---

## 5. 🤖 Integraciones con Discord

### Dos funcionalidades de alto impacto:
1. **Discord Webhook (Notificaciones en tiempo real):**
   - Cada vez que alguien envía un mensaje por el formulario de contacto o por la terminal interactiva, la API dispara un webhook a tu servidor privado de Discord.
   - Recibes una notificación push instantánea en el móvil con el nombre, email y mensaje.
2. **Discord Lanyard Presence (Widget en vivo):**
   - Muestra tu estado real de Discord en la web (En línea / Ausente / Ocupado).
   - Opcionalmente muestra qué estás escuchando en Spotify o qué proyecto estás editando en VS Code. Da una sensación de web viva y activa.

---

## 6. 📷 Galería de Fotografía / Paisajes ("Off-Duty")

### ¿Se va de mambo o suma?
**Suma muchísimo si se contextualiza bien.** No debe competir con el perfil de software/ciberseguridad, sino mostrar el lado creativo ("el ojo para el detalle y la estética").

### Propuesta de Implementación
- Crear una sub-sección o página discreta llamada `/lente` o `/off-duty` (o un botón *"Cuando no estoy programando ↗"*).
- Grilla minimalista tipo masonry con fotos de paisajes seleccionadas y enlace directo a tu Instagram de fotografía.
- Modal lightbox para ver las fotos a pantalla completa.

---

## 7. 🔤 Tipografía y Personalidad Visual

### Diagnóstico de la Fuente Actual
Actualmente usa una sans genérica por defecto (Inter/Geist), que es legible pero algo neutral.

### Recomendación de Stack Tipográfico
- **Títulos, Terminal, Badges y Código:** **`JetBrains Mono`** o **`Fira Code`** (le da el 100% de la identidad técnica, hacker y de ingeniería).
- **Textos largos y lectura (Blog, Biografía):** **`Plus Jakarta Sans`** o **`Geist Sans`** (para que los párrafos largos no fatiguen la vista con ancho fijo).
- **Alternativa editorial:** Si prefieres un toque sofisticado para encabezados principales, **`Instrument Serif`** combinada con `JetBrains Mono` genera un contraste moderno muy valorado en diseño contemporáneo.

---

## 📋 Plan de Ejecución por Etapas (Para Mañana)

| Fase | Tareas | Dificultad |
|---|---|---|
| **Fase 1: Identidad & Tipografía** | Implementar `JetBrains Mono`, botones de redes sociales y foto sin fondo en "Sobre mí". | 🟢 Rápida |
| **Fase 2: Terminal Interactiva** | Reescribir el componente `TerminalHero` para aceptar input, historial y comandos (`help`, `about`, `projects`, `clear`). | 🟡 Media |
| **Fase 3: Blog Enriquecido** | Soporte de imágenes para certificados y previews de posts sociales. | 🟡 Media |
| **Fase 4: Integración Discord** | Configurar Webhook para recibir mensajes del formulario en Discord + Lanyard API. | 🟡 Media |
| **Fase 5: Galería de Fotografía** | Sección o modal discreto para tu portfolio de fotos de paisajes. | 🟢 Rápida |
