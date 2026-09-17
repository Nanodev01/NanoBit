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

    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    await prisma.project.create({
      data: {
        title,
        description,
        url,
        repoUrl,
        published,
        tags: JSON.stringify(tagsArray)
      }
    });

    revalidatePath("/admin/dashboard/projects");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error al crear proyecto:", err);
    return { error: err?.message || "Error al crear el proyecto" };
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
    const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
    const published = formData.get("published") === "on";
    
    if (!title || !content) {
      return { error: "Título y contenido son obligatorios" };
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now()}`;

    await prisma.post.create({
      data: {
        title,
        slug,
        content,
        type,
        imageUrl,
        published
      }
    });

    revalidatePath("/admin/dashboard/blog");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error al crear publicación:", err);
    return { error: err?.message || "Error al crear la publicación" };
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

    // Procesar archivo subido localmente si existe
    const file = formData.get("file") as File | null;
    if (file && file.size > 0 && typeof file.arrayBuffer === "function") {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads", "photos");
        await fs.mkdir(uploadDir, { recursive: true });

        const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
        const filename = `${Date.now()}-${safeName}`;
        const fullPath = path.join(uploadDir, filename);

        await fs.writeFile(fullPath, buffer);
        finalImageUrl = `/uploads/photos/${filename}`;
      } catch (err) {
        console.error("Error al guardar archivo en disco:", err);
        return { error: "Error al guardar el archivo en el servidor" };
      }
    }

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
