"use server";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";

// --- PERFIL ---
export async function updateProfile(formData: FormData) {
  try {
    await verifyAuth();
  } catch (err: any) {
    return { error: err?.message || "Sesión expirada o no autorizada. Por favor inicia sesión nuevamente." };
  }

  const title = (formData.get("title") as string)?.trim() || "Software Programmer & Cybersecurity";
  const description = (formData.get("description") as string)?.trim();
  const githubUrl = (formData.get("githubUrl") as string)?.trim() || null;
  const linkedinUrl = (formData.get("linkedinUrl") as string)?.trim() || null;
  const discordUrl = (formData.get("discordUrl") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  
  if (!description) return { error: "La descripción no puede estar vacía" };

  try {
    const profile = await prisma.profile.findFirst();
    
    try {
      if (profile) {
        await prisma.profile.update({
          where: { id: profile.id },
          data: {
            title,
            description,
            githubUrl,
            linkedinUrl,
            discordUrl,
            email,
          },
        });
      } else {
        await prisma.profile.create({
          data: {
            title,
            description,
            githubUrl,
            linkedinUrl,
            discordUrl,
            email,
          },
        });
      }
    } catch (clientErr: any) {
      // Si el cliente en memoria de Prisma aún no reconoce los campos nuevos, aplicamos fallback SQL directo
      console.warn("Prisma Client validation failed, using direct SQLite fallback:", clientErr?.message);

      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Profile" ADD COLUMN "githubUrl" TEXT;`);
      } catch {}
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Profile" ADD COLUMN "linkedinUrl" TEXT;`);
      } catch {}
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Profile" ADD COLUMN "discordUrl" TEXT;`);
      } catch {}
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Profile" ADD COLUMN "email" TEXT;`);
      } catch {}

      if (profile) {
        await prisma.$executeRawUnsafe(
          `UPDATE "Profile" SET "title" = ?, "description" = ?, "githubUrl" = ?, "linkedinUrl" = ?, "discordUrl" = ?, "email" = ?, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = ?`,
          title, description, githubUrl, linkedinUrl, discordUrl, email, profile.id
        );
      } else {
        const newId = crypto.randomUUID();
        await prisma.$executeRawUnsafe(
          `INSERT INTO "Profile" ("id", "title", "description", "githubUrl", "linkedinUrl", "discordUrl", "email", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          newId, title, description, githubUrl, linkedinUrl, discordUrl, email
        );
      }
    }

    try {
      revalidatePath("/");
      revalidatePath("/admin/dashboard");
    } catch {}

    return { success: true };
  } catch (err: any) {
    console.error("Error al actualizar perfil en BD:", err);
    return { error: err?.message || "Error al actualizar perfil en la base de datos." };
  }
}

// --- MENSAJES ---
export async function markMessageAsRead(id: string) {
  try {
    await verifyAuth();
    await prisma.message.update({
      where: { id },
      data: { read: true },
    });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error al marcar mensaje como leído:", err);
    return { error: err?.message || "Error al actualizar mensaje" };
  }
}

export async function deleteMessage(id: string) {
  try {
    await verifyAuth();
    await prisma.message.delete({
      where: { id },
    });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error al eliminar mensaje:", err);
    return { error: err?.message || "Error al eliminar mensaje" };
  }
}

async function saveUploadedFile(file: File | null, subfolder: string): Promise<string | null> {
  if (!file || file.size === 0 || typeof file.arrayBuffer !== "function") {
    return null;
  }
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads", subfolder);
    await fs.mkdir(uploadDir, { recursive: true });

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
    const filename = `${Date.now()}-${safeName}`;
    const fullPath = path.join(uploadDir, filename);

    await fs.writeFile(fullPath, buffer);
    return `/uploads/${subfolder}/${filename}`;
  } catch (err) {
    console.error(`Error al guardar archivo en ${subfolder}:`, err);
    return null;
  }
}

// --- PROYECTOS ---
export async function createProject(formData: FormData) {
  try {
    await verifyAuth();

    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const url = (formData.get("url") as string)?.trim() || null;
    const repoUrl = (formData.get("repoUrl") as string)?.trim() || null;
    const tags = (formData.get("tags") as string) || "";
    const published = formData.get("published") === "on";

    if (!title || !description) {
      return { error: "Título y descripción son obligatorios" };
    }

    let finalImageUrl = (formData.get("imageUrl") as string)?.trim() || null;
    const imageFile = formData.get("imageFile") as File | null;
    const uploadedImageUrl = await saveUploadedFile(imageFile, "projects");
    if (uploadedImageUrl) finalImageUrl = uploadedImageUrl;

    let finalGifUrl = (formData.get("gifUrl") as string)?.trim() || null;
    const gifFile = formData.get("gifFile") as File | null;
    const uploadedGifUrl = await saveUploadedFile(gifFile, "projects");
    if (uploadedGifUrl) finalGifUrl = uploadedGifUrl;

    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      await (prisma.project as any).create({
        data: {
          title,
          description,
          url,
          repoUrl,
          imageUrl: finalImageUrl,
          gifUrl: finalGifUrl,
          published,
          tags: JSON.stringify(tagsArray)
        }
      });
    } catch (clientErr: any) {
      console.warn("Prisma Client validation failed for Project, using direct SQLite fallback:", clientErr?.message);
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Project" ADD COLUMN "imageUrl" TEXT;`);
      } catch {}
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Project" ADD COLUMN "gifUrl" TEXT;`);
      } catch {}
      const newId = crypto.randomUUID();
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Project" ("id", "title", "description", "url", "repoUrl", "imageUrl", "gifUrl", "tags", "published", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        newId, title, description, url, repoUrl, finalImageUrl, finalGifUrl, JSON.stringify(tagsArray), published ? 1 : 0
      );
    }

    revalidatePath("/admin/dashboard/projects");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error al crear proyecto:", err);
    return { error: err?.message || "Error al crear el proyecto" };
  }
}

export async function updateProject(formData: FormData) {
  try {
    await verifyAuth();

    const id = (formData.get("id") as string)?.trim();
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const url = (formData.get("url") as string)?.trim() || null;
    const repoUrl = (formData.get("repoUrl") as string)?.trim() || null;
    const tags = (formData.get("tags") as string) || "";
    const published = formData.get("published") === "on";

    if (!id || !title || !description) {
      return { error: "ID, título y descripción son obligatorios" };
    }

    let finalImageUrl = (formData.get("imageUrl") as string)?.trim() || null;
    const imageFile = formData.get("imageFile") as File | null;
    const uploadedImageUrl = await saveUploadedFile(imageFile, "projects");
    if (uploadedImageUrl) finalImageUrl = uploadedImageUrl;

    let finalGifUrl = (formData.get("gifUrl") as string)?.trim() || null;
    const gifFile = formData.get("gifFile") as File | null;
    const uploadedGifUrl = await saveUploadedFile(gifFile, "projects");
    if (uploadedGifUrl) finalGifUrl = uploadedGifUrl;

    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      await (prisma.project as any).update({
        where: { id },
        data: {
          title,
          description,
          url,
          repoUrl,
          imageUrl: finalImageUrl,
          gifUrl: finalGifUrl,
          published,
          tags: JSON.stringify(tagsArray)
        }
      });
    } catch (clientErr: any) {
      console.warn("Prisma Client validation failed for updateProject, using direct SQLite fallback:", clientErr?.message);
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Project" ADD COLUMN "imageUrl" TEXT;`);
      } catch {}
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Project" ADD COLUMN "gifUrl" TEXT;`);
      } catch {}
      await prisma.$executeRawUnsafe(
        `UPDATE "Project" SET "title" = ?, "description" = ?, "url" = ?, "repoUrl" = ?, "imageUrl" = ?, "gifUrl" = ?, "tags" = ?, "published" = ?, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = ?`,
        title, description, url, repoUrl, finalImageUrl, finalGifUrl, JSON.stringify(tagsArray), published ? 1 : 0, id
      );
    }

    revalidatePath("/admin/dashboard/projects");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error al actualizar proyecto:", err);
    return { error: err?.message || "Error al actualizar el proyecto" };
  }
}

export async function deleteProject(id: string) {
  try {
    await verifyAuth();
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/dashboard/projects");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error al eliminar proyecto:", err);
    return { error: err?.message || "Error al eliminar el proyecto" };
  }
}

// --- BLOG ---
export async function createPost(formData: FormData) {
  try {
    await verifyAuth();

    const title = (formData.get("title") as string)?.trim();
    const content = (formData.get("content") as string)?.trim();
    const type = (formData.get("type") as string) || "blog";
    let finalImageUrl = (formData.get("imageUrl") as string)?.trim() || null;
    const file = formData.get("file") as File | null;
    const uploadedImageUrl = await saveUploadedFile(file, "posts");
    if (uploadedImageUrl) finalImageUrl = uploadedImageUrl;

    const published = formData.get("published") === "on";
    
    if (!title || !content) {
      return { error: "Título y contenido son obligatorios" };
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now()}`;

    try {
      await prisma.post.create({
        data: {
          title,
          slug,
          content,
          type,
          imageUrl: finalImageUrl,
          published
        }
      });
    } catch (clientErr: any) {
      console.warn("Prisma Client validation failed for Post, using direct SQLite fallback:", clientErr?.message);
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Post" ADD COLUMN "imageUrl" TEXT;`);
      } catch {}
      const newId = crypto.randomUUID();
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Post" ("id", "title", "slug", "content", "type", "imageUrl", "published", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        newId, title, slug, content, type, finalImageUrl, published ? 1 : 0
      );
    }

    revalidatePath("/admin/dashboard/blog");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error al crear publicación:", err);
    return { error: err?.message || "Error al crear la publicación" };
  }
}

export async function updatePost(formData: FormData) {
  try {
    await verifyAuth();

    const id = (formData.get("id") as string)?.trim();
    const title = (formData.get("title") as string)?.trim();
    const content = (formData.get("content") as string)?.trim();
    const type = (formData.get("type") as string) || "blog";
    let finalImageUrl = (formData.get("imageUrl") as string)?.trim() || null;
    const file = formData.get("file") as File | null;
    const uploadedImageUrl = await saveUploadedFile(file, "posts");
    if (uploadedImageUrl) finalImageUrl = uploadedImageUrl;

    const published = formData.get("published") === "on";

    if (!id || !title || !content) {
      return { error: "ID, título y contenido son obligatorios" };
    }

    try {
      await prisma.post.update({
        where: { id },
        data: {
          title,
          content,
          type,
          imageUrl: finalImageUrl,
          published,
        },
      });
    } catch (clientErr: any) {
      console.warn("Prisma Client validation failed for updatePost, using direct SQLite fallback:", clientErr?.message);
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Post" ADD COLUMN "imageUrl" TEXT;`);
      } catch {}
      await prisma.$executeRawUnsafe(
        `UPDATE "Post" SET "title" = ?, "content" = ?, "type" = ?, "imageUrl" = ?, "published" = ?, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = ?`,
        title, content, type, finalImageUrl, published ? 1 : 0, id
      );
    }

    revalidatePath("/admin/dashboard/blog");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error al actualizar publicación:", err);
    return { error: err?.message || "Error al actualizar la publicación" };
  }
}

export async function deletePost(id: string) {
  try {
    await verifyAuth();
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/dashboard/blog");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error al eliminar post:", err);
    return { error: err?.message || "Error al eliminar post" };
  }
}

// --- FOTOS (/LENTE) ---
export async function createPhoto(formData: FormData) {
  try {
    await verifyAuth();

    const title = (formData.get("title") as string)?.trim();
    const location = (formData.get("location") as string)?.trim() || null;
    const category = (formData.get("category") as string)?.trim() || "Paisaje";
    const cameraInfo = (formData.get("cameraInfo") as string)?.trim() || null;
    const date = (formData.get("date") as string)?.trim() || null;
    const published = formData.get("published") === "on";

    if (!title) {
      return { error: "El título de la foto es obligatorio" };
    }

    let finalImageUrl = (formData.get("imageUrl") as string)?.trim() || "";

    const file = formData.get("file") as File | null;
    const uploaded = await saveUploadedFile(file, "photos");
    if (uploaded) finalImageUrl = uploaded;

    if (!finalImageUrl) {
      return { error: "Debes subir una foto o ingresar una URL de imagen válida" };
    }

    await prisma.photo.create({
      data: {
        title,
        location,
        category,
        imageUrl: finalImageUrl,
        cameraInfo,
        date,
        published,
      },
    });

    revalidatePath("/lente");
    revalidatePath("/admin/dashboard/lente");
    return { success: true };
  } catch (err: any) {
    console.error("Error al subir foto:", err);
    return { error: err?.message || "Error al procesar la foto" };
  }
}

export async function deletePhoto(id: string) {
  try {
    await verifyAuth();
    await prisma.photo.delete({ where: { id } });
    revalidatePath("/lente");
    revalidatePath("/admin/dashboard/lente");
    return { success: true };
  } catch (err: any) {
    console.error("Error al eliminar foto:", err);
    return { error: err?.message || "Error al eliminar foto" };
  }
}
