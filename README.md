# 🛡️ nanobit.me | Software Engineer & Cybersecurity Portfolio

Un portfolio web altamente seguro, interactivo y enfocado al rendimiento, diseñado para reflejar la intersección entre el Desarrollo de Software (Ingeniería) y la Ciberseguridad.

## 🚀 Tecnologías Principales

- **Frontend:** Next.js 15 (App Router), React 19
- **Estilos:** Tailwind CSS v4, Shadcn UI
- **Animaciones:** Framer Motion
- **Backend & API:** Rutas API nativas de Next.js
- **Base de Datos:** SQLite gestionado con Prisma ORM
- **Seguridad:** Autenticación por JWT (HttpOnly Cookies), Encriptación de claves con bcryptjs.
- **Despliegue:** Preparado para Docker y Coolify (Standalone Mode).

## ⚡ Características

- **Diseño "Enterprise Security":** Modo oscuro por defecto con acentos cyan. Interfaz sobria, minimalista y libre de distracciones.
- **Componentes Tecnológicos:** Hero simulando una terminal (Boot/Init system) con el estado real de Uptime de los servidores.
- **Centro de Comando (Admin Panel):** Rutas protegidas por Middleware bajo `/admin` que permiten gestionar de manera integral el sitio web sin tocar una sola línea de código:
  - Leer y eliminar mensajes recibidos del formulario público.
  - Editar dinámicamente la sección "Sobre mí".
  - Crear y actualizar Proyectos (con soporte para tags).
  - Gestionar el Blog con soporte completo para **Markdown**.
- **SEO Ready:** Al utilizar Server Components, los proyectos y entradas del blog se renderizan del lado del servidor para máxima indexación.

## 🛠️ Instalación y Desarrollo Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/nanobit-portfolio.git
   cd nanobit-portfolio
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura tus variables de entorno. Crea un archivo `.env` en la raíz basado en el siguiente formato:
   ```env
   JWT_SECRET="tu_secreto_super_seguro_para_jwt"
   DATABASE_URL="file:./dev.db"
   ```

4. Sincroniza la base de datos y crea un administrador inicial:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

Visita `http://localhost:3000` para ver la web y `http://localhost:3000/admin` para entrar a tu Centro de Comando.

## 🐳 Despliegue con Docker (Coolify)

El proyecto incluye un `Dockerfile` optimizado (multistage) para exportar el proyecto en formato standalone, reduciendo la imagen drásticamente.

El `docker-compose.yml` incluido levanta el servicio mapeando tu base de datos SQLite como un volumen persistente, por lo que las actualizaciones o reinicios en Coolify no eliminarán tus posts ni configuraciones.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE). Siéntete libre de clonarlo y adaptarlo a tus necesidades.
