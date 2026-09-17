# Proyecto de Portfolio Web: nanobit.me

## Visión General
Portfolio web moderno, reactivo y escalable orientado a un perfil de Programación y Ciberseguridad. 
Estilo: Darkmode minimalista, enterprise security, rigor técnico y sobriedad.

## Requisitos Principales
- **PWA (Progressive Web App):** Instalable y con soporte offline básico.
- **Frontend Moderno:** Reactivo y rápido.
- **Diseño:** Estilo hacker/cybersecurity, dark mode por defecto, diseño limpio, SVGs personalizados.
- **Secciones Públicas:**
  - Inicio (Sobre mí dinámico)
  - Proyectos / Apps
  - Blog / Certificaciones / Novedades
  - Contacto
- **Panel de Administración (`/admin`):**
  - Autenticación segura mediante JWT (preparada para OTP por SMS a futuro).
  - Gestión del texto "Sobre mí".
  - Gestión de Proyectos (Apps).
  - Gestión del Blog (Certificados, posts de LinkedIn, etc.).
- **Seguridad:** Estándares altos (OWASP, validación de inputs, protección CSRF/XSS, secure cookies).
- **Escalabilidad:** Arquitectura preparada para integraciones futuras y alta concurrencia.

## Stack Tecnológico Propuesto (A Confirmar)
- **Framework Frontend/Backend:** Next.js (React) - Permite SSR/SSG para el blog (SEO), API routes para el backend, y excelente rendimiento.
- **Estilos:** Tailwind CSS + Shadcn UI (Ideal para el aspecto "Enterprise Security/Minimalista", superior a Bootstrap para estilos muy customizados modernos).
- **Base de Datos:** PostgreSQL con Prisma ORM (Relacional, robusta, segura).
- **Autenticación:** NextAuth.js o implementación JWT customizada.

## Bitácora del Proyecto
- **[2026-09-16]** Fase 1: Recopilación de requerimientos iniciales y definición de arquitectura. Pendiente de respuestas del usuario para iniciar el setup.
- **[2026-09-16]** Fase 2: Implementación de la vista pública. Desarrollo del Logo SVG (`nanobit.me`) y componente Terminal simulada. Configuración de Framer Motion para animaciones de entrada. Implementación de base de datos SQLite y Prisma ORM con un script de semilla.
- **[2026-09-16]** Fase 3: Construcción del Panel de Administración. Se protegió la ruta `/admin` con un middleware comprobando JWT HttpOnly cookies. Se crearon secciones modulares (Dashboard, Proyectos, Perfil, Mensajes y Blog).
- **[2026-09-16]** Fase 4: Implementación Server Actions para CRUD. Integración del compilador Markdown para las entradas del blog (`react-markdown`).
- **[2026-09-16]** Fase 5: Refinamientos finales. Reemplazo del favicon de Next.js por el escudo-nodo SVG personalizado. Generación de `Dockerfile` y `docker-compose.yml` para despliegue aislado en Coolify con volumen persistente en SQLite.
